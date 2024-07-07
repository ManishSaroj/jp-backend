const { DataTypes } = require('sequelize');
const { employerSequelize } = require('../../config/db.config');

const Employer = employerSequelize.define('Employer', {
  eid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  company_name: {
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
    allowNull: true,
  },
  termsAgreed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Changed default value to false
    validate: {
      termsAgreedCheck(value) { // Define the validation function
        if (!value) {
          throw new Error('Terms and conditions must be agreed to sign up.');
        }
      },
    },
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
  tokenExpiration: {
    type: DataTypes.DATE,
    allowNull: true,
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

module.exports = Employer;
