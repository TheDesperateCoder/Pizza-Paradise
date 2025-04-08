const nodemailer = require('nodemailer');
const emailConfig = require('../config/email.config.js');

console.log('Email config loaded:', {
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.auth.user,
    pass: '***HIDDEN***' // Hide password in logs
  }
});

// Create transporter once with the proper configuration
const transporter = nodemailer.createTransport(emailConfig);

// Log connection status at startup with more detailed debugging
console.log('Attempting to connect to SMTP server...');
transporter.verify()
  .then(() => {
    console.log('✅ SMTP server connection successful');
    console.log(`Connected to: ${emailConfig.host}:${emailConfig.port}`);
  })
  .catch(err => {
    console.error('❌ SMTP connection error:', err);
    console.error('Please check your email configuration');
  });

// Email templates
const otpTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #d63031; color: white; padding: 10px; text-align: center; }
        .otp-code { font-size: 24px; font-weight: bold; text-align: center; 
                   padding: 15px; margin: 20px 0; background-color: #f8f9fa; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Pizza Delivery</h2>
        </div>
        <h3>Your Verification Code</h3>
        <p>Please use the following code to verify your account:</p>
        <div class="otp-code">${otp}</div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    </body>
  </html>
  `;
};

// Utility functions for sending emails
const emailSender = {
  // Send OTP email with optimized template
  sendOTPEmail: async (email, otp) => {
    try {
      const mailOptions = {
        from: `"Pizza Paradise" <${emailConfig.auth.user}>`,
        to: email,
        subject: 'Verification Code for Your Pizza Paradise Account',
        html: otpTemplate(otp)
      };
      
      console.log(`Attempting to send OTP to: ${email}`);
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent successfully to ${email}: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`❌ Failed to send OTP email to ${email}:`, error);
      throw error;
    }
  },
  
  // Generic email sending function for other purposes
  sendEmail: async (to, subject, htmlContent) => {
    try {
      const mailOptions = {
        from: `"Pizza Paradise" <${emailConfig.auth.user}>`,
        to,
        subject,
        html: htmlContent
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`❌ Failed to send email to ${to}:`, error);
      throw error;
    }
  }
};

module.exports = emailSender;