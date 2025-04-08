require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// List of emails to verify
const emailsToVerify = ['akashverma29321@gmail.com'];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  verifyUsers();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Function to verify users
async function verifyUsers() {
  try {
    // For each email in the list
    for (const email of emailsToVerify) {
      // Find the user
      const user = await User.findOne({ email });
      
      if (!user) {
        console.log(`User with email ${email} not found`);
        continue;
      }

      // Update verification status
      user.isVerified = true;
      await user.save();
      console.log(`User ${email} has been verified successfully`);
    }

    console.log('All user verification updates completed');
  } catch (error) {
    console.error('Error verifying users:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}