/**
 * app.js
 * - Express setup: middlewares + routes + error handler
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Built-in middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes); // storeRoutes handles / and /:id
app.use('/api/stores', ratingRoutes); // ratingRoutes handles /:storeId/ratings
app.use('/api/admin', adminRoutes);

// health
app.get('/api/health', (req, res) => res.json({ success: true, time: new Date().toISOString() }));

// error handler (last)
app.use(errorHandler);

module.exports = app;
