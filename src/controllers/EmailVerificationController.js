// controllers/EmailVerificationController.js
const Candidate = require('../models/CandidateModel');
const Employer = require('../models/EmployerModel');

const generateResponse = (res, status, message, data = null, error = null) => {
  res.status(status).json({ message, data, error, success: status >= 200 && status < 300 });
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  const userType = req.baseUrl.split('/')[2]; // Extract 'candidates' or 'employers' from the URL

  try {
    let user;
    if (userType === 'candidates') {
      user = await Candidate.findOne({ where: { verificationToken: token } });
    } else if (userType === 'employers') {
      user = await Employer.findOne({ where: { verificationToken: token } });
    } else {
      return generateResponse(res, 400, 'Invalid user type');
    }

    if (!user) {
      return generateResponse(res, 400, 'Invalid verification token');
    }

    // Check if token is expired
    if (new Date() > user.tokenExpiration) {
      return generateResponse(res, 400, 'Verification token has expired');
    }

    // Update emailVerified flag to true and clear verification token and expiration
    user.emailVerified = true;
    user.verificationToken = null;
    user.tokenExpiration = null;
    await user.save();

    return generateResponse(res, 200, 'Email verification successful');
  } catch (error) {
    console.error('Error verifying email:', error);
    return generateResponse(res, 500, 'Internal Server Error', null, error.message);
  }
};

module.exports = { verifyEmail };