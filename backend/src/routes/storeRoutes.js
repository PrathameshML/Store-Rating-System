const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { listStores, createStore, getStoreById } = require('../controllers/storeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// public list
router.get('/', asyncHandler(listStores));

// create store - admin only
router.post('/', authMiddleware, roleMiddleware('SYSTEM_ADMIN'), asyncHandler(createStore));

// store detail (authenticated to allow owner view of ratings; can be made public if desired)
router.get('/:id', authMiddleware, asyncHandler(getStoreById));

module.exports = router;
