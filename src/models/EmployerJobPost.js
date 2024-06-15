const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Employer = require('./EmployerModel');

const EmployerJobPost = sequelize.define('EmployerJobPost', {
    jobpostId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    eid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employer,
            key: 'eid',
        },
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jobCategory: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jobType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    minSalary: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maxSalary: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    experience: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    qualification: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estSince: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    completeAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    skills: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    jobReq: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    jobRes: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
}, {
    timestamps: false,
});

Employer.hasMany(EmployerJobPost, { foreignKey: 'eid' });
EmployerJobPost.belongsTo(Employer, { foreignKey: 'eid' });

module.exports = EmployerJobPost;
