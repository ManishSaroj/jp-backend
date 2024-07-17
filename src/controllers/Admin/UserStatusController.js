const { AdminCandidateStatus, AdminEmployerStatus } = require('../../models/Admin/UserStatusModel');
const { generateResponse } = require('../../utils/responseUtils');

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
      await StatusModel.create({
        [`${userType}Id`]: userId,
        isActive: false,
        aid: aid,
      });
    } else {
      await StatusModel.destroy({ where: { [`${userType}Id`]: userId } });
    }

    const action = isDeactivating ? 'deactivated' : 'activated';
    generateResponse(res, 200, `${userType} ${action} successfully`);
  } catch (error) {
    console.error(`Error ${isDeactivating ? 'deactivating' : 'activating'} ${userType}:`, error);
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
};