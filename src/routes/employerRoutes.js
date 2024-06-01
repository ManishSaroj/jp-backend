const express = require('express');
const { registerEmployer, loginEmployer, resendVerificationEmail } = require('../controllers/EmployerController');
const { verifyEmail } = require('../controllers/EmailVerificationController');

const router = express.Router();

router.post('/register', registerEmployer);
router.post('/login', loginEmployer);
router.get('/verify-email', verifyEmail);
router.post('/resend-email', resendVerificationEmail);

module.exports = router;