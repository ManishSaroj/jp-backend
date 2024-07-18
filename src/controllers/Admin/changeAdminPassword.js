const Admin = require('../../models/Admin/AdminModel');
const bcrypt = require('bcryptjs');
const { generateResponse } = require('../../utils/responseUtils');

const changeAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.admin.id; // Assuming the admin's ID is available in the request after authentication

  try {
    // Find the admin by ID
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return generateResponse(res, 404, 'Admin not found');
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return generateResponse(res, 400, 'Current password is incorrect');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the admin's password
    await admin.update({ password: hashedPassword });

    generateResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    console.error('Error changing admin password:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

module.exports = {
  changeAdminPassword,
};