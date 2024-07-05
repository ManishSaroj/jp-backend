// adminRoutes.js
const express = require('express');
const { loginAdmin } = require('../controllers/Admin/adminAuth');
const checkAuth = require('../middlewares/authMiddleware');
const { getAllCandidatesWithProfiles, getCandidateProfileById } = require('../controllers/Admin/adminCandidateController');

const router = express.Router();

// Authentication route
router.post('/login', loginAdmin);


router.get('/candidates', checkAuth, getAllCandidatesWithProfiles);
router.get('/candidates/profile/:profileId', checkAuth, getCandidateProfileById);

module.exports = router;