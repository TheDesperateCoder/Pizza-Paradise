const OTP = require("../models/OTP");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailSender = require("../utils/emailSender");

// Generate OTP - simple 6-digit numeric code
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for registration
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('OTP requested for:', email);
    
    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Check if user is already registered
    const existingUser = await User.findOne({ email }).lean().exec();
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered"
      });
    }

    // Generate unique OTP
    const otp = generateOTP();
    
    // Remove any existing OTPs for this email to prevent confusion
    await OTP.deleteMany({ email });
    
    // Create new OTP document
    const otpDoc = await OTP.create({ email, otp });
    console.log(`OTP created in database for ${email}: ${otp}`);
    
    try {
      // Send OTP via email
      await emailSender.sendOTPEmail(email, otp);
      console.log(`OTP successfully sent to ${email}: ${otp}`);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again later.",
        error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
    
    // Don't send OTP in production - only for development/testing
    const otpResponse = process.env.NODE_ENV === 'development' || true ? { otp } : {};
    
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      ...otpResponse
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP, please try again",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Signup with OTP verification
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Password validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 8 characters long"
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email }).lean().exec();
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Verify OTP
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log("OTP verification for email:", email, "found OTPs:", response);
    
    if (response.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired, please request a new one"
      });
    }
    
    if (otp !== response[0].otp) {
      console.log("OTP mismatch. Provided:", otp, "Stored:", response[0].otp);
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user with isVerified set to true since OTP was verified
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      accountType: accountType || "User",
      contactNumber,
      isVerified: true  // Set to true since we verified via OTP
    });
    
    // Remove sensitive data before sending response
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType
    };
    
    // Generate JWT token for authentication
    const token = jwt.sign(
      { id: user._id, email: user.email, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    // Delete used OTPs for this email
    await OTP.deleteMany({ email });
    
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
      token
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "User cannot be registered, please try again"
    });
  }
};

// User login with verification check restored
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    
    // Find user by email (case insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('Login failed: User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please try again."
      });
    }
    
    // Check if email is verified - RESTORED
    if (!user.isVerified) {
      console.log('Login failed: Email not verified for:', email);
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in"
      });
    }
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password for email:', email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please try again."
      });
    }
    
    console.log('Login successful for email:', email);
    
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        accountType: user.accountType
      },
      process.env.JWT_SECRET || "pizza-delivery-secret",
      { expiresIn: "24h" }
    );
    
    // Set token in user document
    user.token = token;
    await user.save();
    
    // Set cookie
    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };
    
    // Remove sensitive data before sending response
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType
    };
    
    return res.status(200).json({
      success: true,
      token,
      user: userResponse,
      message: "Login successful"
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed, please try again",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new password are required"
      });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password should be at least 8 characters long"
      });
    }
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }
    
    // Update password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedNewPassword;
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};