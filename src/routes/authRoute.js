const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController'); 
const User = require('../models/user'); 

// Signup Route
router.post('/signup', authController.signup);

// Login Route
router.post('/login', authController.login);

// Verification Route
router.get('/verify', async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res.status(404).json({ error: 'Verification token not found' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
