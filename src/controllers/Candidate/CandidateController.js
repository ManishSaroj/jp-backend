const Candidate = require('../../models/CandidateModel');
const CandidateProfile = require('../../models/CandidateProfile');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const transporter = require('../../config/nodemailer.config');
const { candidateVerificationEmail } = require('../../emailTemplates/candidateVerify');
const { generateResponse } = require('../../utils/responseUtils');

const sendVerificationEmail = async (candidate) => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiration = new Date(Date.now() + 5 * 60 * 1000); // Token expires in 5 minutes
  const verificationLink = `${process.env.FRONTEND_BASE_URL}/verify-email?token=${verificationToken}&email=${candidate.email}&userType=candidate`;
  console.log(verificationLink);

  try {
    const emailContent = candidateVerificationEmail(candidate.candidate_name, verificationLink); // Get the email template

    await transporter.sendMail({
      from: `"Aplakaam" <${process.env.EMAIL_USER}>`,
      to: candidate.email,
      subject: 'Welcome to Aplakaam - Verify Your Email Address',
      html: emailContent, // Use the email template content
    });
    // Update the candidate's verification token and token expiration in the database
    await candidate.update({ verificationToken, tokenExpiration });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

const registerCandidate = async (req, res) => {
  const { candidate_name, email, password, phone_number, terms_agreed } = req.body;

  try {
    const existingCandidate = await Candidate.findOne({ where: { email } });
    if (existingCandidate) {
      return generateResponse(res, 400, 'Candidate already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCandidate = await Candidate.create({
      candidate_name,
      email,
      password: hashedPassword,
      phone_number,
      termsAgreed: terms_agreed,
      emailVerified: false, // Add this line to set emailVerified to false initially
    });

     // Create a new CandidateProfile record
     const candidateProfile = await CandidateProfile.create({
      cid: newCandidate.cid,
      email,
      candidate_name,
      phone_number,
    });

    await sendVerificationEmail(newCandidate);

    generateResponse(res, 201, 'Candidate registered successfully. Verification email sent.', { candidate: newCandidate });
  } catch (error) {
    console.error('Error registering candidate:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};


const loginCandidate = async (req, res) => {
  const { email, password } = req.body;
  try {
    const candidate = await Candidate.findOne({ where: { email } });
    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    if (!candidate.emailVerified) {
      return generateResponse(res, 403, 'Email not verified. Please verify your email before logging in.');
    }

    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      return generateResponse(res, 400, 'Invalid credentials');
    }

    const token = jwt.sign(
      {
        id: candidate.cid,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const cookieMaxAge = parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) * 1000; // Convert to milliseconds

    res.cookie('sessionToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: cookieMaxAge,
      sameSite: 'strict', // Add this for better security
      // domain: process.env.COOKIE_DOMAIN,
    });

    generateResponse(res, 200, 'Candidate logged in successfully', { candidate });
  } catch (error) {
    console.error('Error logging in candidate:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};



const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const candidate = await Candidate.findOne({ where: { email } });
    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    if (candidate.emailVerified) {
      return generateResponse(res, 400, 'Email already verified');
    }

    await sendVerificationEmail(candidate);

    generateResponse(res, 200, 'Verification email resent successfully');
  } catch (error) {
    console.error('Error resending verification email:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const verifyCandidateEmail = async (req, res) => {
  const { token, email } = req.query;

  try {
    // First, find the candidate by email
    const candidate = await Candidate.findOne({ where: { email } });

    if (!candidate) {
      return generateResponse(res, 404, 'Candidate not found');
    }

    // If the email is already verified, return a relevant message
    if (candidate.emailVerified) {
      return generateResponse(res, 200, 'Email already verified');
    }

    // If a token is provided, verify it
    if (token) {
      // Check if the token matches and is not expired
      if (candidate.verificationToken === token && new Date(candidate.tokenExpiration) > new Date()) {
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

