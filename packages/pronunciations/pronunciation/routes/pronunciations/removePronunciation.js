const mysql = require('../../mysql-client');
const { compareSecret } = require('../../utils');

async function removePronunciation(args) {
  const id = args.params.pronunciation_id;
  const secret = args.secret;
  
  if (!id || !secret) {
    return {
      statusCode: 400,
      body: `pronunciation identifier required and secret required`
    }
  }

  try {
    const connection = await mysql;
    const selectSql = `
      SELECT 
        BIN_TO_UUID(uuid) as uuid,
        secret
      FROM pronunciations
      WHERE uuid = UUID_TO_BIN('?')
    `

    const [selectRow] = await connection.query(selectSql, [id]);
    const selectedPronunciation = selectRow[0];
    if (!selectedPronunciation) {
      return {
        statusCode: 400,
        body: `unknown resource with id: ${id} `
      }
    }

    console.log('selectedPronunciation: ', selectedPronunciation);

    const secretMatches = await compareSecret(secret, selectedPronunciation.secret);
    if (!secretMatches) {
      console.log(`un-authenticated attempt to remove ${id}`)
      return {
        statusCode: 401,
        body: 'Unauthorized'
      }
    }

    const deleteSql = `
      DELETE FROM pronunciations
      WHERE uuid = UUID_TO_BIN(?) AND secret = ?
    `;

    await connection.query(
      deleteSql,
      [id, selectedPronunciation.secret]
    );

    return {
      statusCode: 200,
      body: {
        id: id,
      }
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
    }
  }
}

module.exports = removePronunciation;