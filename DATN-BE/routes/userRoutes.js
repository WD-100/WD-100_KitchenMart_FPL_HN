const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.get('/verify-token', authMiddleware, userController.verifyToken);

module.exports = router;