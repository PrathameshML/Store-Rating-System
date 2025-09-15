/**
 * ratingController.js
 * - createOrUpdateRating (NORMAL_USER)
 * - getRatingsForStore (STORE_OWNER or SYSTEM_ADMIN)
 */
const Rating = require('../models/Rating');
const Store = require('../models/Store');
const { validateRatingValue } = require('../utils/validators');
const { success, error } = require('../utils/responseHelper');
const mongoose = require('mongoose');

async function createOrUpdateRating(req, res, next) {
  try {
    const user = req.user;
    const storeId = req.params.storeId;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(storeId)) return error(res, 'Invalid store id', 400);

    const ratingError = validateRatingValue(rating);
    if (ratingError) return error(res, ratingError, 400);

    const store = await Store.findById(storeId);
    if (!store) return error(res, 'Store not found', 404);

    // upsert: findOneAndUpdate with upsert true
    const doc = await Rating.findOneAndUpdate(
      { user: user._id, store: store._id },
      { $set: { rating: Number(rating), comment: comment || '' } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();

    // return created/updated rating
    return success(res, { rating: doc }, 'Rating saved', doc.createdAt === doc.updatedAt ? 201 : 200);
  } catch (err) {
    // handle duplicate errors etc
    next(err);
  }
}

async function getRatingsForStore(req, res, next) {
  try {
    const storeId = req.params.storeId;
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const pageSize = Math.min(100, parseInt(req.query.pageSize || '20', 10));

    if (!mongoose.Types.ObjectId.isValid(storeId)) return error(res, 'Invalid store id', 400);

    const store = await Store.findById(storeId);
    if (!store) return error(res, 'Store not found', 404);

    // only owner or admin allowed (roleMiddleware is also used in route)
    if (req.user.role === 'STORE_OWNER') {
      if (!store.owner || String(store.owner) !== String(req.user._id)) {
        return error(res, 'Forbidden: not owner of this store', 403);
      }
    }

    const skip = (page - 1) * pageSize;
    const [total, rows] = await Promise.all([
      Rating.countDocuments({ store: store._id }).exec(),
      Rating.find({ store: store._id }).sort({ createdAt: -1 }).skip(skip).limit(pageSize).populate('user', 'name email').exec()
    ]);

    return success(res, { ratings: rows, meta: { page, pageSize, total } });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrUpdateRating, getRatingsForStore };
