const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { signup, login, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.post('/change-password', authMiddleware, asyncHandler(changePassword));

module.exports = router;
