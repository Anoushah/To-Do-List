const express = require('express');
const session = require('express-session'); 
const router = express.Router();
const passport = require('passport');


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
  (req, res) => {
    const token = req.user.token; 
    if (token) {
      res.status(200).json({ token }); 
    } else {
      res.status(401).json({ error: 'Token not found' });
    }
  }
);

module.exports = router;
