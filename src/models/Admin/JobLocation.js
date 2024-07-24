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
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isHide: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: false,
});

module.exports = JobLocation;