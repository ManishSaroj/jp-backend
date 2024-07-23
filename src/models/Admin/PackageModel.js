
const { DataTypes } = require('sequelize');
const { adminSequelize } = require('../../config/db.config');

const PackageModel = adminSequelize.define('PackageModel', {
    packageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    packageName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    originalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    discountPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
    },
    discountedPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    durationType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // inclusion
    companyProfiles: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    candidateProfileUnlocks: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    resumeDatabaseAccess: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    integrationWithOtherPlatforms: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    jobPosting: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    searchAndFilters: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    analyticsAndReporting: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
}, {
    timestamps: false,
});

module.exports = PackageModel;