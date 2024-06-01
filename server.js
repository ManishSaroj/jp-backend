require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./src/config/db.config');
const employerRoutes = require('./src/routes/employerRoutes');
const candidateRoutes = require('./src/routes/candidateRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/employers', employerRoutes);
app.use('/api/candidates', candidateRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000; // Use the port defined in .env or default to 3000
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Employer endpoints: http://localhost:${PORT}/api/employers`);
      console.log(`Candidate endpoints: http://localhost:${PORT}/api/candidates`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });