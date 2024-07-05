const jwt = require('jsonwebtoken');

// Configuration values
const SECRET = process.env.JWT_SECRET || 'your-secret-key';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN || '1d';
const COOKIE_NAME = process.env.COOKIE_NAME || 'sessionToken';
const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || 'aplakaam';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET);
    return { isValid: true, payload: decoded };
  } catch (error) {
    return { isValid: false, error };
  }
};

const setTokenCookie = (res, token) => {
  const cookieMaxAge = parseInt(COOKIE_EXPIRES_IN, 10) * 1000; // Convert to milliseconds
  const cookieName = isAdmin ? ADMIN_COOKIE_NAME : COOKIE_NAME;

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    maxAge: cookieMaxAge,
    sameSite: 'strict', // Add this for better security
    // domain: COOKIE_DOMAIN,
  });
};

module.exports = { generateToken, verifyToken, setTokenCookie };