const Candidate = require('../../models/Candidate/CandidateModel');
const CandidateProfile = require('../../models/Candidate/CandidateProfile');
const { generateResponse } = require('../../utils/responseUtils');
const multer = require('multer');
const { Op } = require('sequelize');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const getAllCandidatesWithProfiles = async (req, res) => {
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
            { '$CandidateProfile.cid$': { [Op.like]: `%${search}%` } },
            { '$CandidateProfile.email$': { [Op.like]: `%${search}%` } },
            { '$CandidateProfile.candidate_name$': { [Op.like]: `%${search}%` } },
            { '$CandidateProfile.phone_number$': { [Op.like]: `%${search}%` } },
            { '$CandidateProfile.city$': { [Op.like]: `%${search}%` } },
            { '$CandidateProfile.qualification$': { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows: candidates } = await Candidate.findAndCountAll({
      attributes: ['email'],
      include: [{
        model: CandidateProfile,
        as: 'CandidateProfile',
        attributes: ['profileId', 'cid', 'candidate_name', 'phone_number', 'city', 'qualification']
      }],
      where: whereClause,
      order: [
        [CandidateProfile, 'cid', sortOrder]
      ],
      limit: limitInt,
      offset: offset
    });

    if (!candidates || candidates.length === 0) {
      return generateResponse(res, 404, 'No candidates found');
    }

    const totalPages = Math.ceil(count / limitInt);

    generateResponse(res, 200, 'Candidates retrieved successfully', { 
      candidates,
      currentPage: pageInt,
      totalPages,
      totalCandidates: count
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Updated function to get candidate profile by profileId
const getCandidateProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;

    const candidateProfile = await CandidateProfile.findOne({
      where: { profileId },
      include: [{
        model: Candidate,
        attributes: ['cid', 'email']
      }]
    });

    if (!candidateProfile) {
      return generateResponse(res, 404, 'Candidate profile not found');
    }

    // Convert BLOB fields to base64 strings
    const profileData = candidateProfile.toJSON();
    if (profileData.candidate_image) {
      profileData.candidate_image = profileData.candidate_image.toString('base64');
    }
    if (profileData.candidate_resume) {
      profileData.candidate_resume = profileData.candidate_resume.toString('base64');
    }

    generateResponse(res, 200, 'Candidate profile retrieved successfully', { candidateProfile: profileData });
  } catch (error) {
    console.error('Error fetching candidate profile:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const updateCandidateAndProfile = async (req, res) => {
  const { profileId } = req.params;
  const updateData = req.body;
  const registeredEmail = updateData.registeredEmail;
  
  delete updateData.registeredEmail;
  delete updateData.candidate_image;
  delete updateData.candidate_resume;
  delete updateData. resumeFileName;

  try {
    const candidateProfile = await CandidateProfile.findOne({
      where: { profileId },
      include: [{
        model: Candidate,
        attributes: ['cid', 'email']
      }]
    });

    if (!candidateProfile) {
      return generateResponse(res, 404, 'Candidate profile not found');
    }

    const t = await candidateProfile.sequelize.transaction();

    try {
      // Update CandidateProfile
      await CandidateProfile.update(updateData, {
        where: { profileId },
        transaction: t
      });

      // Update Candidate's email if it has changed
      if (registeredEmail && registeredEmail !== candidateProfile.Candidate.email) {
        await Candidate.update({ email: registeredEmail }, {
          where: { cid: candidateProfile.cid },
          transaction: t
        });
      }

      await t.commit();

      const updatedProfile = await CandidateProfile.findOne({
        where: { profileId },
        include: [{
          model: Candidate,
          attributes: ['cid', 'email']
        }]
      });

      const profileData = updatedProfile.toJSON();

      generateResponse(res, 200, 'Candidate and profile updated successfully', { candidateProfile: profileData });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error updating candidate and profile:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Middleware to handle file uploads for candidate_image, candidate_banner, and candidate_resume
// const uploadFiles = upload.fields([{ name: 'candidate_image', maxCount: 1 }, { name: 'candidate_resume', maxCount: 1 }]);

module.exports = {
  getAllCandidatesWithProfiles,
  getCandidateProfileById,
  updateCandidateAndProfile,
  // uploadFiles
};