// backend/src/routes/candidateAuthRoutes.js
const express = require('express');
const { googleAuth, googleAuthCallback, linkedinAuth, linkedinAuthCallback } = require('../controllers/Candidate/CandidateAuthController');

const router = express.Router();

router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback);

router.get('/auth/linkedin', linkedinAuth);
router.get('/auth/linkedin/callback', linkedinAuthCallback);

module.exports = router;
