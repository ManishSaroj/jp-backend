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
const { createOrUpdateCandidateProfile, updateLookingForJobStatus, getCandidateProfile, uploadFiles, getAllCandidateProfiles } = require('../controllers/Candidate/CandidateProfileController');
const { createResume, updateResume, deleteResume, getAllResumes, getResumeById, getResumeByCandidateId } = require('../controllers/Candidate/resumeController');
const { getAllJobPosts, getJobPostById } = require('../controllers/Candidate/getAllJobPosts');

const router = express.Router();

router.post('/register', registerCandidate);
router.post('/login', loginCandidate);
router.get('/verify-email', verifyCandidateEmail); 
router.post('/resend-email', resendVerificationEmail);
router.get('/me', checkAuth, getCandidate);
router.post('/change-password', checkAuth, changePassword)
router.post('/profile',checkAuth, uploadFiles, createOrUpdateCandidateProfile);
router.patch('/update-job-status', checkAuth, updateLookingForJobStatus);
router.get('/get-profile', checkAuth, getCandidateProfile);

// New route for fetching all candidate profiles
router.get('/getAll-candidates', getAllCandidateProfiles);

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

router.get('/getAll-jobposts', getAllJobPosts);
router.get('/get-jobpost/:jobpostId', getJobPostById);

module.exports = router;