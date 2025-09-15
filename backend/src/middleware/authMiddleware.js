/**
 * authMiddleware.js
 * - Verifies JWT from Authorization header.
 * - Attaches `req.user` (Mongoose document) or returns 401.
 */
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization required' });
    }
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id).select('-passwordHash').exec();
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token (user not found)' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
