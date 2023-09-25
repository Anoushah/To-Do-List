const express = require('express');
const router = express.Router();
const User = require('./models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: '-------',
    pass: '-------',
  },
});

function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = generateResetToken();
    user.resetToken = resetToken;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: '-----',
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error sending password reset email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Password reset email sent' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending password reset email' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { resetToken: token } });

    if (!user) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetToken = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error resetting password' });
  }
});

module.exports = router;
