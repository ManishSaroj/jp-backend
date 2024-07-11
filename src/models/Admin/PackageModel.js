const { DataTypes } = require('sequelize');
const { adminSequelize } = require('../../config/db.config');

const PackageModel = adminSequelize.define('PackageModel', {
    packageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.ENUM('Free', 'Bronze', 'Silver', 'Platinum', 'Gold'),
        allowNull: false,
    },
    originalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discountedPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    companyProfiles: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    candidateProfileUnlocks: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    resumeDatabaseAccess: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    integrationWithOtherPlatforms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    jobPosting: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    searchAndFilters: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    analyticsAndReporting: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
});

module.exports = PackageModel;