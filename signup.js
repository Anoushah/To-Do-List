const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./models/user'); 
const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');

router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body; 

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      res.status(400).json({ error: 'Email address already in use' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Registration failed' });
  }
});

module.exports = router;
