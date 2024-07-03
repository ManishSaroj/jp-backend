const express = require('express');
const { 
    registerEmployer, 
    loginEmployer, 
    resendVerificationEmail,
    verifyEmployerEmail,
 } = require('../controllers/Employer/EmployerController');
 const { googleAuthEmployer, googleAuthEmployerCallback} = require('../controllers/Employer/EmployerAuthController');
  
const  checkAuth = require('../middlewares/authMiddleware');
const { getEmployer, changePassword } = require('../controllers/Employer/getEmployer');
const { requestPasswordReset, resetPassword } = require('../controllers/Employer/resetPasswordController');
const { createOrUpdateEmployerProfile, getEmployerProfile, uploadImages } = require('../controllers/Employer/EmployerProfileController');
const { createJobPost, getEmployerJobPosts, getJobPostById, updateJobPost, getAppliedCandidates, getCandidateDetails, JobPostStatus, deleteJobPost, updateApplicationStatus, getApplicationStatus, getShortlistedCandidates} = require('../controllers/Employer/EmployerJobPost');
const { saveCandidate, getSavedCandidates } = require('../controllers/Employer/savedCandidateController');

const router = express.Router();

router.post('/register', registerEmployer);
router.post('/login', loginEmployer);
router.get('/verify-email', verifyEmployerEmail);
router.post('/resend-email', resendVerificationEmail);

router.get('/auth/google', googleAuthEmployer);
router.get('/auth/google/callback', googleAuthEmployerCallback);



router.get('/me', checkAuth, getEmployer);
router.post('/change-password', checkAuth, changePassword)
router.post('/profile',checkAuth, uploadImages , createOrUpdateEmployerProfile);
router.get('/get-profile', checkAuth, getEmployerProfile);

router.post('/create-jobpost',checkAuth, createJobPost);
router.get('/get-employer-jobposts', checkAuth, getEmployerJobPosts);
router.get('/jobpost/:jobpostId', checkAuth, getJobPostById);
router.put('/jobpost/:jobpostId', checkAuth, updateJobPost);
router.put('/jobpost/:jobpostId/jobpost-status', checkAuth, JobPostStatus);
router.delete('/jobpost/:jobpostId/delete-jobpost', checkAuth, deleteJobPost);
router.get('/jobpost/:jobpostId/applied-candidates', checkAuth, getAppliedCandidates);
router.get('/candidate-details/:profileId', checkAuth , getCandidateDetails);
router.put('/application/:applicationId/status', checkAuth, updateApplicationStatus);
router.put('/application/:applicationId/review', );
router.get('/application/:applicationId/status', checkAuth, getApplicationStatus);
router.get('/jobpost/:jobpostId/shortlisted-candidates', checkAuth, getShortlistedCandidates);

router.post('/save-candidate', checkAuth, saveCandidate);
router.get('/saved-candidates', checkAuth, getSavedCandidates);

// Password reset routes
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);


module.exports = router;