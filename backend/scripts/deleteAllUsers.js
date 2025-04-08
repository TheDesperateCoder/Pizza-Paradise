require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  deleteAllUsers();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Function to delete all users
async function deleteAllUsers() {
  try {
    // Delete all users
    const result = await User.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} user accounts`);
    
    // Also delete any OTP records if they exist
    if (mongoose.models.OTP) {
      const otpResult = await mongoose.models.OTP.deleteMany({});
      console.log(`Successfully deleted ${otpResult.deletedCount} OTP records`);
    }
    
    console.log('All user accounts have been deleted successfully.');
  } catch (error) {
    console.error('Error deleting user accounts:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}