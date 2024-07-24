const passport = require('passport');
const jwt = require('jsonwebtoken');
const { AdminEmployerStatus } =require('../../models/Admin/UserStatusModel');

exports.googleAuthEmployer = passport.authenticate('google-employer', {
  scope: ['profile', 'email']
});

exports.googleAuthEmployerCallback = (req, res, next) => {
  passport.authenticate('google-employer', async (err, employer, info) => {
    if (err) {
      return next(err);
    }
    if (!employer) {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/login?error=authentication_failed`);
    }
    
    try {
      // Check if the employer is deactivated
      const status = await AdminEmployerStatus.findOne({ where: { employerId: employer.eid } });
      if (status && status.isDeactive) {
        // Redirect to a deactivation page
        return res.redirect(`${process.env.FRONTEND_BASE_URL}/account-deactivated`);
      }

      const token = jwt.sign(
        { id: employer.eid, role: 'employer' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.cookie(process.env.COOKIE_NAME, token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.COOKIE_DOMAIN
      });

      res.redirect(`${process.env.FRONTEND_BASE_URL}/employerdashboard`);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};