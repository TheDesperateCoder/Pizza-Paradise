const axios = require('axios');

// Base URL for the API
const API_URL = 'http://localhost:3001';

// Test user details
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser' + Math.floor(Math.random() * 10000) + '@example.com',
  password: 'Password123',
  confirmPassword: 'Password123',
  contactNumber: '1234567890'
};

let otpCode = null;
let authToken = null;

// 1. Test OTP generation
async function testSendOTP() {
  console.log('1. Testing OTP generation...');
  try {
    const response = await axios.post(`${API_URL}/auth/sendotp`, {
      email: testUser.email
    });
    
    if (response.data.success && response.data.otp) {
      console.log('✅ OTP generation successful');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   OTP: ${response.data.otp}`);
      otpCode = response.data.otp;
      return true;
    } else {
      console.log('❌ OTP generation failed');
      console.log(response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ OTP generation failed');
    console.log(error.response?.data || error.message);
    return false;
  }
}

// 2. Test signup with OTP
async function testSignup() {
  console.log('\n2. Testing signup with OTP...');
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      ...testUser,
      otp: otpCode
    });
    
    if (response.data.success) {
      console.log('✅ Signup successful');
      console.log(`   User ID: ${response.data.user._id}`);
      return true;
    } else {
      console.log('❌ Signup failed');
      console.log(response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Signup failed');
    console.log(error.response?.data || error.message);
    return false;
  }
}

// 3. Test login
async function testLogin() {
  console.log('\n3. Testing login...');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    if (response.data.success && response.data.token) {
      console.log('✅ Login successful');
      console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
      authToken = response.data.token;
      return true;
    } else {
      console.log('❌ Login failed');
      console.log(response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Login failed');
    console.log(error.response?.data || error.message);
    return false;
  }
}

// 4. Test authenticated route
async function testAuthenticatedRoute() {
  console.log('\n4. Testing authenticated route...');
  try {
    const response = await axios.post(
      `${API_URL}/auth/change-password`,
      {
        currentPassword: testUser.password,
        newPassword: 'NewPassword123'
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    if (response.data.success) {
      console.log('✅ Authentication working correctly');
      return true;
    } else {
      console.log('❌ Authentication test failed');
      console.log(response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Authentication test failed');
    console.log(error.response?.data || error.message);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('🧪 AUTHENTICATION SYSTEM TEST 🧪');
  console.log('==============================\n');
  
  const otpSuccess = await testSendOTP();
  if (!otpSuccess) return;
  
  // Wait 2 seconds to ensure OTP is processed
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const signupSuccess = await testSignup();
  if (!signupSuccess) return;
  
  const loginSuccess = await testLogin();
  if (!loginSuccess) return;
  
  await testAuthenticatedRoute();
  
  console.log('\n🏁 TEST SUMMARY');
  console.log('=============');
  console.log('Authentication system is working properly!');
}

// Run the tests
runTests().catch(console.error);

/*
To run this test:
1. Make sure your backend server is running
2. Run this file with: node test-auth.js
*/