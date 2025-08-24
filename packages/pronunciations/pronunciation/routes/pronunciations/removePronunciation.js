const mysql = require("../../mysql-client");
const { compareSecret } = require("../../utils");
const logger = require("../../utils/logger");

async function removePronunciation(args) {
  const id = args.params.pronunciation_id;
  const secret = args.secret;

  if (!id || !secret) {
    return {
      statusCode: 400,
      body: `pronunciation identifier required and secret required`,
    };
  }

  try {
    const connection = await mysql;
    logger.info("Attempting to delete pronunciation", {
      id,
      hasSecret: !!secret,
    });
    const selectSql = `
      SELECT 
        BIN_TO_UUID(uuid) as uuid,
        secret
      FROM pronunciations
      WHERE uuid = UUID_TO_BIN(?)
    `;

    const [selectRow] = await connection.query(selectSql, [id]);
    const selectedPronunciation = selectRow[0];
    if (!selectedPronunciation) {
      return {
        statusCode: 400,
        body: `unknown resource with id: ${id} `,
      };
    }

    const secretMatches = await compareSecret(
      secret,
      selectedPronunciation.secret
    );
    if (!secretMatches) {
      logger.warn("Unauthorized attempt to remove pronunciation", { id });
      return {
        statusCode: 401,
        body: "Unauthorized",
      };
    }

    const deleteSql = `
      DELETE FROM pronunciations
      WHERE uuid = UUID_TO_BIN(?) AND secret = ?
    `;

    await connection.query(deleteSql, [id, selectedPronunciation.secret]);

    return {
      statusCode: 200,
      body: {
        id: id,
      },
    };
  } catch (error) {
    logger.error("Failed to remove pronunciation", error, {
      id,
      hasSecret: !!secret,
    });
    return {
      statusCode: 500,
    };
  }
}

module.exports = removePronunciation;
