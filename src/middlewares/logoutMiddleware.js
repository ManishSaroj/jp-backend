const logoutMiddleware = (req, res, next) => {
  // Clear the JWT cookie by setting its expiration date to a past date
  res.clearCookie('sessionToken');
  next();
};

module.exports = logoutMiddleware;