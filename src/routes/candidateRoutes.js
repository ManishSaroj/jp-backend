// candidateRoutes.js
const express = require('express');
const {
  registerCandidate,
  loginCandidate,
  resendVerificationEmail,
  verifyCandidateEmail,
} = require('../controllers/Candidate/CandidateController');

const router = express.Router();

router.post('/register', registerCandidate);
router.post('/login', loginCandidate);
router.get('/verify-email', verifyCandidateEmail); // Add this line
router.post('/resend-email', resendVerificationEmail);

module.exports = router;