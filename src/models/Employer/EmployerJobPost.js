const { DataTypes } = require('sequelize');
const { employerSequelize } = require('../../config/db.config');
const Employer = require('./EmployerModel');
const EmployerProfile = require('./EmployerProfile');

const EmployerJobPost = employerSequelize.define('EmployerJobPost', {
    jobpostId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    eid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Employer,
            key: 'eid',
        },
    },
    appliedCandidatesCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    shortlistedCandidatesCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    jobCategory: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    jobType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    minSalary: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    maxSalary: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    salaryFrequency: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    totalOpenings: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    experience: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    qualification: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    jobAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    skills: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    jobReq: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    jobRes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: employerSequelize.literal('CURRENT_TIMESTAMP'), 
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: employerSequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    timestamps: true,
});

Employer.hasMany(EmployerJobPost, { foreignKey: 'eid' });
EmployerJobPost.belongsTo(Employer, { foreignKey: 'eid' });
EmployerJobPost.belongsTo(EmployerProfile, { foreignKey: 'eid' });

module.exports = EmployerJobPost;
