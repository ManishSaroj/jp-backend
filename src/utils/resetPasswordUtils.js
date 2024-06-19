const crypto = require('crypto');
const transporter = require('../config/nodemailer.config');
const { generateEmailTemplate } = require('../emailTemplates/resetPassword');

const sendPasswordResetEmail = async (user, userType) => {
   const passwordResetToken = crypto.randomBytes(32).toString('hex');
   const passwordResetExpiration = Date.now() + 3600000; // 1 hour
   const resetLink = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${passwordResetToken}&email=${user.email}&userType=${userType}`;
   console.log(resetLink);

   try {
       let userName;
       if (userType === 'candidate') {
           userName = user.candidate_name;
       } else if (userType === 'employer') {
           userName = user.company_name;
       } else {
           throw new Error('Invalid user type');
       }

       const emailContent = generateEmailTemplate(userName, resetLink);
       await transporter.sendMail({
           from: `"Aplakaam" <${process.env.EMAIL_USER}>`,
           to: user.email,
           subject: 'Reset Your Aplakaam Password',
           html: emailContent,
       });

        // Update the user's reset token, token expiration, and token created date in the database
        const now = new Date(); // Get the current date and time
        await user.update({ passwordResetToken, passwordResetExpiration, resetTokenCreatedAt: now });
   } catch (error) {
       console.error('Error sending password reset email:', error);
       throw new Error('Failed to send password reset email');
   }
};

module.exports = {
   sendPasswordResetEmail,
};