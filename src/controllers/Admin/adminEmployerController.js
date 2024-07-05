const Employer = require('../../models/EmployerModel');
const EmployerProfile = require('../../models/EmployerProfile');
const { generateResponse } = require('../../utils/responseUtils');

const getAllEmployersWithProfiles = async (req, res) => {
  try {
    const employers = await Employer.findAll({
      attributes: ['email'],
      include: [{
        model: EmployerProfile,
        attributes: ['profileId', 'eid', 'company_name', 'phone_number', 'city', 'company_website']
      }]
    });

    if (!employers || employers.length === 0) {
      return generateResponse(res, 404, 'No employers found');
    }

    generateResponse(res, 200, 'Employers retrieved successfully', { employers });
  } catch (error) {
    console.error('Error fetching employers:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const getEmployerProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;

    const employerProfile = await EmployerProfile.findOne({
      where: { profileId },
      include: [{
        model: Employer,
        attributes: ['eid', 'email']
      }]
    });

    if (!employerProfile) {
      return generateResponse(res, 404, 'Employer profile not found');
    }

    // Convert BLOB fields to base64 strings
    const profileData = employerProfile.toJSON();
    if (profileData.company_logo) {
      profileData.company_logo = profileData.company_logo.toString('base64');
    }
    if (profileData.company_banner) {
      profileData.company_banner = profileData.company_banner.toString('base64');
    }

    generateResponse(res, 200, 'Employer profile retrieved successfully', { employerProfile: profileData });
  } catch (error) {
    console.error('Error fetching employer profile:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

module.exports = {
  getAllEmployersWithProfiles,
  getEmployerProfileById
};