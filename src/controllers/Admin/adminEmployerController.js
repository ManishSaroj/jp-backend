const Employer = require('../../models/Employer/EmployerModel');
const EmployerProfile = require('../../models/Employer/EmployerProfile');
const { generateResponse } = require('../../utils/responseUtils');
const multer = require('multer');
const { Op } = require('sequelize');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const getAllEmployersWithProfiles = async (req, res) => {
  try {
    const { sortOrder = 'ASC', search = '', page = 1, limit = 5 } = req.query;

    // Validate sortOrder
    if (sortOrder !== 'ASC' && sortOrder !== 'DESC') {
      return generateResponse(res, 400, 'Invalid sort order');
    }

    // Convert page and limit to integers
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    // Calculate offset
    const offset = (pageInt - 1) * limitInt;

    const whereClause = search
      ? {
          [Op.or]: [
            { '$EmployerProfile.eid$': { [Op.like]: `%${search}%` } },
            { '$EmployerProfile.email$': { [Op.like]: `%${search}%` } },
            { '$EmployerProfile.company_name$': { [Op.like]: `%${search}%` } },
            { '$EmployerProfile.phone_number$': { [Op.like]: `%${search}%` } },
            { '$EmployerProfile.city$': { [Op.like]: `%${search}%` } },
            { '$EmployerProfile.company_website$': { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows: employers } = await Employer.findAndCountAll({
      attributes: ['email'],
      include: [{
        model: EmployerProfile,
        as: 'EmployerProfile',
        attributes: ['profileId', 'eid', 'company_name', 'phone_number', 'city', 'company_website']
      }],
      where: whereClause,
      order: [
        [EmployerProfile, 'eid', sortOrder]
      ],
      limit: limitInt,
      offset: offset
    });

    if (!employers || employers.length === 0) {
      return generateResponse(res, 404, 'No employers found');
    }

    const totalPages = Math.ceil(count / limitInt);

    generateResponse(res, 200, 'Employers retrieved successfully', {
      employers,
      currentPage: pageInt,
      totalPages,
      totalEmployers: count
    });
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


const updateEmployerAndProfile = async (req, res) => {
  const { profileId } = req.params;
  const updateData = req.body;

  try {
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

    const t = await employerProfile.sequelize.transaction();

    try {
      // Uncomment these if you want to handle file uploads
      // if (req.files['company_logo']) {
      //   updateData.company_logo = req.files['company_logo'][0].buffer;
      // }
      // if (req.files['company_banner']) {
      //   updateData.company_banner = req.files['company_banner'][0].buffer;
      // }

      await EmployerProfile.update(updateData, {
        where: { profileId },
        transaction: t
      });

      const employerUpdateData = {};
      if (updateData.email) {
        employerUpdateData.email = updateData.email;
      }

      if (Object.keys(employerUpdateData).length > 0) {
        await Employer.update(employerUpdateData, {
          where: { eid: employerProfile.eid },
          transaction: t
        });
      }

      await t.commit();

      const updatedProfile = await EmployerProfile.findOne({
        where: { profileId },
        include: [{
          model: Employer,
          attributes: ['eid', 'email']
        }]
      });

      const profileData = updatedProfile.toJSON();
      if (profileData.company_logo) {
        profileData.company_logo = profileData.company_logo.toString('base64');
      }
      if (profileData.company_banner) {
        profileData.company_banner = profileData.company_banner.toString('base64');
      }

      generateResponse(res, 200, 'Employer and profile updated successfully', { employerProfile: profileData });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating employer and profile:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Middleware to handle file uploads for company_logo and company_banner
const uploadEmployerFiles = upload.fields([
  { name: 'company_logo', maxCount: 1 },
  { name: 'company_banner', maxCount: 1 }
]);


module.exports = {
  getAllEmployersWithProfiles,
  getEmployerProfileById,
  updateEmployerAndProfile,
  uploadEmployerFiles
};