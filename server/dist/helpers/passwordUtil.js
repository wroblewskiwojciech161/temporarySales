"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hash = hash;
exports.verify = verify;

var bcrypt = _interopRequireWildcard(require("bcrypt"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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