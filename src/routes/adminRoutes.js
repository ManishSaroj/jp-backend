const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/Admin/adminAuth');
const checkAdminAuth = require('../middlewares/adminAuthMiddleware');
const adminlogoutMiddleware = require('../middlewares/adminLogoutMiddleware'); // Assuming this is the path to your logout middleware
const { requestPasswordReset, resetPassword } = require('../controllers/Admin/resetPassword')
const { changeAdminPassword } = require('../controllers/Admin/changeAdminPassword');
const { getTotalCounts } = require('../controllers/Admin/totalCountController')
const { getAllCandidatesWithProfiles, getCandidateProfileById, updateCandidateAndProfile } = require('../controllers/Admin/adminCandidateController');
const { getAllEmployersWithProfiles, getEmployerProfileById, updateEmployerAndProfile } = require('../controllers/Admin/adminEmployerController');
const { updateJobCategory, getJobCategory, updateJobType, getJobType, getAllJobCategories, getAllJobTypes } = require('../controllers/Admin/AdminProfileController'); // Import the profile controllers for job category and job type
const {getAllPackages, updatePackageDetails } = require('../controllers/Admin/PackageController');

// Authentication route
router.post('/login', loginAdmin);

// Logout route
router.post('/logout', adminlogoutMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: "Admin logged out successfully" });
});

router.get('/checkAdminAuth', checkAdminAuth, (req, res) => {
  res.status(200).json({ success: true, message: "Authenticated as admin", admin: req.admin });
});

router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/change-password', checkAdminAuth, changeAdminPassword);

router.get('/total-counts', getTotalCounts);
router.get('/candidates', getAllCandidatesWithProfiles);
router.get('/candidates/profile/:profileId', getCandidateProfileById);
router.put('/candidates/profile/:profileId', updateCandidateAndProfile);

router.get('/employers', getAllEmployersWithProfiles);
router.get('/employers/profile/:profileId', getEmployerProfileById);
router.put('/employers/profile/:profileId', updateEmployerAndProfile);

// Routes for job category and job type
router.put('/jobCategory',checkAdminAuth, updateJobCategory);
router.get('/jobCategory',checkAdminAuth, getJobCategory);
router.get('/jobCategories', getAllJobCategories);
router.put('/jobType',checkAdminAuth, updateJobType);
router.get('/jobType',checkAdminAuth, getJobType);
router.get('/jobTypes', getAllJobTypes);

router.get('/packages',checkAdminAuth , getAllPackages);
router.put('/packages',checkAdminAuth, updatePackageDetails);
router.get('/setPackages', getAllPackages);

module.exports = router;
