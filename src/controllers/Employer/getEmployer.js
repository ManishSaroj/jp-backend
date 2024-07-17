const { generateResponse } = require('../../utils/responseUtils');
const Employer = require('../../models/Employer/EmployerModel');
const bcrypt = require('bcryptjs');

// Controller method to get employer data
const getEmployer = async (req, res) => {
  try {
    // Extract employer ID from JWT token
    const employerId = req.user.id;

    // Fetch employer data using employerId
    const employer = await Employer.findByPk(employerId, {
      attributes: ['company_name', 'email']
    });

    if (!employer) {
      return generateResponse(res, 404, 'Employer not found');
    }

    // Send employer data to frontend
    generateResponse(res, 200, 'Employer data retrieved successfully', { employer });
  } catch (error) {
    console.error('Error fetching employer data:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Controller method to change employer's password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const employerId = req.user.id;

    // Fetch employer data using employerId
    const employer = await Employer.findOne({ where: { eid: employerId } });

    if (!employer) {
      return generateResponse(res, 404, 'Employer not found');
    }

    // Debugging: Log the employer's stored password
    console.log(`Stored password hash: ${employer.password}`);

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, employer.password);

    // Debugging: Log the result of the password comparison
    console.log(`Is old password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      return generateResponse(res, 400, 'Old password is incorrect');
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Debugging: Log the new hashed password
    console.log(`New password hash: ${hashedNewPassword}`);

    // Update employer's password in the database
    await employer.update({ password: hashedNewPassword });

    generateResponse(res, 200, 'Password updated successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};


module.exports = {
  getEmployer,
  changePassword,
};