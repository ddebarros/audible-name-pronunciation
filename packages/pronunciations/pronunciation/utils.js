const bcrypt = require ('bcrypt');
const SALT_ROUNDS = 10;

async function encryptSecret(secret) {
  return bcrypt.hash(secret, SALT_ROUNDS)
};

async function compareSecret(secret, hash) {
  return bcrypt.compare(secret, hash);
}

module.exports = {
  encryptSecret,
  compareSecret
}