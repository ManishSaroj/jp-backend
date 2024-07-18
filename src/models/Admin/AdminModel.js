const { DataTypes } = require('sequelize');
const { adminSequelize } = require('../../config/db.config');

const Admin = adminSequelize.define('Admin', {
  aid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetTokenCreatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  passwordResetExpiration: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: false,
});

module.exports = Admin;