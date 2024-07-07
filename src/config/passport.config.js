const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const axios = require('axios');

const Candidate = require('../models/Candidate/CandidateModel');
const CandidateProfile = require('../models/Candidate/CandidateProfile');
const Employer = require('../models/Employer/EmployerModel');
const EmployerProfile = require('../models/Employer/EmployerProfile');

const handleGoogleCallback = async (accessToken, refreshToken, profile, done, UserModel, ProfileModel, userKey, profileKey) => {
  try {
    const email = profile.emails[0].value;
    let user = await UserModel.findOne({ where: { email } });

    if (!user) {
      user = await UserModel.create({
        [userKey]: profile.displayName,
        email: email,
        termsAgreed: true,
        emailVerified: true,
        password: '' // You might want to handle this differently
      });

      const profileData = {
        [userKey]: profile.displayName,
        email: email
      };

      // Handle specific fields based on user type
      if (userKey === 'candidate_name') {
        profileData.cid = user.cid;
        profileData.lookingForJobs = false;
      } else {
        profileData.eid = user.eid;
        profileData.company_logo = '';
      }

      if (profile.photos && profile.photos[0] && profile.photos[0].value) {
        try {
          const imageResponse = await axios.get(profile.photos[0].value, { responseType: 'arraybuffer' });
          if (userKey === 'candidate_name') {
            profileData[`${profileKey}_image`] = imageResponse.data;
          } else {
            profileData.company_logo = imageResponse.data; // Save as company_logo for employers
          }
        } catch (imageError) {
          console.error('Error fetching profile image:', imageError);
        }
      }

      await ProfileModel.create(profileData);
    }

    return done(null, { ...user.toJSON(), userType: userKey === 'candidate_name' ? 'candidate' : 'employer' });
  } catch (error) {
    return done(error);
  }
};

passport.use('google-candidate', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/candidates/auth/google/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    handleGoogleCallback(accessToken, refreshToken, profile, done, Candidate, CandidateProfile, 'candidate_name', 'candidate');
  }
));

passport.use('google-employer', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/employers/auth/google/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    handleGoogleCallback(accessToken, refreshToken, profile, done, Employer, EmployerProfile, 'company_name', 'employer');
  }
));

passport.serializeUser((user, done) => {
  done(null, {
    id: user.cid || user.eid,
    type: user.userType
  });
});

passport.deserializeUser(async (obj, done) => {
  try {
    const UserModel = obj.type === 'candidate' ? Candidate : Employer;
    const user = await UserModel.findByPk(obj.id);
    if (user) {
      user.userType = obj.type;
      done(null, user);
    } else {
      done(new Error('User not found'));
    }
  } catch (error) {
    done(error);
  }
});