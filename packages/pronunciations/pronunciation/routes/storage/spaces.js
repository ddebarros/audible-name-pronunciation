const SPACES_ENDPOINT = process.env['SPACES_ENDPOINT']; 
const SPACES_NAME = process.env['SPACES_NAME'];
const SPACES_KEY = process.env['SPACES_KEY']
const SPACES_SECRET = process.env['SPACES_SECRET']

function getSpacesFileBaseUrl() {
  return `https://${SPACES_NAME}.${SPACES_ENDPOINT}`
}

module.exports = {
  getSpacesFileBaseUrl,
  SPACES_ENDPOINT,
  SPACES_NAME,
  SPACES_KEY,
  SPACES_SECRET,
}