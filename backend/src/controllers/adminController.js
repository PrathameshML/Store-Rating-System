/**
 * adminController.js
 * - admin dashboard (counts)
 * - admin create user
 * - admin list users
 * - admin create store
 * - admin list stores
 */
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { validateName, validateEmail, validatePassword, validateAddress, validateRole } = require('../utils/validators');
const { success, error } = require('../utils/responseHelper');

async function dashboard(req, res, next) {
  try {
    const [usersCount, storesCount, ratingsCount] = await Promise.all([
      User.countDocuments().exec(),
      Store.countDocuments().exec(),
      Rating.countDocuments().exec()
    ]);
    return success(res, { usersCount, storesCount, ratingsCount });
  } catch (err) {
    next(err);
  }
}

async function adminCreateUser(req, res, next) {
  try {
    const { name, email, password, address, role } = req.body;
    const validateErr = validateName(name) || validateEmail(email) || validatePassword(password) || validateAddress(address) || validateRole(role);
    if (validateErr) return error(res, validateErr, 400);

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return error(res, 'Email already exists', 409);

    const user = new User({ name: name.trim(), email: email.toLowerCase(), address, role });
    await user.setPassword(password);
    await user.save();

    return success(res, { id: user._id, email: user.email }, 'User created', 201);
  } catch (err) {
    next(err);
  }
}

async function adminCreateStore(req, res, next) {
  try {
    const { name, email, address, ownerId } = req.body;
    if (!name) return error(res, 'Store name required', 400);

    let owner = null;
    if (ownerId) {
      if (!require('mongoose').Types.ObjectId.isValid(ownerId)) return error(res, 'Invalid ownerId', 400);
      owner = await User.findById(ownerId);
      if (!owner) return error(res, 'Owner not found', 404);
    }

    const store = new Store({ name, email, address, owner: owner ? owner._id : null });
    await store.save();
    return success(res, { store }, 'Store created', 201);
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const pageSize = Math.min(100, parseInt(req.query.pageSize || '20', 10));
    const search = req.query.search || null;
    const skip = (page - 1) * pageSize;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };

    const [count, rows] = await Promise.all([
      User.countDocuments(filter).exec(),
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).select('-passwordHash').exec()
    ]);

    return success(res, { users: rows, meta: { total: count, page, pageSize } });
  } catch (err) {
    next(err);
  }
}

async function listStores(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const pageSize = Math.min(100, parseInt(req.query.pageSize || '20', 10));
    const search = req.query.search || null;
    const skip = (page - 1) * pageSize;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };

    const [count, rows] = await Promise.all([
      Store.countDocuments(filter).exec(),
      Store.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).populate('owner', 'name email').exec()
    ]);

    return success(res, { stores: rows, meta: { total: count, page, pageSize } });
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard, adminCreateUser, adminCreateStore, listUsers, listStores };
