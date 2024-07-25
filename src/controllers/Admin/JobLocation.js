const JobLocation = require('../../models/Admin/JobLocation');
const { generateResponse } = require('../../utils/responseUtils');
const multer = require('multer');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
}).single('locationImage'); // Define single file upload

const createOrUpdateJobLocation = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return generateResponse(res, 400, 'Error uploading file', null, err.message);
    }

    const { id, state, city, isHide } = req.body;
    const locationImage = req.file ? req.file.buffer : null;

    try {
      let jobLocation;
      let message;

      if (id) {
        // Update existing job location
        jobLocation = await JobLocation.findByPk(id);

        if (!jobLocation) {
          return generateResponse(res, 404, 'Job location not found');
        }

        await jobLocation.update({
          locationImage: locationImage !== null ? locationImage : jobLocation.locationImage,
          state: state || jobLocation.state,
          city: city || jobLocation.city,
          isHide: isHide !== undefined ? isHide : jobLocation.isHide,
        });

        message = 'Job location updated successfully';
      } else {
        // Create new job location
        jobLocation = await JobLocation.create({
          locationImage,
          state,
          city,
          isHide,
        });

        message = 'Job location created successfully';
      }

      return generateResponse(res, 200, message, jobLocation);
    } catch (error) {
      console.error('Error creating/updating job location:', error);
      return generateResponse(res, 500, 'Server error', null, error.message);
    }
  });
};

const getJobLocations = async (req, res) => {
  try {
    const jobLocations = await JobLocation.findAll({
      where: {
        isHide: false,
      },
    });

    return generateResponse(res, 200, 'Job locations retrieved successfully', jobLocations);
  } catch (error) {
    console.error('Error retrieving job locations:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

module.exports = {
  createOrUpdateJobLocation,
  getJobLocations,
};
