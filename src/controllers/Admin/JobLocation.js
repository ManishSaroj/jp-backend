const multer = require('multer');
const JobLocation = require('../../models/Admin/JobLocation');
const { generateResponse } = require('../../utils/responseUtils');

// Multer storage configuration
const storage = multer.memoryStorage();
const uploadLocationImage = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).array('locationImage');

const createOrUpdateJobLocation = async (req, res) => {
  uploadLocationImage(req, res, async (err) => {
    if (err) {
      return generateResponse(res, 400, 'Error uploading file', null, err.message);
    }

    try {
      const locations = JSON.parse(req.body.locations);
      const files = req.files || [];

      const updatedLocations = await Promise.all(locations.map(async (location, index) => {
        const { id, state, city, isHide } = location;
        const locationImage = files[index] ? files[index].buffer : null;

        let jobLocation;
        if (id) {
          // Update existing job location
          jobLocation = await JobLocation.findByPk(id);
          if (jobLocation) {
            await jobLocation.update({
              locationImage: locationImage || jobLocation.locationImage,
              state: state || jobLocation.state,
              city: city || jobLocation.city,
              isHide: isHide !== undefined ? isHide : jobLocation.isHide,
            });
          } else {
            // If no existing location found with this id, create a new one
            jobLocation = await JobLocation.create({
              locationImage,
              state,
              city,
              isHide,
            });
          }
        } else {
          // Create new job location if no id provided
          jobLocation = await JobLocation.create({
            locationImage,
            state,
            city,
            isHide,
          });
        }
        return jobLocation;
      }));

      return generateResponse(res, 200, 'Job locations updated successfully', updatedLocations);
    } catch (error) {
      console.error('Error creating/updating job locations:', error);
      return generateResponse(res, 500, 'Server error', null, error.message);
    }
  });
};

const getJobLocations = async (req, res) => {
  try {
    const jobLocations = await JobLocation.findAll();
    
    // Convert image buffers to base64 strings
    const locationsWithBase64Images = jobLocations.map(location => {
      const locationData = location.toJSON();
      if (locationData.locationImage) {
        locationData.locationImage = `data:image/jpeg;base64,${locationData.locationImage.toString('base64')}`;
      }
      return locationData;
    });

    return generateResponse(res, 200, 'Job locations retrieved successfully', locationsWithBase64Images);
  } catch (error) {
    console.error('Error retrieving job locations:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

module.exports = {
  uploadLocationImage,
  createOrUpdateJobLocation,
  getJobLocations,
};