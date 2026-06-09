// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendVerificationCode } = require('../services/email.service');
const User = require('../models/User');
const VerificationCode = require('../models/VerificationCode');

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      username,
      email,
      password
    });

    await newUser.save();

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 4 * 60 * 1000);

    await VerificationCode.create({
      user_id: newUser._id,
      code,
      expires_at: expiresAt
    });

    await sendVerificationCode(email, code);

    return res.status(201).json({
      message: 'User registered successfully. Verification code sent to email.',
      userId: newUser._id
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Step 2: Verify code and issue token
exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const verificationCode = await VerificationCode.findOne({
      user_id: user._id,
      code,
      used: false
    });

    if (!verificationCode) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    if (verificationCode.expires_at < new Date()) {
      return res.status(400).json({ message: 'Code expired' });
    }

    verificationCode.used = true;
    await verificationCode.save();

    user.verified = true;
    await user.save();

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error in verifyCode:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// Step 3: Initiate login 
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.verified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
