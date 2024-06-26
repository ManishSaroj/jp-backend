const express = require('express');
const { 
    registerEmployer, 
    loginEmployer, 
    resendVerificationEmail,
    verifyEmployerEmail,
 } = require('../controllers/Employer/EmployerController');
const  checkAuth = require('../middlewares/authMiddleware');
const { getEmployer, changePassword } = require('../controllers/Employer/getEmployer');
const { requestPasswordReset, resetPassword } = require('../controllers/Employer/resetPasswordController');
const { createOrUpdateEmployerProfile, getEmployerProfile, uploadImages } = require('../controllers/Employer/EmployerProfileController');
const { createJobPost, getEmployerJobPosts } = require('../controllers/Employer/EmployerJobPost');

const router = express.Router();

router.post('/register', registerEmployer);
router.post('/login', loginEmployer);
router.get('/verify-email', verifyEmployerEmail);
router.post('/resend-email', resendVerificationEmail);
router.get('/me', checkAuth, getEmployer);
router.post('/change-password', checkAuth, changePassword)
router.post('/profile',checkAuth, uploadImages , createOrUpdateEmployerProfile);
router.get('/get-profile', checkAuth, getEmployerProfile);

router.post('/create-jobpost',checkAuth, createJobPost);
router.get('/get-employer-jobposts', checkAuth, getEmployerJobPosts);

// Password reset routes
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);


module.exports = router;