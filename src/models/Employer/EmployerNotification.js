const { DataTypes } = require('sequelize');
const { employerSequelize } = require('../../config/db.config'); 
const { application } = require('express');

const EmployerNotification = employerSequelize.define('EmployerNotification', {
    notificationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    profileId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    applicationId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    eid: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    jobpostId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    candidateId: {
        type: DataTypes.INTEGER, // candidate profileId
        allowNull: true
    },
    jobTitle: { 
        type: DataTypes.STRING,
        allowNull: true,
     },
    notificationType: {
        type: DataTypes.ENUM,
        values: ['NewApplication'],
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
    tableName: 'EmployerNotifications',
    timestamps: false
});

module.exports = EmployerNotification;
