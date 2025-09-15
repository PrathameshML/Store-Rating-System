const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const { getProfile, updateProfile, getMyRatings } = require('../controllers/userController');

router.get('/me', authMiddleware, asyncHandler(getProfile));
router.put('/me', authMiddleware, asyncHandler(updateProfile));
router.get('/me/ratings', authMiddleware, asyncHandler(getMyRatings));

module.exports = router;
