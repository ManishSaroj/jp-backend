const { DataTypes } = require('sequelize');
const { employerSequelize } = require('../../config/db.config'); 

const Notification = employerSequelize.define('Notification', {
    notificationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    profileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    notificationType: {
        type: DataTypes.ENUM,
        values: ['Applied', 'UnderReview', 'Shortlisted', 'Rejected', 'Hired', 'HiredThenRejected'],
        allowNull: false
    },
    messageKey: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
    tableName: 'Notifications',
    timestamps: false
});

module.exports = Notification;
