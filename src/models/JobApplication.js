const { DataTypes } = require('sequelize');
const { employerSequelize } = require('../config/db.config');
const EmployerJobPost = require('./EmployerJobPost');
const EmployerProfile = require('./EmployerProfile');

const JobApplication = employerSequelize.define('JobApplication', {
  applicationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jobpostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EmployerJobPost,
      key: 'jobpostId',
    },
  },
  candidateProfileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  employerProfileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EmployerProfile,
      key: 'profileId',
    },
  },
  status: {
    type: DataTypes.ENUM('Applied', 'Under Review', 'Rejected', 'Accepted'),
    allowNull: false,
    defaultValue: 'Applied',
  },
  appliedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: employerSequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: employerSequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  timestamps: true,
});

// Define associations
JobApplication.belongsTo(EmployerJobPost, { foreignKey: 'jobpostId' });
JobApplication.belongsTo(EmployerProfile, { foreignKey: 'employerProfileId' });

module.exports = JobApplication;
