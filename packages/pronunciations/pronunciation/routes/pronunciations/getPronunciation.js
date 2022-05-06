const mysql = require('../../mysql-client');
const { getSpacesFileBaseUrl } = require('../storage/spaces');

// get pronunciation
async function getPronunciation(args) {
  if (!args.params.pronunciation_id) {
    return {
      statusCode: 400,
      body: `pronunciation identifier required`
    }
  }

  try {
    const connection = await mysql;
    const sql = `
      SELECT 
        BIN_TO_UUID(uuid) as uuid, 
        name,
        sounds_like,
        CONCAT('${getSpacesFileBaseUrl()}/', audio_path) as audio_path, 
        CONCAT('${getSpacesFileBaseUrl()}/', image_path) as image_path
      FROM pronunciations
      WHERE uuid = UUID_TO_BIN('?')
    `
    const [rows] = await connection.query(sql, [args.params.pronunciation_id])
    return {
      body: rows[0],
    }
  } catch (error) {
    return {
      body: error,
    }
  }
}

module.exports = getPronunciation;