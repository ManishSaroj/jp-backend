const { Candidate } = require('../../models/CandidateModel');
const { CandidateProfile } = require('../../models/CandidateProfile');
const { generateResponse } = require('../../utils/responseUtils');

const getAllCandidatesWithProfiles = async (req, res) => {
    try {
      const candidates = await Candidate.findAll({
        include: [{
          model: CandidateProfile,
          as: 'CandidateProfile'
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

  module.exports = {
    getAllCandidatesWithProfiles
  };