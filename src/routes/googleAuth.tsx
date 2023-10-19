import express from 'express';
import { Request, Response } from 'express';
import passport from 'passport';

const router = express.Router();

router.get(
  '/auth/google/login',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  (req: Request, res: Response) => {
    const token = (req.user as { token: string }).token; // Type assertion
    if (token) {
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Token not found' });
    }
  }
);

export default router;
