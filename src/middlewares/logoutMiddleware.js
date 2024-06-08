// Import the necessary modules
const express = require('express');

// Create an instance of the Express application
const app = express();

// Logout route
app.post('/logout', (req, res) => {
  // Clear the JWT cookie by setting its expiration date to a past date
  res.clearCookie('sessionToken');
  // Optionally, you can also send a response indicating successful logout
  res.status(200).json({ message: 'Logout successful' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
