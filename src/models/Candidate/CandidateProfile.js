// CandidateProfileModel.js
const { DataTypes } = require('sequelize');
const { candidateSequelize } = require('../../config/db.config');
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
      model: Candidate, // Reference to the Candidate model
      key: 'cid',
    },
  },
  candidate_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
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
    type: DataTypes.JSON, 
    allowNull: true,
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
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
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
  skills: {
    type: DataTypes.JSON,
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
  facebook: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twitter: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  behance: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dribbble: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  candidate_image: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  resumeFileName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  candidate_resume: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  lookingForJobs: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Default value can be true or false based on your requirement
  },
}, {
  timestamps: true,
});

// Define the one-to-one relationship between Candidate and CandidateProfile
Candidate.hasOne(CandidateProfile, { foreignKey: 'cid' }); 
CandidateProfile.belongsTo(Candidate, { foreignKey: 'cid' }); 

module.exports = CandidateProfile;