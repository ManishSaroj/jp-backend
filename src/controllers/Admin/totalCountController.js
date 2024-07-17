const Employer = require('../../models/Employer/EmployerModel');
const Candidate = require('../../models/Candidate/CandidateModel');
const { generateResponse } = require('../../utils/responseUtils');

const getTotalCounts = async (req, res) => {
  try {
    const [employerCount, candidateCount] = await Promise.all([
      Employer.count(),
      Candidate.count(),
    ]);

    generateResponse(res, 200, 'Counts retrieved successfully', {
      totalEmployers: employerCount,
      totalCandidates: candidateCount,
      totalUsers: employerCount + candidateCount, // Calculate totalUsers as sum of employers and candidates
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

module.exports = {
  getTotalCounts,
};
