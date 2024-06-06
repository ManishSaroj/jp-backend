const jwt = require('jsonwebtoken');
const { generateResponse } = require('../utils/responseUtils');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return generateResponse(res, 401, 'Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    return generateResponse(res, 400, 'Invalid token.');
  }
};

module.exports = authMiddleware;
