const { DataTypes } = require('sequelize');
const { employerSequelize } = require('../config/db.config');
const EmployerProfile = require('./EmployerProfile');

const SavedCandidate = employerSequelize.define('SavedCandidate', {
    savedId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    employerProfileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: EmployerProfile,
            key: 'profileId',
        },
    },
    candidateProfileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    savedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: employerSequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    timestamps: false,
});

// Define associations
EmployerProfile.hasMany(SavedCandidate, { foreignKey: 'employerProfileId' });
SavedCandidate.belongsTo(EmployerProfile, { foreignKey: 'employerProfileId' });

module.exports = SavedCandidate;
