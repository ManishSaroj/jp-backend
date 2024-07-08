const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/Admin/adminAuth');
const checkAdminAuth = require('../middlewares/adminAuthMiddleware');
const adminlogoutMiddleware = require('../middlewares/adminLogoutMiddleware'); // Assuming this is the path to your logout middleware
const { getAllCandidatesWithProfiles, getCandidateProfileById, uploadFiles, updateCandidateAndProfile } = require('../controllers/Admin/adminCandidateController');
const { getAllEmployersWithProfiles, getEmployerProfileById } = require('../controllers/Admin/adminEmployerController');
const { updateJobCategory, getJobCategory, updateJobType, getJobType } = require('../controllers/Admin/AdminProfileController'); // Import the profile controllers for job category and job type

// Authentication route
router.post('/login', loginAdmin);

// Logout route
router.post('/logout', adminlogoutMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: "Admin logged out successfully" });
});

router.get('/checkAdminAuth', checkAdminAuth, (req, res) => {
  res.status(200).json({ success: true, message: "Authenticated as admin", admin: req.admin });
});

router.get('/candidates', getAllCandidatesWithProfiles);
router.get('/candidates/profile/:profileId', getCandidateProfileById);
router.put('/candidates/profile/:profileId', checkAdminAuth, uploadFiles, updateCandidateAndProfile);

router.get('/employers', getAllEmployersWithProfiles);
router.get('/employers/profile/:profileId', getEmployerProfileById);

// Routes for job category and job type
router.put('/jobCategory/:profileId', updateJobCategory);
router.get('/jobCategory/:profileId',  getJobCategory);

router.put('/jobType/profile/:profileId',  updateJobType);
router.get('/jobType/profile/:profileId',  getJobType);


module.exports = router;
