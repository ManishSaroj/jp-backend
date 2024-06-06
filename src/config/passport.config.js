// backend/src/config/passport.config.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const Candidate = require('../models/CandidateModel');
const Employer = require('../models/EmployerModel');

passport.use('google-candidate', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/candidate/auth/google/callback"
}, async (token, tokenSecret, profile, done) => {
  try {
    let user = await Candidate.findOne({ googleId: profile.id });
    if (!user) {
      user = await Candidate.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

passport.use('google-employer', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/employer/auth/google/callback"
}, async (token, tokenSecret, profile, done) => {
  try {
    let user = await Employer.findOne({ googleId: profile.id });
    if (!user) {
      user = await Employer.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

passport.use('linkedin-candidate', new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: "/candidate/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_liteprofile']
}, async (token, tokenSecret, profile, done) => {
  try {
    let user = await Candidate.findOne({ linkedinId: profile.id });
    if (!user) {
      user = await Candidate.create({
        linkedinId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

passport.use('linkedin-employer', new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: "/employer/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_liteprofile']
}, async (token, tokenSecret, profile, done) => {
  try {
    let user = await Employer.findOne({ linkedinId: profile.id });
    if (!user) {
      user = await Employer.create({
        linkedinId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, { id: user.id, role: user instanceof Candidate ? 'candidate' : 'employer' });
});

passport.deserializeUser(async (obj, done) => {
  try {
    let user;
    if (obj.role === 'candidate') {
      user = await Candidate.findById(obj.id);
    } else {
      user = await Employer.findById(obj.id);
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
