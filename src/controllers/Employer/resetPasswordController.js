const Employer = require('../../models/Employer/EmployerModel');
const { sendPasswordResetEmail } = require('../../utils/resetPasswordUtils');
const { generateResponse } = require('../../utils/responseUtils');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const employer = await Employer.findOne({ where: { email } });

    if (!employer) {
      return generateResponse(res, 404, 'Employer not found');
    }

    await sendPasswordResetEmail(employer, 'employer');

    return generateResponse(res, 200, 'Password reset email sent successfully');
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const employer = await Employer.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpiration: { [Op.gt]: new Date() }, // Using [Op.gt] for Sequelize's greater than operator
      },
    });

    if (!employer) {
      return generateResponse(res, 400, 'Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await employer.update({
      password: hashedPassword,
      passwordResetToken: null, // Update to clear password reset token fields
      resetTokenCreatedAt: null,
      passwordResetExpiration: null,
    });

    return generateResponse(res, 200, 'Password reset successful');
  } catch (error) {
    console.error('Error resetting password:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};


module.exports = {
  requestPasswordReset,
  resetPassword,
};
