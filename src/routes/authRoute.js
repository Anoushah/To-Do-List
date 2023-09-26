const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController'); // Import the authController

// Signup Route
router.post('/signup', authController.signup);

// Login Route
router.post('/login', authController.login);

// Google Authentication Routes
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
