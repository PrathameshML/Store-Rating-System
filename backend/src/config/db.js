/**
 * db.js
 * - Exports connectDB() which connects mongoose to MONGO_URI
 */
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI not set in environment');
  }

  // Recommended options for mongoose 7+ not necessary; keep defaults
  await mongoose.connect(uri, {
    // options can be empty for modern mongoose
  });
  console.log('Connected to MongoDB');
}

module.exports = { connectDB };
