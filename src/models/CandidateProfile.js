const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Candidate = require('./CandidateModel');

const CandidateProfile = sequelize.define('CandidateProfile', {
  profileId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Candidate,
      key: 'email',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobCategory: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: false,
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
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postcode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twitter: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedIn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  whatsapp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pinterest: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tumblr: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  youtube: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
});

// Define the association
Candidate.hasOne(CandidateProfile, { foreignKey: 'email' });
CandidateProfile.belongsTo(Candidate, { foreignKey: 'email' });

module.exports = CandidateProfile;