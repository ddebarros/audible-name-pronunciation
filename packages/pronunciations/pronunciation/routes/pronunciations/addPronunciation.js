const mysql = require('../../mysql-client');
const { getSpacesFileBaseUrl } = require('../storage/spaces');
const { encryptSecret } = require('../../utils');

async function addPronunciation(args) {
  const name = args.name;
  const soundsLike = args.sounds_like;
  const secret = args.secret;

  const imagePath = args.image_path;
  const audioPath = args.audio_path;

  if (!name || !secret) {
    return {
      statusCode: 400,
      body: {
        message: 'Required parameters: name and secret'
      }
    }
  }

  try {
    const connection = await mysql;
    const encryptedSecret = await encryptSecret();

    const insertSql = `
      INSERT into pronunciations (name, sounds_like, audio_path, image_path, secret) 
      VALUES (?, ?, ?, ?, ?)
    `
    const result = await connection.query(
      insertSql, 
      [name, soundsLike, audioPath, imagePath, encryptedSecret]
    );

    const insertedId = result[0].insertId;
    const selectSql = `
      SELECT 
        BIN_TO_UUID(uuid) as uuid, 
        name,
        sounds_like,
        CONCAT(?, audio_path) as audio_path, 
        CONCAT(?, image_path) as image_path
      FROM pronunciations
      WHERE id = ?
    `
    const [rows] = await connection.query(selectSql, [`${getSpacesFileBaseUrl()}/`, `${getSpacesFileBaseUrl()}/`, insertedId])

    return {
      statusCode: 200,
      body: rows[0]
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500
    }
  }
}

module.exports = addPronunciation;