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
  summary: {
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
  resumeId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: Resume,  // Reference to the Resume model
      key: 'resumeId',
    },
    onDelete: 'CASCADE',  // Deletes associated education entries when a resume is deleted
  },
  cid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate,
      key: 'cid',
    },
    onDelete: 'CASCADE',
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
  resumeId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: Resume,  // Reference to the Resume model
      key: 'resumeId',
    },
    onDelete: 'CASCADE',  // Deletes associated experience entries when a resume is deleted
  },
  cid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate,
      key: 'cid',
    },
    onDelete: 'CASCADE',
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
  expdescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: false,
});

// Project Model
const Project = sequelize.define('CandidateProject', {
  projectId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  cid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate,
      key: 'cid',
    },
    onDelete: 'CASCADE',
  },
  PName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Pdescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: false,
});

// Certification Model
const Certification = sequelize.define('CandidateCertification', {
  certificationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  cid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate,
      key: 'cid',
    },
    onDelete: 'CASCADE',
  },
  CName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  From: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Cdescription: {
    type: DataTypes.TEXT,
    allowNull: true,
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

Resume.hasMany(Project, { foreignKey: 'resumeId', onDelete: 'CASCADE' });
Project.belongsTo(Resume, { foreignKey: 'resumeId' });

Resume.hasMany(Certification, { foreignKey: 'resumeId', onDelete: 'CASCADE' });
Certification.belongsTo(Resume, { foreignKey: 'resumeId' });

module.exports = {
  Resume,
  Education,
  Experience,
  Project,
  Certification,
};