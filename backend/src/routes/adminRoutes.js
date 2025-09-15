const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

// all admin-only endpoints
router.use(authMiddleware, roleMiddleware('SYSTEM_ADMIN'));

router.get('/dashboard', asyncHandler(adminController.dashboard));
router.post('/users', asyncHandler(adminController.adminCreateUser));
router.get('/users', asyncHandler(adminController.listUsers));

router.post('/stores', asyncHandler(adminController.adminCreateStore));
router.get('/stores', asyncHandler(adminController.listStores));

module.exports = router;
