const Candidate = require('../../models/CandidateModel');
const { generateResponse } = require('../../utils/responseUtils');

const getCandidateByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const candidate = await Candidate.findOne({ where: { email } });
    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }
    return generateResponse(res, 200, 'Candidate found', candidate);
  } catch (error) {
    console.error('Error fetching candidate data:', error);
    return generateResponse(res, 500, 'Internal Server Error', null, error.message);
  }
};

module.exports = getCandidateByEmail;
