// candidateRoutes.js
const express = require('express');
const  checkAuth = require('../middlewares/authMiddleware');
const { registerCandidate, loginCandidate, resendVerificationEmail, verifyCandidateEmail,} = require('../controllers/Candidate/CandidateController');
const { googleAuthCandidate, googleAuthCandidateCallback } = require('../controllers/Candidate/CandidateAuthController');
const { getCandidate, changePassword } = require('../controllers/Candidate/getCandidate');
const { requestPasswordReset, resetPassword  } = require('../controllers/Candidate/resetPasswordController');
const { createOrUpdateCandidateProfile, updateLookingForJobStatus, getCandidateProfile, uploadFiles, getAllCandidateProfiles, getCandidateImage, uploadCandidateImage, getCandidateResume, uploadCandidateResume, deleteCandidateResume } = require('../controllers/Candidate/CandidateProfileController');
const { createResume, updateResume, deleteResume, getAllResumes, getResumeById, getResumeByCandidateId } = require('../controllers/Candidate/resumeController');
const { getAllJobPosts, getJobPostById, applyForJob, getAppliedJobsForCandidate } = require('../controllers/Candidate/getAllJobPosts');
const { getNotificationsForCandidate, deleteAllNotifications, deleteNotification, markNotificationAsRead } = require('../controllers/Candidate/notificationController');
const sseMiddleware = require('../middlewares/sseMiddleware');
const { updateJobCategory } = require('../controllers/Admin/AdminProfileController');

const router = express.Router();

// Authentication routes
router.post('/register', registerCandidate);
router.post('/login', loginCandidate);
router.get('/verify-email', verifyCandidateEmail); 
router.post('/resend-email', resendVerificationEmail);

// Google authentication routes
router.get('/auth/google', googleAuthCandidate);
router.get('/auth/google/callback', googleAuthCandidateCallback);

// Password reset routes
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/change-password', checkAuth, changePassword)

// Candidate profile routes
router.get('/me', checkAuth, getCandidate);
router.get('/me/image', checkAuth, getCandidateImage);
router.post('/me/image', checkAuth, uploadFiles, uploadCandidateImage);
router.get('/me/resume', checkAuth, getCandidateResume);
router.post('/me/resume', checkAuth, uploadFiles, uploadCandidateResume);
router.post('/profile',checkAuth, uploadFiles, createOrUpdateCandidateProfile);
router.patch('/update-job-status', checkAuth, updateLookingForJobStatus);
router.get('/get-profile', checkAuth, getCandidateProfile);
router.get('/getAll-candidates', getAllCandidateProfiles);
router.delete('/delete-resume', checkAuth, deleteCandidateResume);

// Resume routes
router.post('/resumes', checkAuth, createResume);
router.put('/resumes/:id', checkAuth, updateResume);
router.delete('/resumes/:id', checkAuth, deleteResume);
router.get('/resumes', checkAuth, getAllResumes);
router.get('/resumes/:id', checkAuth, getResumeById);
router.get('/resumes/:id', checkAuth, getResumeByCandidateId);

// Job application routes
router.get('/getAll-jobposts', getAllJobPosts);   //removed checkAuth to get data at landing page
router.get('/get-jobpost/:jobpostId',checkAuth, getJobPostById);
router.post('/apply-for-job', checkAuth, applyForJob);
router.get('/jobposts/applied', checkAuth, getAppliedJobsForCandidate); 

// Notification routes
router.get('/notifications/:profileId', getNotificationsForCandidate);
router.delete('/notifications/:notificationId', checkAuth, deleteNotification);
router.delete('/notifications/all/:profileId', checkAuth, deleteAllNotifications);
router.patch('/notifications/read/:notificationId', checkAuth, markNotificationAsRead);


// SSE route for notifications
router.get('/notifications/sse/:profileId', sseMiddleware, (req, res) => {
  const { profileId } = req.params;

  // Set up SSE connection
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