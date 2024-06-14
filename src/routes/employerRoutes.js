const express = require('express');
const { 
    registerEmployer, 
    loginEmployer, 
    resendVerificationEmail,
    verifyEmployerEmail,
 } = require('../controllers/Employer/EmployerController');
const  checkAuth = require('../middlewares/authMiddleware');
const { getEmployer, changePassword } = require('../controllers/Employer/getEmployer');
const { createOrUpdateEmployerProfile, getEmployerProfile } = require('../controllers/Employer/EmployerProfileController');
const { createJobPost } = require('../controllers/Employer/EmployerJobPost');

const router = express.Router();

router.post('/register', registerEmployer);
router.post('/login', loginEmployer);
router.get('/verify-email', verifyEmployerEmail);
router.post('/resend-email', resendVerificationEmail);
router.get('/me', checkAuth, getEmployer);
router.post('/change-password', checkAuth, changePassword)
router.post('/profile',checkAuth, createOrUpdateEmployerProfile);
router.get('/get-profile', checkAuth, getEmployerProfile);

router.post('/create-jobpost',checkAuth, createJobPost);

module.exports = router;