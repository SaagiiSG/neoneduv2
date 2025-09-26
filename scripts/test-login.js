const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔐 Testing Admin Login...\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  try {
    console.log('📧 Attempting login with admin@neonedu.com...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@neonedu.com',
      password: 'admin123'
    });

    if (error) {
      console.error('❌ Login failed:', error.message);
      console.error('Error details:', error);
      
      // Common error solutions
      if (error.message.includes('Invalid login credentials')) {
        console.log('\n💡 Solutions:');
        console.log('1. User might not exist - run: npm run create-admin');
        console.log('2. Password might be wrong');
        console.log('3. Check if user is confirmed in Supabase dashboard');
      } else if (error.message.includes('Email not confirmed')) {
        console.log('\n💡 User exists but email not confirmed');
        console.log('Go to Supabase Dashboard → Authentication → Users');
        console.log('Find the user and click "Confirm" or enable "Auto Confirm"');
      }
      return;
    }

    if (data.session) {
      console.log('✅ Login successful!');
      console.log('👤 User ID:', data.user.id);
      console.log('📧 Email:', data.user.email);
      console.log('🎫 Access Token:', data.session.access_token.substring(0, 20) + '...');
      
      // Test logout
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) {
        console.error('❌ Logout failed:', logoutError.message);
      } else {
        console.log('✅ Logout successful');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Network error detected');
      console.log('This might be a CORS issue or network connectivity problem');
    }
  }
}

testLogin();


