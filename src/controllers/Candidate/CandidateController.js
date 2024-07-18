const Candidate = require('../../models/Candidate/CandidateModel');
const CandidateProfile = require('../../models/Candidate/CandidateProfile');
const bcrypt = require('bcryptjs');
const { generateResponse } = require('../../utils/responseUtils');
const { sendVerificationEmail } = require('../../utils/verifyEmailUtils')
const { generateToken, setTokenCookie } = require('../../utils/jwtUtils');

// Registers a new candidate.
const registerCandidate = async (req, res) => {
  const { candidate_name, email, password, phone_number, terms_agreed } = req.body;

  try {
    const existingCandidate = await Candidate.findOne({ where: { email } });
    if (existingCandidate) {
      return generateResponse(res, 400, 'Candidate already exists');
    }
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCandidate = await Candidate.create({
      candidate_name,
      email,
      password: hashedPassword,
      phone_number,
      termsAgreed: terms_agreed,
      emailVerified: false, // set emailVerified to false initially
    });

    // Create a new CandidateProfile record
    const candidateProfile = await CandidateProfile.create({
      cid: newCandidate.cid,
      email,
      candidate_name,
      phone_number,
    });

    // Send a verification email to the newly registered candidate
    await sendVerificationEmail(newCandidate, 'candidate');

    generateResponse(res, 201, 'Candidate registered successfully. Verification email sent.', { candidate: newCandidate });
  } catch (error) {
    console.error('Error registering candidate:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Logs in a candidate
const loginCandidate = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    // Find the candidate by email
    const candidate = await Candidate.findOne({ where: { email } });
    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    // Check if the candidate's email is verified
    if (!candidate.emailVerified) {
      return generateResponse(res, 403, 'Email not verified. Please verify your email before logging in.');
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      return generateResponse(res, 400, 'Invalid credentials');
    }

    // Generate a JWT token and set it as a cookie
    const token = generateToken({
      id: candidate.cid,
      role: 'candidate',
    }, rememberMe);
    setTokenCookie(res, token, rememberMe);

    generateResponse(res, 200, 'Candidate logged in successfully', { candidate });
  } catch (error) {
    console.error('Error logging in candidate:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Resends a verification email to a candidate
const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    // Find the candidate by email
    const candidate = await Candidate.findOne({ where: { email } });
    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    // Check if the candidate's email is already verified
    if (candidate.emailVerified) {
      return generateResponse(res, 400, 'Email already verified');
    }

    // Check the rate limit for resending verification emails
    const thirtyMinutesAgo = new Date(new Date() - 30 * 60 * 1000); // 30 minutes ago
    if (candidate.verificationAttempts >= 5 && candidate.lastVerificationAttempt > thirtyMinutesAgo) {
      return generateResponse(res, 429, 'Too many requests. Please try again after 30 minutes.');
    }

    // Update the candidate's verification attempts and last verification attempt
    if (candidate.lastVerificationAttempt <= thirtyMinutesAgo) {
      candidate.verificationAttempts = 1; // Reset attempts after 30 minutes
    } else {
      candidate.verificationAttempts += 1;
    }
    candidate.lastVerificationAttempt = new Date();
    await candidate.save();

    // Resend the verification email
    await sendVerificationEmail(candidate, 'candidate');


    generateResponse(res, 200, 'Verification email resent successfully');
  } catch (error) {
    console.error('Error resending verification email:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Verifies a candidate's email using a token
const verifyCandidateEmail = async (req, res) => {
  const { token, email } = req.query;

  try {
    // Find the candidate by email
    const candidate = await Candidate.findOne({ where: { email } });

    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    // Check if the candidate's email is already verified
    if (candidate.emailVerified) {
      return generateResponse(res, 200, 'Email already verified');
    }

    // If a token is provided, verify it
    if (token) {
      // Check if the token matches and is not expired
      if (candidate.verificationToken === token && new Date(candidate.tokenExpiration) > new Date()) {
        // Update candidate's email verification status
        await candidate.update({
          emailVerified: true,
          verificationToken: null,
          tokenExpiration: null,
        });
        return generateResponse(res, 200, 'Email verified successfully');
      } else {
        // If the token is invalid or expired
        return generateResponse(res, 400, 'Invalid or expired verification token');
      }
    } else {
      // If no token is provided
      return generateResponse(res, 400, 'Verification token is required');
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

module.exports = {
  registerCandidate,
  loginCandidate,
  resendVerificationEmail,
  verifyCandidateEmail,
};