// candidateRoutes.js
const express = require('express');
const  checkAuth = require('../middlewares/authMiddleware');
const { registerCandidate, loginCandidate, resendVerificationEmail, verifyCandidateEmail,} = require('../controllers/Candidate/CandidateController');
const { googleAuthCandidate, googleAuthCandidateCallback } = require('../controllers/Candidate/CandidateAuthController');
const { getCandidate, changePassword } = require('../controllers/Candidate/getCandidate');
const { requestPasswordReset, resetPassword  } = require('../controllers/Candidate/resetPasswordController');
const { createOrUpdateCandidateProfile, updateLookingForJobStatus, getCandidateProfile, uploadFiles, getAllCandidateProfiles } = require('../controllers/Candidate/CandidateProfileController');
const { createResume, updateResume, deleteResume, getAllResumes, getResumeById, getResumeByCandidateId } = require('../controllers/Candidate/resumeController');
const { getAllJobPosts, getJobPostById, applyForJob, getAppliedJobsForCandidate } = require('../controllers/Candidate/getAllJobPosts');


const router = express.Router();

// Authentication routes
router.post('/register', registerCandidate);
router.post('/login', loginCandidate);
router.get('/verify-email', verifyCandidateEmail); 
router.post('/resend-email', resendVerificationEmail);

router.get('/auth/google', googleAuthCandidate);
router.get('/auth/google/callback', googleAuthCandidateCallback);


// Password reset routes
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/change-password', checkAuth, changePassword)

// Candidate profile routes
router.get('/me', checkAuth, getCandidate);
router.post('/profile',checkAuth, uploadFiles, createOrUpdateCandidateProfile);
router.patch('/update-job-status', checkAuth, updateLookingForJobStatus);
router.get('/get-profile', checkAuth, getCandidateProfile);
router.get('/getAll-candidates', getAllCandidateProfiles);

// Resume routes
router.post('/resumes', checkAuth, createResume);
router.put('/resumes/:id', checkAuth, updateResume);
router.delete('/resumes/:id', checkAuth, deleteResume);
router.get('/resumes', checkAuth, getAllResumes);
router.get('/resumes/:id', checkAuth, getResumeById);
router.get('/resumes/:id', checkAuth, getResumeByCandidateId);

// Job application routes
router.get('/getAll-jobposts',checkAuth, getAllJobPosts);
router.get('/get-jobpost/:jobpostId',checkAuth, getJobPostById);
router.post('/apply-for-job', checkAuth, applyForJob);
router.get('/jobposts/applied', checkAuth, getAppliedJobsForCandidate); 


module.exports = router;