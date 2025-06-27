const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const adminController = require('../controllers/admin/adminController');

router.get('/dashboard', authMiddleware, adminMiddleware, adminController.dashboard);

module.exports = router;
