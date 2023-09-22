const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const jwt = require('jsonwebtoken');


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    }, 
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ where: { email: profile.emails[0].value } });

        if (existingUser) {
          const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return done(null, { user: existingUser, token });
        }

        const newUser = await User.create({
          email: profile.emails[0].value,
          username: profile.displayName
        });

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return done(null, { user: newUser, token });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});
module.exports = passport;
