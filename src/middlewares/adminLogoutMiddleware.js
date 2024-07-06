const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || 'adminSessionToken';

const adminlogoutMiddleware = (req, res, next) => {
  // Clear the JWT cookie by setting its expiration date to a past date
  res.clearCookie(ADMIN_COOKIE_NAME);
  next();
};

module.exports = adminlogoutMiddleware;