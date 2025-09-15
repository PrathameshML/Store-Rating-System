/**
 * validators.js
 * - Server-side validation helpers (same rules as spec)
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Password: 8-16 chars, at least one uppercase, at least one special char
const passwordRegex = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/;

function validateName(name) {
  if (!name || typeof name !== 'string') return 'Name is required';
  const len = name.trim().length;
  if (len < 20 || len > 60) return 'Name must be between 20 and 60 characters';
  return null;
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email is required';
  if (!emailRegex.test(email)) return 'Email is invalid';
  return null;
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') return 'Password is required';
  if (!passwordRegex.test(password))
    return 'Password must be 8-16 chars, include at least one uppercase letter and one special character';
  return null;
}

function validateAddress(address) {
  if (!address) return null; // optional
  if (address.length > 400) return 'Address must be at most 400 characters';
  return null;
}

function validateRole(role) {
  const allowed = ['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'];
  if (!role || !allowed.includes(role)) return `Role must be one of: ${allowed.join(', ')}`;
  return null;
}

function validateRatingValue(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 5) return 'Rating must be an integer between 1 and 5';
  return null;
}

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
  validateRole,
  validateRatingValue
};
