const { generateResponse } = require('../../utils/responseUtils');
const Candidate = require('../../models/CandidateModel');

// Controller method to get candidate data
const getCandidate = async (req, res) => {
  try {
    // Extract candidate ID from JWT token
    const candidateId = req.user.id;

    // Fetch candidate data using candidateId
    const candidate = await Candidate.findByPk(candidateId);

    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    // Send candidate data to frontend
    generateResponse(res, 200, 'Candidate data retrieved successfully', { candidate });
  } catch (error) {
    console.error('Error fetching candidate data:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

module.exports = {
  getCandidate,
};
