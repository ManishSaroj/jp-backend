const Candidate = require('../../models/CandidateModel');
const CandidateProfile = require('../../models/CandidateProfile');
const { generateResponse } = require('../../utils/responseUtils');

const getAllCandidatesWithProfiles = async (req, res) => {
  try {
    const candidates = await Candidate.findAll({
      attributes: ['email'],
      include: [{
        model: CandidateProfile,
        as: 'CandidateProfile',
        attributes: ['profileId', 'cid', 'candidate_name', 'phone_number', 'qualification']
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
      if (profileData.candidate_banner) {
        profileData.candidate_banner = profileData.candidate_banner.toString('base64');
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
  
  module.exports = {
    getAllCandidatesWithProfiles,
    getCandidateProfileById
  };