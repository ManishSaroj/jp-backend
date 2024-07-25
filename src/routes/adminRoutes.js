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
const {uploadAdminImage, uploadAdminImageHandler, getAdminProfileImage, updateJobCategory, getJobCategory, updateJobType, getJobType, getAllJobCategories, getAllJobTypes } = require('../controllers/Admin/AdminProfileController'); // Import the profile controllers for job category and job type
const {getAllPackages, updatePackageDetails } = require('../controllers/Admin/PackageController');
const { deactivateCandidate, activateCandidate, deactivateEmployer, activateEmployer, getCandidateStatus, getEmployerStatus } = require('../controllers/Admin/UserStatusController');
const { createMessage, getAllMessages, deleteMessageById, deleteAllMessages, updateMessageReadStatus } = require('../controllers/Admin/ContactMessage');
const { addState, getAllStates, updateState, deleteState, addCity, getAllCities, updateCity, deleteCity } = require('../controllers/Admin/Location')
const { createOrUpdateJobLocation, getJobLocations } = require('../controllers/Admin/JobLocation');
const { createOrUpdateFAQ, getFAQs, deleteFAQ } = require('../controllers/Admin/FAQController');
const { createOrUpdateAd, getAds } = require('../controllers/Admin/ManageAdsController');

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

router.post('/upload-profile-image',checkAdminAuth, uploadAdminImage, uploadAdminImageHandler);
router.get('/profile-image',checkAdminAuth, getAdminProfileImage);

router.get('/total-counts', getTotalCounts);
router.get('/candidates', getAllCandidatesWithProfiles);
router.get('/candidates/profile/:profileId', getCandidateProfileById);
router.put('/candidates/profile/:profileId', updateCandidateAndProfile);

router.get('/employers', getAllEmployersWithProfiles);
router.get('/employers/profile/:profileId', getEmployerProfileById);
router.put('/employers/profile/:profileId', updateEmployerAndProfile);

// Candidate routes
router.put('/candidates/:candidateId/deactivate', checkAdminAuth, deactivateCandidate);
router.put('/candidates/:candidateId/activate', checkAdminAuth, activateCandidate);
router.get('/candidates/:candidateId/status', checkAdminAuth, getCandidateStatus); 

// Employer routes
router.put('/employers/:employerId/deactivate', checkAdminAuth, deactivateEmployer);
router.put('/employers/:employerId/activate', checkAdminAuth, activateEmployer);
router.get('/employers/:employerId/status', checkAdminAuth, getEmployerStatus);

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

router.post('/contact', createMessage);
router.get('/contact', getAllMessages);
router.delete('/contact/:id', deleteMessageById);
router.delete('/contact', deleteAllMessages);
router.patch('/contact/:id', updateMessageReadStatus);

router.post('/states', addState);
router.get('/states', getAllStates);
router.put('/states/:StateId', updateState);
router.delete('/states/:StateId', deleteState);

router.post('/cities', addCity);
router.get('/cities', getAllCities);
router.put('/cities/:CityId', updateCity);
router.delete('/cities/:CityId', deleteCity);

// Job Location routes
router.post('/job-locations', createOrUpdateJobLocation);
router.get('/job-locations', getJobLocations);

// FAQ routes
router.post('/faqs', createOrUpdateFAQ);
router.get('/faqs', getFAQs);
router.delete('/faqs/:id', deleteFAQ);

// ManageAds routes
router.post('/ads', createOrUpdateAd);
router.get('/ads', getAds);

module.exports = router;
