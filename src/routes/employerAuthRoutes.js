// // backend/src/routes/authRoutes.js

// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const Employer = require('../models/EmployerModel');
// const Candidate = require('../models/CandidateModel');

// // Route for employer registration
// router.post('/register/employer', async (req, res) => {
//   try {
//     const { username, email, password, company_name } = req.body;

//     // Check if email is already registered
//     const existingUser = await Employer.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(password, salt);

//     // Create new employer
//     const newEmployer = await Employer.create({
//       username,
//       email,
//       password_hash: passwordHash,
//       company_name
//     });

//     res.status(201).json(newEmployer);
//   } catch (error) {
//     console.error('Error registering employer:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // // Route for candidate registration
// // router.post('/register/candidate', async (req, res) => {
// //   try {
// //     const { username, email, password, full_name } = req.body;

// //     // Check if email is already registered
// //     const existingUser = await Candidate.findOne({ where: { email } });
// //     if (existingUser) {
// //       return res.status(400).json({ message: 'Email already registered' });
// //     }

// //     // Hash the password
// //     const salt = await bcrypt.genSalt(10);
// //     const passwordHash = await bcrypt.hash(password, salt);

// //     // Create new candidate
// //     const newCandidate = await Candidate.create({
// //       username,
// //       email,
// //       password_hash: passwordHash,
// //       full_name
// //     });

// //     res.status(201).json(newCandidate);
// //   } catch (error) {
// //     console.error('Error registering candidate:', error);
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // });

// module.exports = router;