const Employer = require('../models/EmployerModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const transporter = require('../config/nodemailer.config');
const { Op } = require('sequelize');
const { employerVerificationEmail } = require('../emailTemplates/employerVerify'); 

const generateResponse = (res, status, message, data = null, error = null) => {
  res.status(status).json({ message, data, error, success: status >= 200 && status < 300 });
};

const sendVerificationEmail = async (employer) => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiration = new Date(Date.now() + 5 * 60 * 1000); // Token expires in 5 minutes
  const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}&userType=employer`;

  try {
    const emailContent = employerVerificationEmail(employer.companyName, verificationLink); // Get the email template

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
    // Handle error
  }
};

const registerEmployer = async (req, res) => {
  const { username, email, password, phone_number } = req.body;

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

    // if (!employer.emailVerified) {
    //   return generateResponse(res, 403, 'Email not verified. Please verify your email before logging in.');
    // }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return generateResponse(res, 400, 'Invalid credentials');
    }

    generateResponse(res, 200, 'Employer logged in successfully', { employer });
  } catch (error) {
    console.error('Error logging in employer:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const employer = await employer.findOne({ where: { email } });
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


module.exports = {
  registerEmployer,
  loginEmployer,
  resendVerificationEmail
};