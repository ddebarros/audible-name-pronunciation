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

// const p = '1234'
// async function run() {
//   const hash = await encryptPassword(p);
//   console.log('Hash: ', hash);
//   console.log(await comparePassword('123', hash));
// }

run();