const { DataTypes } = require('sequelize');
const { adminSequelize } = require('../../config/db.config');
const Admin = require('./AdminModel');

const AdminProfile = adminSequelize.define('AdminProfile', {
  profileId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  aid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Admin,
      key: 'aid',
    },
  },
  jobCategory: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  jobType: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
});

AdminProfile.belongsTo(Admin, { foreignKey: 'aid' });

module.exports = AdminProfile;
