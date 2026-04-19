import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy');

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, name: user.name });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, name: user.name });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Get profile (with streak info)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -pushSubscription');
    res.json(user);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Google Auth verification
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    // Verify the ID token (Skip client ID check if we don't have a strict strict one configured yet, but ideally pass audience)
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || undefined, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId });
    } else if (!user.googleId) {
      // Link the account
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Google authentication failed' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User with this email does not exist' });

    // Generate simple 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const emailResult = await sendEmail(
      email,
      'Password Reset Request - ReviseIt',
      `Your password reset code is: ${otp}\n\nThis code is valid for 15 minutes.`
    );

    if (!process.env.SMTP_USER) {
      // In development mode without actual SMTP, return the OTP directly to frontend so the user isn't stuck.
      return res.json({
        msg: 'Reset code generated (DEV MODE)! Check your screen.',
        devOtp: otp,
        previewUrl: emailResult?.previewUrl
      });
    }

    res.json({ msg: 'Reset code sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error sending reset code' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Password reset successful. You can now login.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error resetting password' });
  }
});

export default router;
