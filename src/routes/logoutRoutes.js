const express = require('express');
const router = express.Router();

// Logout route
router.post('/', (req, res) => {
  // Clear the JWT cookie by setting its expiration date to a past date
  res.clearCookie('sessionToken');
  // Optionally, you can also send a response indicating successful logout
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
