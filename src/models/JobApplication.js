// const { DataTypes } = require('sequelize');
// const { employerSequelize } = require('../config/db.config');
// const EmployerJobPost = require('./EmployerJobPost');
// const EmployerProfile = require('./EmployerProfile');

// const JobApplication = employerSequelize.define('JobApplication', {
//   applicationId: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   jobpostId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: EmployerJobPost,
//       key: 'jobpostId',
//     },
//   },
//   candidateProfileId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   employerProfileId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: EmployerProfile,
//       key: 'profileId',
//     },
//   },
//   status: {
//     type: DataTypes.ENUM('Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'),
//     allowNull: false,
//     defaultValue: 'Applied',
//   },
//   appliedDate: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: employerSequelize.literal('CURRENT_TIMESTAMP'),
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: employerSequelize.literal('CURRENT_TIMESTAMP'),
//   },
// }, {
//   timestamps: true,
// });

// // Define associations
// JobApplication.belongsTo(EmployerJobPost, { foreignKey: 'jobpostId'});
// JobApplication.belongsTo(EmployerProfile, { foreignKey: 'employerProfileId' });

// module.exports = JobApplication;

const { DataTypes } = require('sequelize');
const { employerSequelize } = require('../config/db.config');
const EmployerJobPost = require('./EmployerJobPost');
const EmployerProfile = require('./EmployerProfile');

const JobApplication = employerSequelize.define('JobApplication', {
  applicationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jobpostId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EmployerJobPost,
      key: 'jobpostId',
    },
  },
  candidateProfileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  employerProfileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EmployerProfile,
      key: 'profileId',
    },
  },
  isApplied: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  isUnderReview: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isShortlisted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isRejected: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isHired: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  status: {
    type: DataTypes.VIRTUAL,
    get() {
      if (this.isHired) return 'Hired';
      if (this.isRejected) return 'Rejected';
      if (this.isShortlisted) return 'Shortlisted';
      if (this.isUnderReview) return 'Under Review';
      if (this.isApplied) return 'Applied';
      return 'Applied';
    },
  },
  appliedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

// Add hooks to enforce constraints
JobApplication.addHook('beforeSave', (jobApplication) => {
  if (jobApplication.isHired) {
    jobApplication.isRejected = false;
  } else if (jobApplication.isRejected) {
    jobApplication.isHired = false;
  }
});

// Define associations
JobApplication.belongsTo(EmployerJobPost, { foreignKey: 'jobpostId' });
JobApplication.belongsTo(EmployerProfile, { foreignKey: 'employerProfileId' });

module.exports = JobApplication;