// authMiddleware.js

const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  try {
    const token = req.cookies.sessionToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }

      req.user = decoded; // Attach the decoded user information to the request object
      next(); // Proceed to the next middleware
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = checkAuth;
