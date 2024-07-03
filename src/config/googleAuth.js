// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// // const { google } = require('googleapis');
// const Candidate = require('../models/CandidateModel');
// const CandidateProfile = require('../models/CandidateProfile');
// const axios = require('axios');

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: `${process.env.BASE_URL}/api/candidates/auth/google/callback`
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const email = profile.emails[0].value;
//       let candidate = await Candidate.findOne({ where: { email } });

//       if (!candidate) {
//         candidate = await Candidate.create({
//           candidate_name: profile.displayName,
//           email: email,
//           termsAgreed: true,
//           emailVerified: true,
//           password: '' // You might want to handle this differently
//         });

//           // Prepare candidate profile data
//         const profileData = {
//             cid: candidate.cid,
//             candidate_name: profile.displayName,
//             email: email,
//             lookingForJobs: false // Set a default value
//           };
  
//           // Get profile image if available
//           if (profile.photos && profile.photos[0] && profile.photos[0].value) {
//             try {
//               const imageResponse = await axios.get(profile.photos[0].value, { responseType: 'arraybuffer' });
//               profileData.candidate_image = imageResponse.data; // Store the raw binary data
//             } catch (imageError) {
//               console.error('Error fetching profile image:', imageError);
//               // If there's an error fetching the image, we'll just continue without it
//             }
//           }
  
//           // Create associated CandidateProfile
//           await CandidateProfile.create(profileData);
//         }

//       return done(null, candidate);
//     } catch (error) {
//       return done(error);
//     }
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user.cid);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await Candidate.findByPk(id);
//     done(null, user);
//   } catch (error) {
//     done(error);
//   }
// });