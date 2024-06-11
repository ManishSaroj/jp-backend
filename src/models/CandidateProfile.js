// CandidateProfileModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Candidate = require('./CandidateModel');

const CandidateProfile = sequelize.define('CandidateProfile', {
  profileId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate,
      key: 'cid',
    },
  },
  candidate_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  languages: {
    type: DataTypes.JSON, // Changed to DataTypes.JSON
    allowNull: true,
    defaultValue: "" // Set a default value
  },
  jobCategory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  currentSalary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expectedSalary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fullAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedIn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  github: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
});

Candidate.hasOne(CandidateProfile, { foreignKey: 'cid' }); // One-to-One relationship
CandidateProfile.belongsTo(Candidate, { foreignKey: 'cid' }); // Required for bi-directional association

module.exports = CandidateProfile;