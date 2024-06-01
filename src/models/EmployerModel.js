// models/EmployerModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Employer = sequelize.define('Employer', {
  eid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tokenCreatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: false,
});

module.exports = Employer;