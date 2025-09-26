const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🧪 Testing Supabase Connection...\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration in .env.local');
  console.log('Please run: npm run check-supabase');
  process.exit(1);
}

if (supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  console.error('❌ Placeholder values detected in .env.local');
  console.log('Please update your .env.local with real Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log(`🌐 Testing connection to: ${supabaseUrl}`);
    
    // Test basic connection
    const { data, error } = await supabase.from('team_members').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      
      if (error.message.includes('relation "team_members" does not exist')) {
        console.log('\n💡 The tables might not exist yet. Run the database migrations first.');
      }
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('✅ Database is accessible');
    
    // Test auth
    console.log('\n🔐 Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth test failed:', authError.message);
    } else {
      console.log('✅ Authentication system is working');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 This might be a network connectivity issue.');
      console.log('Check your internet connection and Supabase project status.');
    }
  }
}

testConnection();


