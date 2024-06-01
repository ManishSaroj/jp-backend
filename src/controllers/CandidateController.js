const Candidate = require('../models/CandidateModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const transporter = require('../config/nodemailer.config');
const { Op } = require('sequelize');
const { candidateVerificationEmail } = require('../emailTemplates/candidateVerify')

const generateResponse = (res, status, message, data = null, error = null) => {
  res.status(status).json({ message, data, error, success: status >= 200 && status < 300 });
};

const sendVerificationEmail = async (candidate) => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiration = new Date(Date.now() + 5 * 60 * 1000); // Token expires in 5 minutes
  const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}&userType=candidate`;

  try {
    const emailContent = candidateVerificationEmail(candidate.username, verificationLink); // Get the email template

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
    // Handle error
  }
};

const registerCandidate = async (req, res) => {
  const { username, email, password, phone_number } = req.body;

  try {
    const existingCandidate = await Candidate.findOne({ where: { email } });
    if (existingCandidate) {
      return generateResponse(res, 400, 'Candidate already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCandidate = await Candidate.create({
      username,
      email,
      password: hashedPassword,
      phone_number,
      emailVerified: false, // Add this line to set emailVerified to false initially
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

    // if (!candidate.emailVerified) {
    //   return generateResponse(res, 403, 'Email not verified. Please verify your email before logging in.');
    // }

    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      return generateResponse(res, 400, 'Invalid credentials');
    }

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


module.exports = {
  registerCandidate,
  loginCandidate,
  resendVerificationEmail
};