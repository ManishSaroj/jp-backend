const Admin = require('../../models/Admin/AdminModel');
const { sendPasswordResetEmail } = require('../../utils/adminResetPassword');
const { generateResponse } = require('../../utils/responseUtils');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return generateResponse(res, 404, 'Admin not found');
    }

    await sendPasswordResetEmail(admin, 'admin');

    return generateResponse(res, 200, 'Password reset email sent successfully');
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return generateResponse(res, 500, 'Server error', null, error.message);
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const admin = await Admin.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpiration: { [Op.gt]: new Date() },
      },
    });

    if (!admin) {
      return generateResponse(res, 400, 'Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await admin.update({
      password: hashedPassword,
      passwordResetToken: null,
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