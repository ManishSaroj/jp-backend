// adminRoutes.js
const express = require('express');
const { loginAdmin } = require('../controllers/Admin/adminAuth');
const checkAuth = require('../middlewares/authMiddleware');

const router = express.Router();

// Authentication route
router.post('/login', loginAdmin);

// Protected route example (if needed)
// router.get('/dashboard', checkAuth, getAdminDashboard);

module.exports = router;