const crypto = require('crypto');
const transporter = require('../config/nodemailer.config');
const { generateEmailTemplate } = require('../emailTemplates/resetPassword');

const sendPasswordResetEmail = async (user, userType) => {
  const passwordResetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetExpiration = Date.now() + 3600000; // 1 hour

  const resetLink = `${process.env.ADMIN_BASE_URL}/reset-password?token=${passwordResetToken}&email=${user.email}`;

  console.log(resetLink);

  try {
    let userName = user.email; // For admin, we'll use email as the name

    const emailContent = generateEmailTemplate(userName, resetLink, 'Reset Your Admin Password');

    await transporter.sendMail({
      from: `"Aplakaam" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Reset Your Aplakaam Admin Password',
      html: emailContent,
    });

    const now = new Date();
    await user.update({ passwordResetToken, passwordResetExpiration, resetTokenCreatedAt: now });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = {
  sendPasswordResetEmail,
};