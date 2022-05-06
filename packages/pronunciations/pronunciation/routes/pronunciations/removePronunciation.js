const mysql = require('../../mysql-client');
const { encryptSecret } = require('../../utils');

async function removePronunciation(args) {
  const id = args.params.pronunciation_id;
  const secret = args.secret
  if (!id || !secret) {
    return {
      statusCode: 400,
      body: `pronunciation identifier required and secret required`
    }
  }

  try {
    const connection = await mysql;
    const encryptedSecret = await encryptSecret(secret);

    const sql = `
      DELETE FROM pronunciations
      WHERE uuid = UUID_TO_BIN(?) AND secret = ?
    `;

    const [results] = await connection.query(sql, [id, encryptedSecret]);
    if (results.affectedRows === 0) {
      console.log(`unauthed attempt to remove ${id}`)
      return {
        statusCode: 401,
        body: 'Unauthorized'    
      }
    }

    return {
      statusCode: 200,
      body: {
        id: id,
      }
    }
  } catch (error) {
    console.log(error.message)
    return {
      statusCode: 500,
    }
  }
}

module.exports = removePronunciation;