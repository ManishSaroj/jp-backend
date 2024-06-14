const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Employer = require('./EmployerModel');

const EmployerProfile = sequelize.define('EmployerProfile', {
  profileId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employer,
      key: 'eid',
    },
  },
  company_name: {
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
  company_website: {
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
  full_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  linkedin: {
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

Employer.hasOne(EmployerProfile, { foreignKey: 'eid' }); // One-to-One relationship
EmployerProfile.belongsTo(Employer, { foreignKey: 'eid' }); // Required for bi-directional association

module.exports = EmployerProfile;