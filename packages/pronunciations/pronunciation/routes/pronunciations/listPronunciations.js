const mysql = require("../../mysql-client");
const { getSpacesFileBaseUrl } = require("../storage/spaces");
const logger = require("../../utils/logger");

async function listPronunciations(args) {
  try {
    const connection = await mysql;
    const sql = `
      SELECT 
        BIN_TO_UUID(uuid) as uuid, 
        name,
        sounds_like,
        CONCAT(?, audio_path) as audio_path, 
        CONCAT(?, image_path) as image_path
      FROM pronunciations
    `;

    const [rows] = await connection.query(sql, [
      `${getSpacesFileBaseUrl()}/`,
      `${getSpacesFileBaseUrl()}/`,
    ]);

    return {
      body: rows,
    };
  } catch (error) {
    logger.error("Failed to list pronunciations", error);
    return {
      statusCode: 500,
      body: {
        message: "Unable to retrieve pronunciations",
      },
    };
  }
}

module.exports = listPronunciations;
