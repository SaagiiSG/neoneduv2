// Test script to check upload functionality
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Upload Configuration...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📝 You need to create .env.local with your Cloudinary credentials:');
  console.log(`
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
  `);
  console.log('🔗 Get these from: https://cloudinary.com/console');
  process.exit(1);
}

// Check environment variables
require('dotenv').config({ path: envPath });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('📋 Environment Variables Check:');
console.log(`Cloud Name: ${cloudName ? '✅ Set' : '❌ Missing'}`);
console.log(`API Key: ${apiKey ? '✅ Set' : '❌ Missing'}`);
console.log(`API Secret: ${apiSecret ? '✅ Set' : '❌ Missing'}`);

if (!cloudName || !apiKey || !apiSecret) {
  console.log('\n❌ Missing Cloudinary credentials!');
  console.log('📝 Update your .env.local file with real values from Cloudinary dashboard');
  process.exit(1);
}

if (cloudName === 'your_cloud_name_here' || apiKey === 'your_api_key_here' || apiSecret === 'your_api_secret_here') {
  console.log('\n❌ Using placeholder values!');
  console.log('📝 Replace the placeholder values with your actual Cloudinary credentials');
  process.exit(1);
}

console.log('\n✅ All Cloudinary credentials are set!');
console.log('🚀 Upload should work now. Try uploading an image in the admin panel.');

