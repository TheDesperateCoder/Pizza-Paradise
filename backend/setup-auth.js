const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🍕 Pizza Delivery Authentication Setup 🍕');
console.log('=======================================');

// Required packages for authentication system
const requiredPackages = [
  'express',
  'mongoose',
  'cors',
  'bcrypt',
  'jsonwebtoken',
  'otp-generator', 
  'nodemailer',
  'cookie-parser',
  'dotenv'
];

// Check if package.json exists
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.log('❌ package.json not found. Initializing npm project...');
  execSync('npm init -y', { stdio: 'inherit' });
  console.log('✅ npm project initialized successfully');
}

// Install missing dependencies
console.log('📦 Checking required dependencies...');
let packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
let dependencies = packageJson.dependencies || {};
let missingPackages = requiredPackages.filter(pkg => !dependencies[pkg]);

if (missingPackages.length > 0) {
  console.log(`⚠️ Missing packages: ${missingPackages.join(', ')}`);
  console.log('📥 Installing missing packages...');
  execSync(`npm install ${missingPackages.join(' ')} --save`, { stdio: 'inherit' });
  console.log('✅ All packages installed successfully');
} else {
  console.log('✅ All required packages are already installed');
}

// Create required directories
const directories = ['models', 'controllers', 'routes', 'middleware', 'utils'];
console.log('📁 Checking required directories...');

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`📁 Creating ${dir} directory...`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

console.log('✅ Directory structure verified');

console.log('\n🚀 Setup complete!');
console.log('Run the following command to start your server:');
console.log('npm start\n');

console.log('To test the authentication system:');
console.log('node test-auth.js');