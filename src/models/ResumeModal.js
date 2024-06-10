const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Candidate = require('./CandidateModel');

// Resume Model
const Resume = sequelize.define('CandidateResume', {
  resumeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate,  // Reference to the Candidate model
      key: 'cid',
    },
    onDelete: 'CASCADE',  // Deletes associated resumes when a candidate is deleted
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  workingAs: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  linkedIn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gitHub: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  skills: {
    type: DataTypes.JSON, // Using JSONB for better performance and indexing
    allowNull: true,
  },
}, {
  timestamps: false,
});


// Education Model
const Education = sequelize.define('CandidateEducation', {
  educationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institution: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  graduationStartYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  graduationEndYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  score: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resumeId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: Resume,  // Reference to the Resume model
      key: 'resumeId',
    },
    onDelete: 'CASCADE',  // Deletes associated education entries when a resume is deleted
  },
}, {
  timestamps: false,
});

// Experience Model
const Experience = sequelize.define('CandidateExperience', {
  experienceId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resumeId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: Resume,  // Reference to the Resume model
      key: 'resumeId',
    },
    onDelete: 'CASCADE',  // Deletes associated experience entries when a resume is deleted
  },
}, {
  timestamps: false,
});

// Setting up Associations
Candidate.hasMany(Resume, { foreignKey: 'cid', onDelete: 'CASCADE' });
Resume.belongsTo(Candidate, { foreignKey: 'cid' });

Resume.hasMany(Education, { foreignKey: 'resumeId', onDelete: 'CASCADE' });
Education.belongsTo(Resume, { foreignKey: 'resumeId' });

Resume.hasMany(Experience, { foreignKey: 'resumeId', onDelete: 'CASCADE' });
Experience.belongsTo(Resume, { foreignKey: 'resumeId' });

module.exports = {
  Resume,
  Education,
  Experience,
};