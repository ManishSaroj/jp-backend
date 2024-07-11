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
    discountPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
    },
    discountedPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    durationType: {
        type: DataTypes.ENUM('days', 'months', 'years'),
        allowNull: false,
        defaultValue: 'days',
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
}, {
    hooks: {
        beforeCreate: (package) => {
            package.discountedPrice = package.originalPrice * (1 - package.discountPercentage / 100);
        },
        beforeUpdate: (package) => {
            package.discountedPrice = package.originalPrice * (1 - package.discountPercentage / 100);
        }
    }
});

module.exports = PackageModel;
