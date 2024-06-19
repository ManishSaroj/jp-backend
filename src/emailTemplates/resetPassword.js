const generateEmailTemplate = (userName, resetLink, subject = 'Reset Your Password') => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f8f8; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); position: relative;">
          <h1 style="color: #007bff; text-align: center; margin-top: 20px;">${subject}</h1>
          <p style="color: #333333; line-height: 1.6;">Hello ${userName},</p>
          <p style="color: #555555; line-height: 1.6;">You recently requested to reset your password for your Aplakaam account. To complete the process, please click the button below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background: linear-gradient(to right, #4d94ff, #007bff); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #555555; line-height: 1.6;"><strong>Note:</strong> This reset link will expire in 1 hour for security reasons. If you did not request a password reset, you can safely ignore this email.</p>
          <p style="color: #555555; line-height: 1.6;">Thank you for using Aplakaam.</p>
          <p style="color: #555555; line-height: 1.6;">Best regards,</p>
          <p style="color: #007bff; font-weight: bold;">The Aplakaam Team</p>
          <hr style="border: none; border-top: 2px solid #4d94ff; margin: 30px 0;">
          <div style="text-align: center;">
            <p style="color: #007bff; font-weight: bold; margin-bottom: 10px;">Stay Connected</p>
            <a href="#" style="margin-right: 10px;"><img src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Facebook_colored_svg_copy-512.png" alt="Facebook" style="width: 30px; height: 30px;"></a>
            <a href="#" style="margin-right: 10px;"><img src="https://cdn1.iconfinder.com/data/icons/social-circle-3/32/instagram_circle-512.png" alt="Instagram" style="width: 30px; height: 30px;"></a>
            <a href="#"><img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png" alt="LinkedIn" style="width: 30px; height: 30px;"></a>
          </div>
        </div>
      </div>
    `;
  };
  
  module.exports = {
    generateEmailTemplate,
  };