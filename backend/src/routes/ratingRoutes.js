const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { createOrUpdateRating, getRatingsForStore } = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// create or update rating (NORMAL_USER)
router.post('/:storeId/ratings', authMiddleware, roleMiddleware('NORMAL_USER'), asyncHandler(createOrUpdateRating));
router.put('/:storeId/ratings', authMiddleware, roleMiddleware('NORMAL_USER'), asyncHandler(createOrUpdateRating));

// get ratings for a store (owner or admin)
router.get('/:storeId/ratings', authMiddleware, roleMiddleware(['SYSTEM_ADMIN', 'STORE_OWNER']), asyncHandler(getRatingsForStore));

module.exports = router;
