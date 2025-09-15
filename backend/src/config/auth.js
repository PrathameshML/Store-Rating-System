/**
 * auth.js
 * - Centralize auth related config (JWT secret & bcrypt rounds)
 */
require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10)
};
