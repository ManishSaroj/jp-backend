// backend/src/controllers/Candidate/CandidateAuthController.js
const passport = require('passport');

const googleAuth = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/login' }, (err, user) => {
    if (err || !user) {
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/candidate/dashboard');
    });
  })(req, res, next);
};

const linkedinAuth = (req, res, next) => {
  passport.authenticate('linkedin')(req, res, next);
};

const linkedinAuthCallback = (req, res, next) => {
  passport.authenticate('linkedin', { failureRedirect: '/login' }, (err, user) => {
    if (err || !user) {
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/candidate/dashboard');
    });
  })(req, res, next);
};

module.exports = {
  googleAuth,
  googleAuthCallback,
  linkedinAuth,
  linkedinAuthCallback,
};
