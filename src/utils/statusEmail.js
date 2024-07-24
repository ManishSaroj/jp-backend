// File: utils/emailUtils.js

const transporter = require('../config/nodemailer.config');
const { generateActivationEmailTemplate, generateDeactivationEmailTemplate } = require('../emailTemplates/statusEmailTemplates');

const sendStatusChangeEmail = async (user, userType, status) => {
  try {
    let userName;
    if (userType === 'candidate') {
      userName = user.candidate_name;
    } else if (userType === 'employer') {
      userName = user.company_name;
    } else {
      throw new Error('Invalid user type');
    }

    const emailContent = status === 'activated' 
      ? generateActivationEmailTemplate(userName, userType)
      : generateDeactivationEmailTemplate(userName, userType);

    await transporter.sendMail({
      from: `"Aplakaam" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Aplakaam Account ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      html: emailContent,
    });

  } catch (error) {
    console.error('Error sending status change email:', error);
    throw new Error('Failed to send status change email');
  }
};

module.exports = {
  sendStatusChangeEmail,
};