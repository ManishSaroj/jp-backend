const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/Admin/adminAuth');
const checkAdminAuth = require('../middlewares/adminAuthMiddleware');
const adminlogoutMiddleware = require('../middlewares/adminLogoutMiddleware'); // Assuming this is the path to your logout middleware
const { getAllCandidatesWithProfiles, getCandidateProfileById } = require('../controllers/Admin/adminCandidateController');
const { getAllEmployersWithProfiles, getEmployerProfileById } = require('../controllers/Admin/adminEmployerController');

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

router.get('/employers', getAllEmployersWithProfiles);
router.get('/employers/profile/:profileId', getEmployerProfileById);

module.exports = router;
