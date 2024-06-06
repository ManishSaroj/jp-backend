const express = require('express');
const {
  registerEmployer,
  loginEmployer,
  resendVerificationEmail,
  verifyEmployerEmail,
} = require('../controllers/Employer/EmployerController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerEmployer);
router.post('/login', loginEmployer);
router.get('/verify-email', verifyEmployerEmail);
router.post('/resend-email', resendVerificationEmail);

// Example of a protected route
router.get('/profile', authMiddleware, async (req, res) => {
  const employer = await Employer.findByPk(req.user.id);
  if (!employer) {
    return generateResponse(res, 404, 'Employer not found');
  }
  generateResponse(res, 200, 'Employer profile', { employer });
});

module.exports = router;