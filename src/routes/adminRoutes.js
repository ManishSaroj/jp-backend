// adminRoutes.js
const express = require('express');
const { loginAdmin } = require('../controllers/Admin/adminAuth');
const checkAuth = require('../middlewares/authMiddleware');
const { getAllCandidatesWithProfiles, getCandidateProfileById } = require('../controllers/Admin/adminCandidateController');
const { getAllEmployersWithProfiles, getEmployerProfileById  } = require('../controllers/Admin/adminEmployerController');
  

const router = express.Router();

// Authentication route
router.post('/login', loginAdmin);


router.get('/candidates', getAllCandidatesWithProfiles);
router.get('/candidates/profile/:profileId', checkAuth, getCandidateProfileById);

router.get('/employers', getAllEmployersWithProfiles);
router.get('/employers/profile/:profileId', checkAuth, getEmployerProfileById);


module.exports = router;