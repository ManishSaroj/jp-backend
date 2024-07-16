const multer = require('multer');
const { generateResponse } = require('../../utils/responseUtils');
const Candidate = require('../../models/Candidate/CandidateModel');
const bcrypt = require('bcryptjs');

// Controller method to get candidate data
const getCandidate = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const candidate = await Candidate.findByPk(candidateId, {
      attributes: ['candidate_name', 'email']
    });

    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    // Prepare the response data
    const responseData = {
      candidate_name: candidate.candidate_name,
      email: candidate.email,
    };

    generateResponse(res, 200, 'Candidate data retrieved successfully', responseData);
  } catch (error) {
    console.error('Error fetching candidate data:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Controller method to change candidate's password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const candidateId = req.user.id;

    // Fetch candidate data using candidateId
    const candidate = await Candidate.findOne({ where: { cid: candidateId } });

    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    // Debugging: Log the candidate's stored password
    console.log(`Stored password hash: ${candidate.password}`);

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, candidate.password);

    // Debugging: Log the result of the password comparison
    console.log(`Is old password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      return generateResponse(res, 400, 'Old password is incorrect');
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Debugging: Log the new hashed password
    console.log(`New password hash: ${hashedNewPassword}`);

    // Update candidate's password in the database
    await candidate.update({ password: hashedNewPassword });

    generateResponse(res, 200, 'Password updated successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};


module.exports = {
  getCandidate,
  changePassword,
};