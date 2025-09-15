/**
 * authController.js
 * - signup, login, changePassword
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateName, validateEmail, validatePassword, validateAddress } = require('../utils/validators');
const { jwtSecret, jwtExpiresIn } = require('../config/auth');
const { success, error } = require('../utils/responseHelper');

async function signup(req, res, next) {
  try {
    const { name, email, password, address } = req.body;
    const err = validateName(name) || validateEmail(email) || validatePassword(password) || validateAddress(address);
    if (err) return error(res, err, 400);

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return error(res, 'Email already registered', 409);

    const user = new User({ name: name.trim(), email: email.toLowerCase(), address, role: 'NORMAL_USER' });
    await user.setPassword(password);
    await user.save();

    return success(res, { id: user._id, email: user.email }, 'User registered', 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password required', 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return error(res, 'Invalid credentials', 401);

    const ok = await user.comparePassword(password);
    if (!ok) return error(res, 'Invalid credentials', 401);

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });

    return success(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Logged in', 200);
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user; // set by authMiddleware
    if (!oldPassword || !newPassword) return error(res, 'Old and new password are required', 400);

    const ok = await user.comparePassword(oldPassword);
    if (!ok) return error(res, 'Old password incorrect', 401);

    const passError = validatePassword(newPassword);
    if (passError) return error(res, passError, 400);

    await user.setPassword(newPassword);
    await user.save();

    return success(res, {}, 'Password changed');
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, changePassword };
