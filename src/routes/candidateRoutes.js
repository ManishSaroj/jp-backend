// candidateRoutes.js
const express = require('express');
const {
  registerCandidate,
  loginCandidate,
  resendVerificationEmail,
  verifyCandidateEmail,
} = require('../controllers/Candidate/CandidateController');
const  checkAuth = require('../middlewares/authMiddleware');
const { getCandidate } = require('../controllers/Candidate/getCandidate');
const { createOrUpdateCandidateProfile, getCandidateProfile } = require('../controllers/Candidate/CandidateProfileController');
const { storeResume } = require('../controllers/Candidate/resumeController');

const router = express.Router();

router.post('/register', registerCandidate);
router.post('/login', loginCandidate);
router.get('/verify-email', verifyCandidateEmail); 
router.post('/resend-email', resendVerificationEmail);
router.get('/me', checkAuth, getCandidate);
router.post('/profile',checkAuth, createOrUpdateCandidateProfile);
router.get('/get-profile', checkAuth, getCandidateProfile);
router.post('/resumes', checkAuth, storeResume);



module.exports = router;