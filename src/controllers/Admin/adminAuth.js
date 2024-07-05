const Admin = require('../../models/AdminModel');
const bcrypt = require('bcryptjs');
const { generateResponse } = require('../../utils/responseUtils');
const { generateToken, setTokenCookie } = require('../../utils/jwtUtils');

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return generateResponse(res, 404, 'Admin not found');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return generateResponse(res, 400, 'Invalid credentials');
    }

    // Generate JWT token for authentication
    const token = generateToken({
      id: admin.aid,
      role: 'admin',
    });
  
    // Set the token as a cookie
    setTokenCookie(res, token, true);

    generateResponse(res, 200, 'Admin logged in successfully', { admin: { aid: admin.aid, email: admin.email } });
  } catch (error) {
    console.error('Error logging in admin:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

module.exports = {
  loginAdmin,
};