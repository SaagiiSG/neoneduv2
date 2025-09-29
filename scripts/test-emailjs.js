// Test script for EmailJS configuration
// Run this script to verify your EmailJS setup

require('dotenv').config({ path: '.env.local' });

const testEmailJS = async () => {
  console.log('Testing EmailJS Configuration...\n');
  
  // Check environment variables
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  
  console.log('Environment Variables:');
  console.log('Service ID:', serviceId ? '✅ Set' : '❌ Missing');
  console.log('Template ID:', templateId ? '✅ Set' : '❌ Missing');
  console.log('Public Key:', publicKey ? '✅ Set' : '❌ Missing');
  
  if (!serviceId || !templateId || !publicKey) {
    console.log('\n❌ EmailJS configuration is incomplete!');
    console.log('Please set up your environment variables in .env.local');
    console.log('See EMAIL_SETUP.md for detailed instructions.');
    return;
  }
  
  console.log('\n✅ EmailJS configuration looks good!');
  console.log('You can now test the contact form on your website.');
  
  // Optional: Test with sample data (uncomment to test)
  /*
  try {
    const emailjs = require('@emailjs/browser');
    emailjs.init(publicKey);
    
    const templateParams = {
      from_name: 'Test User',
      from_email: 'test@example.com',
      phone: '+976 12345678',
      message: 'This is a test message from the test script.',
      to_email: 'neon.edu.mn@gmail.com',
      subject: 'Test Email from Neon Edu Contact Form'
    };
    
    console.log('\nSending test email...');
    const result = await emailjs.send(serviceId, templateId, templateParams);
    console.log('✅ Test email sent successfully!', result);
  } catch (error) {
    console.log('❌ Test email failed:', error.message);
  }
  */
};

// Run the test
testEmailJS().catch(console.error);
