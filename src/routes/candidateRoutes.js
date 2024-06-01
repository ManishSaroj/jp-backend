const express = require('express');
const { registerCandidate, loginCandidate, resendVerificationEmail } = require('../controllers/CandidateController');
const { verifyEmail } = require('../controllers/EmailVerificationController');

const router = express.Router();

router.post('/register', registerCandidate);
router.post('/login', loginCandidate);
router.get('/verify-email', verifyEmail);
router.post('/resend-email', resendVerificationEmail); // Add route for resending email

module.exports = router;