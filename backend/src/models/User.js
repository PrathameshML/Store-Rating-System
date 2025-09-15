/**
 * User model (Mongoose)
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { bcryptSaltRounds } = require('../config/auth');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 20, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  address: { type: String, maxlength: 400 },
  role: { type: String, enum: ['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'], default: 'NORMAL_USER' }
}, { timestamps: true });

/**
 * setPassword - hash and set passwordHash
 */
userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, bcryptSaltRounds);
};

/**
 * comparePassword - compare plaintext with stored hash
 */
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Hide passwordHash in JSON
userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.passwordHash;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
