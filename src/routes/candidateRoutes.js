// candidateRoutes.js
const express = require('express');
const {
  registerCandidate,
  loginCandidate,
  resendVerificationEmail,
  verifyCandidateEmail,
} = require('../controllers/Candidate/CandidateController');
const  checkAuth = require('../middlewares/authMiddleware');
const { getCandidate, changePassword } = require('../controllers/Candidate/getCandidate');
const { requestPasswordReset, resetPassword  } = require('../controllers/Candidate/resetPasswordController');
const { createOrUpdateCandidateProfile, getCandidateProfile, uploadImages } = require('../controllers/Candidate/CandidateProfileController');
const { createResume, updateResume, deleteResume, getAllResumes, getResumeById, getResumeByCandidateId } = require('../controllers/Candidate/resumeController');

const router = express.Router();

router.post('/register', registerCandidate);
router.post('/login', loginCandidate);
router.get('/verify-email', verifyCandidateEmail); 
router.post('/resend-email', resendVerificationEmail);
router.get('/me', checkAuth, getCandidate);
router.post('/change-password', checkAuth, changePassword)
router.post('/profile',checkAuth, uploadImages, createOrUpdateCandidateProfile);
router.get('/get-profile', checkAuth, getCandidateProfile);

// Resume routes
router.post('/resumes', checkAuth, createResume);
router.put('/resumes/:id', checkAuth, updateResume);
router.delete('/resumes/:id', checkAuth, deleteResume);
router.get('/resumes', checkAuth, getAllResumes);
router.get('/resumes/:id', checkAuth, getResumeById);
router.get('/resumes/:id', checkAuth, getResumeByCandidateId);

// Password reset routes
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;