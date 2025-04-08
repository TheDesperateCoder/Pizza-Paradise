const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Store OTP temporarily (in production, use Redis or similar)
const otpStore = new Map();

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('OTP request received for email:', email);
    
    if (!email) {
      console.log('Email validation failed: Missing email');
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 10 minutes expiry
    otpStore.set(email, {
      code: otp,
      expiry: Date.now() + 10 * 60 * 1000
    });
    
    console.log(`Generated OTP for ${email}:`, otp);
    
    // In development, return OTP in response
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: otp // Always return OTP during development
    });
  } catch (error) {
    console.error('Error in sendOTP:', error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });
  }
};

exports.signup = async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { firstName, lastName, email, password, confirmPassword, contactNumber, otp } = req.body;
    
    // Debug logs
    console.log('Checking OTP for email:', email);
    console.log('Provided OTP:', otp);
    console.log('Stored OTPs:', Array.from(otpStore.entries()));
    
    // Validate OTP
    const storedOTP = otpStore.get(email);
    console.log('Stored OTP data:', storedOTP);
    
    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this email. Please request a new OTP."
      });
    }
    
    if (storedOTP.code !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again."
      });
    }
    
    if (Date.now() > storedOTP.expiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP."
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered."
      });
    }

    // Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match."
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Clear used OTP
    otpStore.delete(email);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid credentials for email:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for email:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};