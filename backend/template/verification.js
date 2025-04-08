const emailTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pizza Delivery - OTP Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .header {
          text-align: center;
          padding: 10px;
          background-color: #d63031;
          color: white;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
        }
        .otp-box {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          padding: 10px;
          margin: 20px 0;
          background-color: #f8f9fa;
          border-radius: 5px;
          letter-spacing: 5px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Pizza Delivery</h2>
        </div>
        <div class="content">
          <h3>Email Verification</h3>
          <p>Thank you for registering with Pizza Delivery. To complete your registration, please use the following One-Time Password (OTP):</p>
          <div class="otp-box">${otp}</div>
          <p>This OTP is valid for 5 minutes. If you did not request this verification, please ignore this email.</p>
          <p>Once verified, you'll be able to enjoy ordering your favorite pizzas online!</p>
          <p>Regards,<br>The Pizza Delivery Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Pizza Delivery. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
  </html>
  `;
};

module.exports = emailTemplate;