const Employer = require('../../models/EmployerModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const transporter = require('../../config/nodemailer.config');
const { employerVerificationEmail } = require('../../emailTemplates/employerVerify'); 
const { generateResponse } = require('../../utils/responseUtils')

const sendVerificationEmail = async (employer) => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiration = new Date(Date.now() + 5 * 60 * 1000); // Token expires in 5 minutes
  const verificationLink = `${process.env.FRONTEND_BASE_URL}/verify-email?token=${verificationToken}&email=${employer.email}&userType=employer`;
  console.log(verificationLink);

  try {
    const emailContent = employerVerificationEmail(employer.username, verificationLink); // Get the email template

    await transporter.sendMail({
      from: `"Aplakaam" <${process.env.EMAIL_USER}>`,
      to: employer.email,
      subject: 'Welcome to Aplakaam - Verify Your Email Address',
      html: emailContent, // Use the email template content
    });

    // Update the employer's verification token and token expiration in the database
    await employer.update({ verificationToken, tokenExpiration });

  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

const registerEmployer = async (req, res) => {
  const { username, email, password, phone_number, terms_agreed } = req.body;

  try {
    const existingEmployer = await Employer.findOne({ where: { email } });
    if (existingEmployer) {
      return generateResponse(res, 400, 'Employer already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployer = await Employer.create({
      username,
      email,
      password: hashedPassword,
      phone_number,
      termsAgreed: terms_agreed, 
      emailVerified: false, // Add this line to set emailVerified to false initially
    });

    await sendVerificationEmail(newEmployer);

    generateResponse(res, 201, 'Employer registered successfully. Verification email sent.', { employer: newEmployer });
  } catch (error) {
    console.error('Error registering employer:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const loginEmployer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const employer = await Employer.findOne({ where: { email } });
    if (!employer) {
      return generateResponse(res, 404, 'Employer not found');
    }

    if (!employer.emailVerified) {
      return generateResponse(res, 403, 'Email not verified. Please verify your email before logging in.');
    }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return generateResponse(res, 400, 'Invalid credentials');
    }

    const token = jwt.sign({ id: employer.eid }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    generateResponse(res, 200, 'Employer logged in successfully', { employer, token });
  } catch (error) {
    console.error('Error logging in employer:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const employer = await Employer.findOne({ where: { email } });
    if (!employer) {
      return generateResponse(res, 404, 'Employer not found');
    }

    if (employer.emailVerified) {
      return generateResponse(res, 400, 'Email already verified');
    }

    await sendVerificationEmail(employer);

    generateResponse(res, 200, 'Verification email resent successfully');
  } catch (error) {
    console.error('Error resending verification email:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const verifyEmployerEmail = async (req, res) => {
  const { token, email } = req.query;

  try {
    // First, find the employer by email
    const employer = await Employer.findOne({ where: { email } });

    if (!employer) {
      return generateResponse(res, 404, 'Employer not found');
    }

    // If the email is already verified, return a relevant message
    if (employer.emailVerified) {
      return generateResponse(res, 200, 'Email already verified');
    }

    // If a token is provided, verify it
    if (token) {
      // Check if the token matches and is not expired
      if (employer.verificationToken === token && new Date(employer.tokenExpiration) > new Date()) {
        await employer.update({
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
  registerEmployer,
  loginEmployer,
  resendVerificationEmail,
  verifyEmployerEmail
};