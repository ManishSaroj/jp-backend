const { DataTypes } = require('sequelize');
const { adminSequelize } = require('../../config/db.config');

const ManageAds = adminSequelize.define('ManageAds', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  placementName: {
    type: DataTypes.STRING,
    allowNull: false,  // Changed to false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,  // Changed to false
  },
  durationType: {
    type: DataTypes.STRING,
    allowNull: false,  // Changed to false
  },
}, {
  timestamps: false,
});

module.exports = ManageAds;