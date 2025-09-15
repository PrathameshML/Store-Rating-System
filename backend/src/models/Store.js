/**
 * Store model (Mongoose)
 */
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  address: { type: String, trim: true, maxlength: 400 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } // store owner
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);
