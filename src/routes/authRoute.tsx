import express, { Request, Response } from 'express';
import passport from 'passport';
import { signup, login } from '../controllers/authController';
import User from '../models/user';

const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Verification Route
// Verification Route
router.get('/verify', async (req: Request, res: Response) => {
  const { token } = req.query as { token: string };

  try {
    const user = await User.findOne({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Verification token not found' });
    }

    user.isVerified = 'true';
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Google Authentication
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    res.redirect('/');
  }
);

export default router;
