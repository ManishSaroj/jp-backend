// server.js 

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const sequelize = require('./src/config/db.config');
const employerRoutes = require('./src/routes/employerRoutes');
const candidateRoutes = require('./src/routes/candidateRoutes');
const authRoutes = require('./src/routes/authRoutes'); 
const logoutRoutes = require('./src/routes/logoutRoutes');


const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_BASE_URL, 
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api/employers', employerRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logout', logoutRoutes); 


// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000; // Use the port defined in .env or default to 3000
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Employer endpoints: ${BASE_URL}/api/employers`);
      console.log(`Candidate endpoints: ${BASE_URL}/api/candidates`);
      console.log(`Authentication endpoints: ${BASE_URL}/api/auth`);
      console.log(`Logout endpoint: ${BASE_URL}/api/logout`);
      console.log(`Candidate Profile endpoint: ${BASE_URL}/api/candidates/profile`);
      console.log(`Candidate Resume endpoints: ${BASE_URL}/api/candidates/resumes`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });