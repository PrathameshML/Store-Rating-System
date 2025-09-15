/**
 * storeController.js
 * - createStore (admin)
 * - listStores (public with optional user's rating)
 * - getStoreById (details + avg + ratings)
 */

const Store = require('../models/Store');
const Rating = require('../models/Rating');
const User = require('../models/User');
const mongoose = require('mongoose');
const { success, error } = require('../utils/responseHelper');
const { Op } = require('mongoose'); // sample placeholder not used

// Create store (admin)
async function createStore(req, res, next) {
  try {
    const { name, email, address, ownerId } = req.body;
    if (!name) return error(res, 'Store name required', 400);

    let owner = null;
    if (ownerId) {
      if (!mongoose.Types.ObjectId.isValid(ownerId)) return error(res, 'Invalid ownerId', 400);
      owner = await User.findById(ownerId);
      if (!owner) return error(res, 'Owner not found', 404);
      // Optionally enforce owner role
      if (owner.role !== 'STORE_OWNER') {
        // You may allow admin to set owner role automatically or error — we'll allow but warn
        // For strictness, uncomment next line:
        // return error(res, 'Owner must be a STORE_OWNER', 400);
      }
    }

    const store = new Store({ name, email, address, owner: owner ? owner._id : null });
    await store.save();
    return success(res, { store }, 'Store created', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * listStores:
 * - supports ?search=&address=&page=&pageSize=&sort=name:asc
 * - returns avgRating and if req.user is set, returns yourRating per store
 */
async function listStores(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const pageSize = Math.min(100, parseInt(req.query.pageSize || '20', 10));
    const search = req.query.search || null;
    const address = req.query.address || null;
    const sortQ = req.query.sort || 'name:asc';

    // build match
    const match = {};
    if (search) match.name = { $regex: search, $options: 'i' };
    if (address) match.address = { $regex: address, $options: 'i' };

    // parse sort
    let [sortField, sortDir] = sortQ.split(':');
    if (!sortField) sortField = 'name';
    const sort = {};
    sort[sortField] = sortDir === 'desc' ? -1 : 1;

    // Aggregation: lookup ratings and compute avg
    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'store',
          as: 'ratings'
        }
      },
      {
        $addFields: {
          avgRating: { $round: [{ $avg: '$ratings.rating' }, 2] }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          address: 1,
          owner: 1,
          avgRating: 1
        }
      },
      { $sort: sort },
      {
        $facet: {
          meta: [{ $count: 'total' }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }]
        }
      }
    ];

    const agg = await Store.aggregate(pipeline).exec();

    const total = agg[0].meta.length > 0 ? agg[0].meta[0].total : 0;
    const rows = agg[0].data;

    // if user present, fetch their ratings for these stores
    let userRatingsMap = {};
    if (req.user) {
      const storeIds = rows.map(r => r._id);
      const ratings = await Rating.find({ store: { $in: storeIds }, user: req.user._id }).exec();
      userRatingsMap = ratings.reduce((acc, r) => {
        acc[String(r.store)] = r.rating;
        return acc;
      }, {});
    }

    const data = rows.map(r => ({
      id: r._id,
      name: r.name,
      email: r.email,
      address: r.address,
      owner: r.owner,
      avgRating: r.avgRating || null,
      yourRating: userRatingsMap[String(r._id)] || null
    }));

    return success(res, { data, meta: { page, pageSize, total } });
  } catch (err) {
    next(err);
  }
}

/**
 * getStoreById - returns store, avgRating, and optionally ratings (populated)
 */
async function getStoreById(req, res, next) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return error(res, 'Invalid store id', 400);

    const store = await Store.findById(id).populate('owner', 'name email').exec();
    if (!store) return error(res, 'Store not found', 404);

    // compute average
    const agg = await Rating.aggregate([
      { $match: { store: store._id } },
      { $group: { _id: '$store', avgRating: { $round: [{ $avg: '$rating' }, 2] }, count: { $sum: 1 } } }
    ]).exec();

    const avgRating = agg.length > 0 ? agg[0].avgRating : null;
    const ratings = await Rating.find({ store: store._id }).sort({ createdAt: -1 }).populate('user', 'name email').exec();

    return success(res, { store, avgRating, ratings });
  } catch (err) {
    next(err);
  }
}

module.exports = { createStore, listStores, getStoreById };
