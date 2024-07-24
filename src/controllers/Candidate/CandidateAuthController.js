const passport = require('passport');
const jwt = require('jsonwebtoken');
const { AdminCandidateStatus } = require('../../models/Admin/UserStatusModel');

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
    
    try {
      // Check if the candidate is deactivated
      const status = await AdminCandidateStatus.findOne({ where: { candidateId: candidate.cid } });
      if (status && status.isDeactive) {
        // Redirect to a Google-styled deactivation page
        return res.redirect(`${process.env.FRONTEND_BASE_URL}/account-deactivated`);
      }

      const token = jwt.sign(
        { id: candidate.cid, role: 'candidate' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.cookie(process.env.COOKIE_NAME, token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.COOKIE_DOMAIN
      });

      res.redirect(`${process.env.FRONTEND_BASE_URL}/candidatedashboard`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};