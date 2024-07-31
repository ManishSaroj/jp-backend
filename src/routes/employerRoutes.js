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
const { createOrUpdateEmployerProfile, getEmployerProfile, uploadImages, getCompanyLogo, uploadEmployerLogo, getCompanyBanner, uploadCompanyBanner, getEmployerProfileById } = require('../controllers/Employer/EmployerProfileController');
const { createJobPost, getEmployerJobPosts, getJobPostById, updateJobPost, getAppliedCandidates, getCandidateDetails, JobPostStatus, deleteJobPost, updateApplicationStatus, getApplicationStatus, getShortlistedCandidates} = require('../controllers/Employer/EmployerJobPost');
const { browseCandidates } = require('../controllers/Employer/BrowseCandidates')
const { saveCandidate, getSavedCandidates, unsaveCandidate } = require('../controllers/Employer/savedCandidateController');
const { getNotificationsForEmployer, deleteAllNotifications, deleteNotification, markNotificationAsRead } = require('../controllers/Employer/notificationController');
const sseMiddleware = require('../middlewares/sseMiddleware');

const router = express.Router();

router.post('/register', registerEmployer);
router.post('/login', loginEmployer);
router.get('/verify-email', verifyEmployerEmail);
router.post('/resend-email', resendVerificationEmail);

router.get('/auth/google', googleAuthEmployer);
router.get('/auth/google/callback', googleAuthEmployerCallback);



router.get('/me', checkAuth, getEmployer);
router.post('/change-password', checkAuth, changePassword)
router.get('/company-logo', checkAuth, getCompanyLogo);
router.post('/upload-logo', checkAuth, uploadImages, uploadEmployerLogo);
router.get('/company-banner', checkAuth, getCompanyBanner);
router.post('/upload-banner', checkAuth, uploadImages, uploadCompanyBanner);

router.post('/profile',checkAuth, uploadImages , createOrUpdateEmployerProfile);
router.get('/get-profile', checkAuth, getEmployerProfile);
router.get('/profile/:eid', getEmployerProfileById);

router.post('/create-jobpost',checkAuth, createJobPost);
router.get('/get-employer-jobposts', checkAuth, getEmployerJobPosts);
router.get('/jobpost/:jobpostId', checkAuth, getJobPostById);
router.put('/jobpost/:jobpostId', checkAuth, updateJobPost);
router.put('/jobpost/:jobpostId/jobpost-status', checkAuth, JobPostStatus);
router.delete('/jobpost/:jobpostId/delete-jobpost', checkAuth, deleteJobPost);
router.get('/jobpost/:jobpostId/applied-candidates', checkAuth, getAppliedCandidates);
router.get('/candidate-details/:profileId', checkAuth , getCandidateDetails);
router.get('/getAll-candidates', browseCandidates)
router.put('/application/:applicationId/status', checkAuth, updateApplicationStatus);
router.put('/application/:applicationId/review', );
router.get('/application/:applicationId/status', checkAuth, getApplicationStatus);
router.get('/jobpost/:jobpostId/shortlisted-candidates', checkAuth, getShortlistedCandidates);

router.post('/save-candidate', checkAuth, saveCandidate);
router.get('/saved-candidates', checkAuth, getSavedCandidates);
router.delete('/unsave-candidate', checkAuth, unsaveCandidate)

// Password reset routes
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

router.get('/notifications/:profileId', getNotificationsForEmployer);
router.delete('/notifications/:notificationId', checkAuth, deleteNotification);
router.delete('/notifications/all/:profileId', checkAuth, deleteAllNotifications);
router.patch('/notifications/read/:notificationId', checkAuth, markNotificationAsRead);

// SSE route for notifications
router.get('/notifications/sse/:profileId', sseMiddleware, (req, res) => {
  const { profileId } = req.params;

  res.sseSetup();

  // Store the connection
  req.app.locals.sseConnections = req.app.locals.sseConnections || {};
  req.app.locals.sseConnections[profileId] = res;

  // Send a test message
  res.sseSend({ type: 'connection', message: 'SSE connection established' });

  // Remove the connection when the client disconnects
  req.on('close', () => {
    delete req.app.locals.sseConnections[profileId];
  });
});

module.exports = router;