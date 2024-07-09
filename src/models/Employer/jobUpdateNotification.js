const { DataTypes } = require('sequelize');
const { employerSequelize } = require('../../config/db.config'); 

const CandidateNotification = employerSequelize.define('CandidateNotification', {
    notificationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    profileId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    applicationId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    jobpostId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    jobTitle: { 
       type: DataTypes.STRING,
       allowNull: true,
    },
    notificationType: {
        type: DataTypes.ENUM,
        values: ['Applied', 'Shortlisted', 'Rejected', 'Hired', 'HiredThenRejected'],
        allowNull: true
    },
    messageKey: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'CandidateNotifications',
    timestamps: false
});

module.exports = CandidateNotification;
