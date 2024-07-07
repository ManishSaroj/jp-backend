const jwt = require('jsonwebtoken');

// Configuration values
const SECRET = process.env.JWT_SECRET || 'your-secret-key';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const REMEMBER_ME_EXPIRES_IN = process.env.JWT_REMEMBER_ME_EXPIRES_IN || '7d';
const COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN || 86400000; // 1 day in ms
const REMEMBER_ME_COOKIE_EXPIRES_IN = process.env.JWT_REMEMBER_ME_COOKIE_EXPIRES_IN || 604800000; // 7 days in ms
const COOKIE_NAME = process.env.COOKIE_NAME || 'sessionToken';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;

const generateToken = (payload, rememberMe) => {
  const expiresIn = rememberMe ? REMEMBER_ME_EXPIRES_IN : EXPIRES_IN;
  return jwt.sign(payload, SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET);
    return { isValid: true, payload: decoded };
  } catch (error) {
    return { isValid: false, error };
  }
};

const setTokenCookie = (res, token, rememberMe) => {
  const cookieMaxAge = rememberMe 
    ? REMEMBER_ME_COOKIE_EXPIRES_IN 
    : COOKIE_EXPIRES_IN;
  
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    maxAge: cookieMaxAge,
    sameSite: 'strict',
    domain: COOKIE_DOMAIN,
  });
};

module.exports = { generateToken, verifyToken, setTokenCookie };
