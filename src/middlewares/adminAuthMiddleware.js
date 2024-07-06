// authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || 'adminSessionToken';

const checkAdminAuth = (req, res, next) => {
  try {
    const token = req.cookies[ADMIN_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated as admin" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: "Invalid admin token" });
      }

      // Assuming the decoded token has a 'role' field that identifies it as an admin
      if (decoded.role !== 'admin') {
        return res.status(401).json({ success: false, message: "Unauthorized: Not an admin" });
      }

      req.admin = decoded; // Attach the decoded admin information to the request object
      next(); // Proceed to the next middleware
    });
  } catch (error) {
    console.error('Error checking admin authentication:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = checkAdminAuth;
