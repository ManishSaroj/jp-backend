// backend/src/routes/employerAuthRoutes.js
const express = require('express');
const { googleAuth, googleAuthCallback, linkedinAuth, linkedinAuthCallback } = require('../controllers/Employer/EmployerAuthController');

const router = express.Router();

router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback);

router.get('/auth/linkedin', linkedinAuth);
router.get('/auth/linkedin/callback', linkedinAuthCallback);

module.exports = router;
