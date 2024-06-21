// CandidateProfileModel.js
const { DataTypes } = require('sequelize');
const { candidateSequelize } = require('../config/db.config');
const Candidate = require('./CandidateModel');

const CandidateProfile = candidateSequelize.define('CandidateProfile', {
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
  jobrole: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jobCategory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATEONLY, 
    allowNull: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  gender : {
    type: DataTypes.STRING,
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
  aboutme: {
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
  candidate_image: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  candidate_banner: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  resumeFileName : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  candidate_resume: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
}, {
  timestamps: false,
});

Candidate.hasOne(CandidateProfile, { foreignKey: 'cid' }); // One-to-One relationship
CandidateProfile.belongsTo(Candidate, { foreignKey: 'cid' }); // Required for bi-directional association

module.exports = CandidateProfile;