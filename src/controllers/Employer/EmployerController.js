const Employer = require('../../models/Employer/EmployerModel');
const EmployerProfile = require('../../models/Employer/EmployerProfile');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail } = require('../../utils/verifyEmailUtils');
const { generateResponse } = require('../../utils/responseUtils');
const { generateToken, setTokenCookie } = require('../../utils/jwtUtils');
const { AdminEmployerStatus } = require('../../models/Admin/UserStatusModel');

const registerEmployer = async (req, res) => {
  const { company_name, email, password, phone_number, terms_agreed } = req.body;

  try {
    const existingEmployer = await Employer.findOne({ where: { email } });
    if (existingEmployer) {
      return generateResponse(res, 400, 'Employer already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployer = await Employer.create({
      company_name,
      email,
      password: hashedPassword,
      phone_number,
      termsAgreed: terms_agreed,
      emailVerified: false, // Add this line to set emailVerified to false initially
    });

    // Create a new EmployerProfile record
    const employerProfile = await EmployerProfile.create({
      eid: newEmployer.eid,
      email,
      company_name,
      phone_number,
    });

    await sendVerificationEmail(newEmployer, 'employer');

    generateResponse(res, 201, 'Employer registered successfully. Verification email sent.', { employer: newEmployer });
  } catch (error) {
    console.error('Error registering employer:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const loginEmployer = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  try {
    const employer = await Employer.findOne({ where: { email } });
    if (!employer) {
      return generateResponse(res, 404, 'Employer not found');
    }

    if (!employer.emailVerified) {
      return generateResponse(res, 403, 'Email not verified. Please verify your email before logging in.');
    }

     // Check if the employer is deactivated
     const status = await AdminEmployerStatus.findOne({ where: { employerId: employer.eid } });
     if (status && status.isDeactive) {
      return generateResponse(res, 423, 'Your Aplakaam account has been deactivated. Please contact Aplakaam support for assistance in reactivating your account.');
    }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return generateResponse(res, 400, 'Invalid credentials');
    }

    // jwt cookie token for check auth
    const token = generateToken({
      id: employer.eid,
      role: 'employer',
    }, rememberMe);

    setTokenCookie(res, token, rememberMe);

    generateResponse(res, 200, 'Employer logged in successfully', { employer });
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

    // Check the rate limit for resending verification emails
    const thirtyMinutesAgo = new Date(new Date() - 30 * 60 * 1000); // 30 minutes ago
    if (employer.verificationAttempts >= 5 && employer.lastVerificationAttempt > thirtyMinutesAgo) {
      return generateResponse(res, 429, 'Too many requests. Please try again after 30 minutes.');
    }

    // Update the employer's verification attempts and last verification attempt
    if (employer.lastVerificationAttempt <= thirtyMinutesAgo) {
      employer.verificationAttempts = 1; // Reset attempts after 30 minutes
    } else {
      employer.verificationAttempts += 1;
    }
    employer.lastVerificationAttempt = new Date();
    await employer.save();


    await sendVerificationEmail(employer, 'employer');

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