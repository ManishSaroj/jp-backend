const passport = require('passport');
const jwt = require('jsonwebtoken');

exports.googleAuthCandidate = passport.authenticate('google-candidate', {
  scope: ['profile', 'email']
});

exports.googleAuthCandidateCallback = (req, res, next) => {
  passport.authenticate('google-candidate', async (err, candidate, info) => {
    if (err) {
      return next(err);
    }
    if (!candidate) {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/login?error=authentication_failed`);
    }
    const token = jwt.sign({ id: candidate.cid, type: 'candidate' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    res.cookie(process.env.COOKIE_NAME, token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.COOKIE_DOMAIN
    });
    res.redirect(`${process.env.FRONTEND_BASE_URL}/candidatedashboard`);
  })(req, res, next);
};