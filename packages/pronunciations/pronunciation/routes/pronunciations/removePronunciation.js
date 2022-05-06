const mysql = require('../../mysql-client');

async function removePronunciation(args) {
  if (!args.params.pronunciation_id || !args.secret) {
    console.log(args)
    return {
      statusCode: 400,
      body: `pronunciation identifier required and secret required`
    }
  }

  try {
    const connection = await mysql;
    const sql = `
      DELETE FROM pronunciations
      WHERE uuid = UUID_TO_BIN(?) AND secret = ?
    `;
    const [results] = await connection.query(sql, [args.params.pronunciation_id, args.secret]);
    if (results.affectedRows === 0) {
      return {
        statusCode: 401,
        body: 'Unauthorized'    
      }
    }

    return {
      statusCode: 200,
      body: {
        id: args.params.pronunciation_id,
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