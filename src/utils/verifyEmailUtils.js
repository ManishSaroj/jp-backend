const crypto = require('crypto');
const transporter = require('../config/nodemailer.config');
const { generateEmailTemplate } = require('../emailTemplates/emailTemplates');

// Function to send a verification email to the candidate and employer
const sendVerificationEmail = async (user, userType) => {
  const verificationToken = crypto.randomBytes(32).toString('hex'); // Generate a random verification token
  const tokenExpiration = new Date(Date.now() + 5 * 60 * 1000); // Token expires in 5 minutes
  const verificationLink = `${process.env.FRONTEND_BASE_URL}/verify-email?token=${verificationToken}&email=${user.email}&userType=${userType}`;

  try {
    let userName;
    if (userType === 'candidate') {
      userName = user.candidate_name;
    } else if (userType === 'employer') {
      userName = user.company_name;
    } else {
      throw new Error('Invalid user type');
    }

    // Generate the HTML content of the email using a template
    const emailContent = generateEmailTemplate(userName, verificationLink);

     // Send the email using Nodemailer transporter
    await transporter.sendMail({
      from: `"Aplakaam" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to Aplakaam - Verify Your Email Address',
      html: emailContent,
    });

    // Update the user's verification token and token expiration in the database
    await user.update({ verificationToken, tokenExpiration });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  sendVerificationEmail,
};