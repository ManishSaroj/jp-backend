const Candidate = require('../../models/Candidate/CandidateModel');
const CandidateProfile = require('../../models/Candidate/CandidateProfile');
const { generateResponse } = require('../../utils/responseUtils');
const multer = require('multer');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const getAllCandidatesWithProfiles = async (req, res) => {
  try {
    const candidates = await Candidate.findAll({
      attributes: ['email'],
      include: [{
        model: CandidateProfile,
        as: 'CandidateProfile',
        attributes: ['profileId', 'cid', 'candidate_name', 'phone_number', 'city', 'qualification']
      }]
    });

    if (!candidates || candidates.length === 0) {
      return generateResponse(res, 404, 'No candidates found');
    }

    generateResponse(res, 200, 'Candidates retrieved successfully', { candidates });
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
        // if (req.files['candidate_image']) {
        //   updateData.candidate_image = req.files['candidate_image'][0].buffer;
        // }
        // if (req.files['candidate_banner']) {
        //   updateData.candidate_banner = req.files['candidate_banner'][0].buffer;
        // }
        // if (req.files['candidate_resume']) {
        //   updateData.candidate_resume = req.files['candidate_resume'][0].buffer;
        //   updateData.resumeFileName = req.files['candidate_resume'][0].originalname;
        // }
  
        await CandidateProfile.update(updateData, {
          where: { profileId },
          transaction: t
        });
  
        const candidateUpdateData = {};
        if (updateData.email) {
          candidateUpdateData.email = updateData.email;
        }
  
        if (Object.keys(candidateUpdateData).length > 0) {
          await Candidate.update(candidateUpdateData, {
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
        if (profileData.candidate_image) {
          profileData.candidate_image = profileData.candidate_image.toString('base64');
        }
        if (profileData.candidate_resume) {
          profileData.candidate_resume = profileData.candidate_resume.toString('base64');
        }
  
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
  const uploadFiles = upload.fields([{ name: 'candidate_image', maxCount: 1 }, { name: 'candidate_banner', maxCount: 1 }, { name: 'candidate_resume', maxCount: 1 }]);
  
  module.exports = {
    getAllCandidatesWithProfiles,
    getCandidateProfileById, 
    updateCandidateAndProfile,
    uploadFiles
  };