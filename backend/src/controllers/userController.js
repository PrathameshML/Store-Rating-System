/**
 * userController.js
 * - profile endpoints and user's ratings
 */
const User = require('../models/User');
const Rating = require('../models/Rating');
const { validateName, validateAddress } = require('../utils/validators');
const { success, error } = require('../utils/responseHelper');

async function getProfile(req, res, next) {
  try {
    const user = req.user;
    return success(res, { id: user._id, name: user.name, email: user.email, address: user.address, role: user.role });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return error(res, 'User not found', 404);

    const { name, address } = req.body;
    if (name) {
      const nameError = validateName(name);
      if (nameError) return error(res, nameError, 400);
      user.name = name.trim();
    }
    if (typeof address !== 'undefined') {
      const addrError = validateAddress(address);
      if (addrError) return error(res, addrError, 400);
      user.address = address;
    }

    await user.save();
    return success(res, { id: user._id, name: user.name, email: user.email, address: user.address });
  } catch (err) {
    next(err);
  }
}

async function getMyRatings(req, res, next) {
  try {
    const ratings = await Rating.find({ user: req.user._id }).populate('store', 'name address').exec();
    return success(res, { ratings });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, getMyRatings };
