// authRoutes.js

const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/authMiddleware'); // Import the middleware
const checkAdmin = require('../middlewares/adminAuthMiddleware');

router.get('/checkAuth', checkAuth, (req, res) => {
  // This route is protected and requires authentication
  res.status(200).json({ success: true, message: "Authenticated", user: req.user });
});

// Route that requires admin authentication
router.get('/checkAdminAuth', checkAuth, checkAdminAuth, (req, res) => {
  // This route is protected and requires both general authentication and admin authentication
  res.status(200).json({ success: true, message: "Authenticated as admin", admin: req.admin });
});


module.exports = router;
