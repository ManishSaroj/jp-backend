// models/FAQ.js
const { DataTypes } = require('sequelize');
const { adminSequelize } = require('../../config/db.config');

const FAQ = adminSequelize.define('FAQ', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  forWhom: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
});

module.exports = FAQ;