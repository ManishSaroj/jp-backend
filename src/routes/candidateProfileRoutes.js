//candidateRoutes.js

const express = require('express');
const { createCandidateProfile } = require('../controllers/Candidate/CandidateProfileController')
const router = express.Router();

router.post('/', createCandidateProfile);

module.exports = router;