const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true // For faster lookups
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // OTP expires after 10 minutes (600 seconds)
  }
});

// Static method to find by email (for performance)
otpSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Method to verify OTP
otpSchema.methods.verifyOTP = function(inputOTP) {
  return this.otp === inputOTP;
};

const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema);

module.exports = OTP;