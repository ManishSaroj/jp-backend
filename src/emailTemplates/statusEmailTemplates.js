// File: emailTemplates/statusEmailTemplates.js

const generateActivationEmailTemplate = (userName, userType) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f8f8; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); position: relative;">
          <h1 style="color: #007bff; text-align: center; margin-top: 20px;">Aplakaam Account Activated</h1>
          <p style="color: #333333; line-height: 1.6;">Dear ${userName},</p>
          <p style="color: #555555; line-height: 1.6;">We are pleased to inform you that your Aplakaam ${userType} account has been successfully activated.</p>
          <p style="color: #555555; line-height: 1.6;">What this means for you:</p>
          <ul style="color: #555555; line-height: 1.6;">
            <li>You now have full access to all Aplakaam features and services.</li>
            <li>You can log in to your account and start ${userType === 'candidate' ? 'searching for job opportunities' : 'posting job listings'}.</li>
            <li>Your profile is now visible to ${userType === 'candidate' ? 'potential employers' : 'potential candidates'}.</li>
          </ul>
          <p style="color: #555555; line-height: 1.6;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p style="color: #555555; line-height: 1.6;">Thank you for choosing Aplakaam. We look forward to helping you ${userType === 'candidate' ? 'find your dream job' : 'find the perfect candidates for your team'}!</p>
          <p style="color: #555555; line-height: 1.6;">Best regards,</p>
          <p style="color: #007bff; font-weight: bold;">The Aplakaam Team</p>
        </div>
      </div>
    `;
  };
  
  const generateDeactivationEmailTemplate = (userName, userType) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f8f8; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); position: relative;">
          <h1 style="color: #007bff; text-align: center; margin-top: 20px;">Aplakaam Account Deactivated</h1>
          <p style="color: #333333; line-height: 1.6;">Dear ${userName},</p>
          <p style="color: #555555; line-height: 1.6;">We regret to inform you that your Aplakaam ${userType} account has been deactivated.</p>
          <p style="color: #555555; line-height: 1.6;">What this means for you:</p>
          <ul style="color: #555555; line-height: 1.6;">
            <li>You will no longer be able to access your Aplakaam account or use our services.</li>
            <li>Your profile will not be visible to ${userType === 'candidate' ? 'potential employers' : 'potential candidates'}.</li>
            <li>${userType === 'candidate' ? 'Any active job applications' : 'Any active job postings'} will be suspended.</li>
          </ul>
          <p style="color: #555555; line-height: 1.6;">If you believe this deactivation is an error or if you wish to appeal this decision, please contact our support team immediately at support@aplakaam.com.</p>
          <p style="color: #555555; line-height: 1.6;">We appreciate your understanding and hope to resolve any issues promptly.</p>
          <p style="color: #555555; line-height: 1.6;">Best regards,</p>
          <p style="color: #007bff; font-weight: bold;">The Aplakaam Team</p>
        </div>
      </div>
    `;
  };
  
  module.exports = {
    generateActivationEmailTemplate,
    generateDeactivationEmailTemplate,
  };