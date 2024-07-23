const { DataTypes } = require('sequelize');
const { adminSequelize } = require('../../config/db.config');
const Admin = require('./AdminModel'); // Assuming Admin model is exported from './AdminModel'

// AdminCandidateStatus model
const AdminCandidateStatus = adminSequelize.define('AdminCandidateStatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  isDeactive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Default to deactive
  },
  aid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Admin,
      key: 'aid',
    },
  },
}, {
  timestamps: true, // Enable timestamps
});

// AdminEmployerStatus model
const AdminEmployerStatus = adminSequelize.define('AdminEmployerStatus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  isDeactive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Default to deactive
  },
  aid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Admin,
      key: 'aid',
    },
  },
}, {
  timestamps: true, // Enable timestamps
});

// Establishing associations
AdminCandidateStatus.belongsTo(Admin, { foreignKey: 'aid' });
AdminEmployerStatus.belongsTo(Admin, { foreignKey: 'aid' });

module.exports = {
  AdminCandidateStatus,
  AdminEmployerStatus,
};
