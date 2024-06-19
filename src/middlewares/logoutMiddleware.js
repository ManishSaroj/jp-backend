const COOKIE_NAME = process.env.COOKIE_NAME || 'sessionToken';

const logoutMiddleware = (req, res, next) => {
  // Clear the JWT cookie by setting its expiration date to a past date
  res.clearCookie(COOKIE_NAME);
  next();
};

module.exports = logoutMiddleware;