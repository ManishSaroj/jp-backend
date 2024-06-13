const express = require('express');
const router = express.Router();
const logoutMiddleware = require('../middlewares/logoutMiddleware');

// Logout route
router.post('/', logoutMiddleware, (req, res) => {
  // Optionally, you can also send a response indicating successful logout
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;