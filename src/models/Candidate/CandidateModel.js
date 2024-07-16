const { DataTypes } = require('sequelize');
const { candidateSequelize } = require('../../config/db.config');

const Candidate = candidateSequelize.define('Candidate', {
  cid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  candidate_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,  // Validate that email field should be an email address
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
    defaultValue: false, // Set default value for termsAgreed to false
    validate: {
      termsAgreedCheck(value) { // Custom validation function for termsAgreed field
        if (!value) {
          throw new Error('Terms and conditions must be agreed to sign up.');
        }
      },
    },
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Set default value for emailVerified to false
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
  verificationAttempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0, // Default to 0 attempts
  },
  lastVerificationAttempt: {
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
  timestamps: true, // Enable timestamps (createdAt and updatedAt fields)
});

module.exports = Candidate;