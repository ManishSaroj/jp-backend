const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a new Sequelize instance for the admin database
const adminSequelize = new Sequelize(
  process.env.ADMIN_DB_NAME,
  process.env.ADMIN_DB_USER,
  process.env.ADMIN_DB_PASSWORD,
  {
    host: process.env.ADMIN_DB_HOST,
    dialect: process.env.ADMIN_DB_DIALECT,
    logging: false // Disable logging by default, you can set it to true for debugging
  }
);

// Test the admin database connection
async function testAdminDatabaseConnection() {
  try {
    await adminSequelize.authenticate();
    console.log('Admin database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the admin database:', error);
  }
}

// Create a new Sequelize instance for the candidate database
const candidateSequelize = new Sequelize(
  process.env.CANDIDATE_DB_NAME,
  process.env.CANDIDATE_DB_USER,
  process.env.CANDIDATE_DB_PASSWORD,
  {
    host: process.env.CANDIDATE_DB_HOST,
    dialect: process.env.CANDIDATE_DB_DIALECT,
    logging: false // Disable logging by default, you can set it to true for debugging
  }
);

// Create a new Sequelize instance for the employer database
const employerSequelize = new Sequelize(
  process.env.EMPLOYER_DB_NAME,
  process.env.EMPLOYER_DB_USER,
  process.env.EMPLOYER_DB_PASSWORD,
  {
    host: process.env.EMPLOYER_DB_HOST,
    dialect: process.env.EMPLOYER_DB_DIALECT,
    logging: false // Disable logging by default, you can set it to true for debugging
  }
);

// Test the candidate database connection
async function testCandidateDatabaseConnection() {
  try {
    await candidateSequelize.authenticate();
    console.log('Candidate database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the candidate database:', error);
  }
}

// Test the employer database connection
async function testEmployerDatabaseConnection() {
  try {
    await employerSequelize.authenticate();
    console.log('Employer database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the employer database:', error);
  }
}

// Call the functions to test the database connections
testAdminDatabaseConnection();
testCandidateDatabaseConnection();
testEmployerDatabaseConnection();

// Export the Sequelize instances
module.exports = {
  adminSequelize,
  candidateSequelize,
  employerSequelize
};
