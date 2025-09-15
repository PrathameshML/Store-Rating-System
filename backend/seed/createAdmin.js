/**
 * seed/createAdmin.js
 * - Run `npm run seed:admin` after installing and setting MONGO_URI to create a System Admin quickly.
 *
 * Usage:
 *   cp .env.example .env
 *   # edit .env (set MONGO_URI)
 *   npm run seed:admin
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const { connectDB } = require('../src/config/db');

async function createAdmin() {
  try {
    await connectDB();

    const email = 'admin@example.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }

    // name must be between 20 and 60 chars
    const name = 'System Administrator Default Name';
    const password = 'Admin@123'; // change immediately after seed
    const user = new User({ name, email, role: 'SYSTEM_ADMIN' });
    await user.setPassword(password);
    await user.save();

    console.log('Admin created:');
    console.log({ email, password });
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin', err);
    process.exit(1);
  }
}

createAdmin();
