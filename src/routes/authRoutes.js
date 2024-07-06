// authRoutes.js

const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/authMiddleware'); // Import the middleware

router.get('/checkAuth', checkAuth, (req, res) => {
  // This route is protected and requires authentication
  res.status(200).json({ success: true, message: "Authenticated", user: req.user });
});

module.exports = router;
