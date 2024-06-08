// candidateRoutes.js
const express = require('express');
const {
  registerCandidate,
  loginCandidate,
  resendVerificationEmail,
  verifyCandidateEmail,
} = require('../controllers/Candidate/CandidateController');
const {
  createCandidateProfile,
} = require('../controllers/Candidate/CandidateProfileController');
const  checkAuth = require('../middlewares/authMiddleware')
const { getCandidate } = require('../controllers/Candidate/getCandidate')

const router = express.Router();

router.post('/register', registerCandidate);
router.post('/login', loginCandidate);
router.get('/verify-email', verifyCandidateEmail); 
router.post('/resend-email', resendVerificationEmail);
router.get('/me', checkAuth, getCandidate)
router.post('/profile', createCandidateProfile);


module.exports = router;