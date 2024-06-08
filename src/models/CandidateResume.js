// resume.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Candidate = require('./candidate.model');
const CandidateProfile = require('./CandidateProfileModel');

const Resume = sequelize.define('Resume', {
  resumeId: {
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
  profileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CandidateProfile,
      key: 'profileId',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  workingAs: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  linkedIn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gitHub: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  skills: {
    type: DataTypes.JSONB, 
    allowNull: true,
  },
});


const Education = sequelize.define('Education', {
  degree: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  graduationStartYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  graduationEndYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  score: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Experience = sequelize.define('Experience', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define associations
Resume.hasMany(Education, { foreignKey: 'resumeId' }); // A resume can have multiple educations
Education.belongsTo(Resume, { foreignKey: 'resumeId' }); // An education belongs to one resume

Resume.hasMany(Experience, { foreignKey: 'resumeId' }); // A resume can have multiple experiences
Experience.belongsTo(Resume, { foreignKey: 'resumeId' }); // An experience belongs to one resume

Resume.belongsTo(CandidateProfile, { foreignKey: 'profileId' }); // A resume belongs to one candidate profile
CandidateProfile.hasMany(Resume, { foreignKey: 'profileId' }); // A candidate profile can have multiple resumes

module.exports = {
  Resume,
  Education,
  Experience
};
