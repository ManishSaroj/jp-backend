// controllers/Admin/AdminProfileController.js
const AdminProfile = require('../../models/Admin/AdminProfile');
const { generateResponse } = require('../../utils/responseUtils');
const multer = require('multer');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 } // 1MB limit
});

const updateJobCategory = async (req, res) => {
  const aid = req.admin.id; // Get aid from the token
  const { jobCategory } = req.body;

  try {
    // Find the admin profile by aid
    let adminProfile = await AdminProfile.findOne({ where: { aid } });

    if (!adminProfile) {
      return generateResponse(res, 404, 'Admin profile not found');
    }

    // Update job category (assuming jobCategory is an array)
    adminProfile.jobCategory = jobCategory;
    adminProfile.updatedAt = new Date(); // Update the updatedAt timestamp

    // Save changes to the database
    await adminProfile.save();

    generateResponse(res, 200, 'Job categories updated successfully', adminProfile);
  } catch (error) {
    console.error('Error updating job categories:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const getJobCategory = async (req, res) => {
  const aid = req.admin.id; // Get aid from the token

  try {
    // Find the admin profile by aid
    const adminProfile = await AdminProfile.findOne({
      where: { aid },
      attributes: ['jobCategory'], // Specify the attribute to retrieve
    });

    if (!adminProfile) {
      return generateResponse(res, 404, 'Admin profile not found');
    }

    generateResponse(res, 200, 'Job category retrieved successfully', adminProfile.jobCategory);
  } catch (error) {
    console.error('Error retrieving job category:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const updateJobType = async (req, res) => {
  const aid = req.admin.id; // Get aid from the token
  const { jobType } = req.body;

  try {
    // Find the admin profile by aid
    let adminProfile = await AdminProfile.findOne({ where: { aid } });

    if (!adminProfile) {
      return generateResponse(res, 404, 'Admin profile not found');
    }

    // Update job type (assuming jobType is an array)
    adminProfile.jobType = jobType;
    adminProfile.updatedAt = new Date(); // Update the updatedAt timestamp

    // Save changes to the database
    await adminProfile.save();

    generateResponse(res, 200, 'Job types updated successfully', adminProfile);
  } catch (error) {
    console.error('Error updating job types:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const getJobType = async (req, res) => {
  const aid = req.admin.id; // Get aid from the token

  try {
    // Find the admin profile by aid
    const adminProfile = await AdminProfile.findOne({
      where: { aid },
      attributes: ['jobType'], // Specify the attribute to retrieve
    });

    if (!adminProfile) {
      return generateResponse(res, 404, 'Admin profile not found');
    }

    generateResponse(res, 200, 'Job type retrieved successfully', adminProfile.jobType);
  } catch (error) {
    console.error('Error retrieving job type:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const getAllJobCategories = async (req, res) => {
  try {
    // Find all admin profiles and retrieve job categories
    const adminProfiles = await AdminProfile.findAll({
      attributes: ['jobCategory'], // Specify the attribute to retrieve
    });

    // Flatten the array of job categories
    const jobCategories = adminProfiles.reduce((acc, profile) => {
      if (Array.isArray(profile.jobCategory)) {
        return acc.concat(profile.jobCategory);
      }
      return acc;
    }, []);

    // Remove duplicates if needed
    const uniqueJobCategories = [...new Set(jobCategories)];

    generateResponse(res, 200, 'All job categories retrieved successfully', uniqueJobCategories);
  } catch (error) {
    console.error('Error retrieving all job categories:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const getAllJobTypes = async (req, res) => {
  try {
    // Find all admin profiles and retrieve job types
    const adminProfiles = await AdminProfile.findAll({
      attributes: ['jobType'], // Specify the attribute to retrieve
    });

    // Flatten the array of job types
    const jobTypes = adminProfiles.reduce((acc, profile) => {
      if (Array.isArray(profile.jobType)) {
        return acc.concat(profile.jobType);
      }
      return acc;
    }, []);

    // Remove duplicates if needed
    const uniqueJobTypes = [...new Set(jobTypes)];

    generateResponse(res, 200, 'All job types retrieved successfully', uniqueJobTypes);
  } catch (error) {
    console.error('Error retrieving all job types:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const uploadAdminImage = upload.single('profileImage');

const uploadAdminImageHandler = async (req, res) => {
  try {
    const aid = req.admin.id; // Get aid from the token

    // Check if image file was uploaded
    if (!req.file) {
      return generateResponse(res, 400, 'No image file uploaded');
    }

    // Get admin profile by aid
    let adminProfile = await AdminProfile.findOne({ where: { aid } });

    if (!adminProfile) {
      return generateResponse(res, 404, 'Admin profile not found');
    }

    // Update admin profile with image buffer
    adminProfile.profileImage = req.file.buffer;
    adminProfile.updatedAt = new Date();
    await adminProfile.save();

    return generateResponse(res, 200, 'Admin profile image uploaded successfully');
  } catch (error) {
    console.error('Error uploading admin profile image:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const getAdminProfileImage = async (req, res) => {
  try {
    const aid = req.admin.id; // Get aid from the token

    // Get admin profile by aid
    const adminProfile = await AdminProfile.findOne({
      where: { aid },
      attributes: ['profileImage']
    });

    if (!adminProfile || !adminProfile.profileImage) {
      return generateResponse(res, 404, 'Admin profile image not found');
    }

    // Set the appropriate content type for the response
    res.contentType('image/jpeg'); // Adjust if you support other image types
    
    // Send the image data
    res.send(adminProfile.profileImage);
  } catch (error) {
    console.error('Error retrieving admin profile image:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};


module.exports = {
  updateJobCategory,
  getJobCategory,
  updateJobType,
  getJobType,
  getAllJobCategories,
  getAllJobTypes,
  uploadAdminImage,
  uploadAdminImageHandler,
  getAdminProfileImage
};