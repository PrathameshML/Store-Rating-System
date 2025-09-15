/**
 * Rating model (Mongoose)
 * Unique compound index: (user, store) to ensure one rating per user per store.
 */
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
}, { timestamps: true });

// Unique compound index
ratingSchema.index({ user: 1, store: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
