const mysql = require('../../mysql-client');
const { getSpacesFileBaseUrl } = require('../storage/spaces');

async function listPronunciations(args) {
  try {
    console.log('connecting to db...')
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
    const [rows] = await connection.query(sql, [`${getSpacesFileBaseUrl()}/`, `${getSpacesFileBaseUrl()}/`])
    return {
      body: rows,
    }
  } catch (error) {
    console.error(error.message)
    return {
      statusCode: 400,
      body: {
        error: 'unable to retrieve pronunciations'
      },
    }
  }
}

module.exports = listPronunciations;