const { DataTypes } = require('sequelize');
const { adminSequelize } = require('../../config/db.config');

const JobLocation = adminSequelize.define('JobLocation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  locationImage: {
    type: DataTypes.BLOB('long'),
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
  isHide: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: false,
});

module.exports = JobLocation;