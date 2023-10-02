const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const passport = require('../google_Auth/passport-config'); // Import the Passport configuration
const nodemailer = require('nodemailer');

const dbuser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

function generateVerificationToken() {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return token;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: dbuser,
    pass: dbPassword,
  },
});
// Swagger JSDoc for Signup
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User registration.
 *     description: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Registration failed.
 *       409:
 *         description: Email address already in use.
 *     tags:
 *       - Authentication
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 */
async function signup(req, res) {
  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'Email address already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = generateVerificationToken(); // Generate a verification token

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });

    const verificationLink = `http://localhost:1250/verify?token=${verificationToken}`;
    const mailOptions = {
      from: dbuser,
      to: newUser.email,
      subject: 'Account Verification',
      text: `Click the following link to verify your email: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Registration failed' });
  }
}

// Swagger JSDoc for Login
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login.
 *     description: Authenticate a user with their credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Please sign up first, Email not verified, or Invalid password.
 *       500:
 *         description: Internal server error.
 *     tags:
 *       - Authentication
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 */

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Please sign up first' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: 'Email not verified. Please check your email for a verification link.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  signup,
  login,
};

