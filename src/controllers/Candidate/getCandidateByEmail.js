const Candidate = require('../../models/CandidateModel');
const { generateResponse } = require('../../utils/responseUtils');

const getCandidateByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const candidate = await Candidate.findOne({ where: { email } });
    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    generateResponse(res, 200, 'Candidate found successfully', { candidate });
  } catch (error) {
    console.error('Error fetching candidate by email:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

module.exports = {
  getCandidateByEmail,
};
