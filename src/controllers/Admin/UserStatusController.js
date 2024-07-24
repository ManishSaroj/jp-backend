const { AdminCandidateStatus, AdminEmployerStatus } = require('../../models/Admin/UserStatusModel');
const { generateResponse } = require('../../utils/responseUtils');
const { sendStatusChangeEmail } = require('../../utils/statusEmail');
const  Candidate  = require('../../models/Candidate/CandidateModel');
const  Employer  = require('../../models/Employer/EmployerModel');

// Generic function to handle user status changes
const changeUserStatus = async (StatusModel, userId, isDeactivating, userType, req, res) => {
  try {
    const status = await StatusModel.findOne({ where: { [`${userType}Id`]: userId } });
    
    if (isDeactivating === !!status) {
      const action = isDeactivating ? 'deactivated' : 'activated';
      return generateResponse(res, 400, `${userType} is already ${action}`);
    }
    
    const aid = req.admin.id; // Get aid from the token
    
    if (!aid) {
      return generateResponse(res, 401, 'Admin ID not found. Please ensure you are logged in.');
    }
    
    if (isDeactivating) {
      if (status) {
        await status.update({ isDeactive: true });
      } else {
        await StatusModel.create({
          [`${userType}Id`]: userId,
          isDeactive: true,
          aid: aid,
        });
      }
    } else {
      if (status) {
        await status.destroy();
      }
    }
    
    const action = isDeactivating ? 'deactivated' : 'activated';

      // Fetch user details
      let user;
      if (userType === 'candidate') {
        user = await Candidate.findByPk(userId);
      } else if (userType === 'employer') {
        user = await Employer.findByPk(userId);
      }
      
      // Send status change email
      if (user) {
        await sendStatusChangeEmail(user, userType, action);
      }

    generateResponse(res, 200, `${userType} ${action} successfully`);
  } catch (error) {
    console.error(`Error ${isDeactivating ? 'deactivating' : 'activating'} ${userType}:`, error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Function to get candidate status
const getCandidateStatus = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const status = await AdminCandidateStatus.findOne({ where: { candidateId } });
    const isDeactive = status ? status.isDeactive : false;
    generateResponse(res, 200, `Candidate is currently ${isDeactive ? 'deactivated' : 'active'}`, { isDeactive });
  } catch (error) {
    console.error('Error fetching candidate status:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Controller to deactivate a candidate
const deactivateCandidate = async (req, res) => {
  await changeUserStatus(AdminCandidateStatus, req.params.candidateId, true, 'candidate', req, res);
};

// Controller to activate a candidate
const activateCandidate = async (req, res) => {
  await changeUserStatus(AdminCandidateStatus, req.params.candidateId, false, 'candidate', req, res);
};

// Function to get employer status
const getEmployerStatus = async (req, res) => {
  try {
    const employerId = req.params.employerId;
    const status = await AdminEmployerStatus.findOne({ where: { employerId } });
    const isDeactive = status ? status.isDeactive : false;
    generateResponse(res, 200, `Employer is currently ${isDeactive ? 'deactivated' : 'active'}`, { isDeactive });
  } catch (error) {
    console.error('Error fetching employer status:', error);
    generateResponse(res, 500, 'Server error', null, error.message);
  }
};

// Controller to deactivate an employer
const deactivateEmployer = async (req, res) => {
  await changeUserStatus(AdminEmployerStatus, req.params.employerId, true, 'employer', req, res);
};

// Controller to activate an employer
const activateEmployer = async (req, res) => {
  await changeUserStatus(AdminEmployerStatus, req.params.employerId, false, 'employer', req, res);
};

module.exports = {
  deactivateCandidate,
  activateCandidate,
  deactivateEmployer,
  activateEmployer,
  getCandidateStatus,
  getEmployerStatus,
};