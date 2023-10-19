import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

function generateUUID(): string {
  return uuidv4();
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done:Function) => {
      try {
        const existingUser = await User.findOne({ where: { email: profile.emails![0].value } });

        if (existingUser) {
          existingUser.uuid = generateUUID() as string;
          await existingUser.save();
          const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_SECRET || '', {
            expiresIn: '1h',
          });
          return done(null, { user: existingUser, token });
        }

        const newUser = await User.create({
          email: profile.emails![0].value,
          username: profile.displayName || '',
          uuid: generateUUID() as string,
          isVerified: 'false',
        });

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || '', {
          expiresIn: '1h',
        });
        return done(null, { user: newUser, token });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: any, done) => {
  User.findByPk(id)
    .then((user: User | null) => {
      if (user) {
        done(null, user);
      } else {
        done(new Error('User not found'), null);
      }
    })
    .catch((err) => {
      done(err, null);
    });
});

export default passport;
