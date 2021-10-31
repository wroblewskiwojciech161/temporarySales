import * as bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * @param {string | Buffer} password
 */
async function hash(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashOfPassword = await bcrypt.hash(password, salt);

  return hashOfPassword;
}

/**
 * @param {string | Buffer} password
 * @param {string} hash
 */
async function verify(password, hash) {
  const verified = await bcrypt.compare(password, hash);

  return verified;
}

export { hash, verify };
