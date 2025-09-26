const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Supabase Configuration...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

console.log(`📁 .env.local file exists: ${envExists ? '✅ Yes' : '❌ No'}`);

if (envExists) {
  console.log('\n📄 .env.local contents:');
  console.log('─'.repeat(50));
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check for Supabase variables
  const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const supabaseAnonKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
  const supabaseServiceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
  
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? (supabaseUrl[1].includes('placeholder') ? '❌ Placeholder value' : '✅ Set') : '❌ Not found'}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? (supabaseAnonKey[1].includes('placeholder') ? '❌ Placeholder value' : '✅ Set') : '❌ Not found'}`);
  console.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Not found'}`);
  
  if (supabaseUrl && !supabaseUrl[1].includes('placeholder')) {
    console.log(`\n🌐 Supabase URL: ${supabaseUrl[1]}`);
  }
} else {
  console.log('\n❌ No .env.local file found!');
}

console.log('\n📋 Required Environment Variables:');
console.log('─'.repeat(50));
console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');

console.log('\n🔧 How to get your Supabase credentials:');
console.log('─'.repeat(50));
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to Settings > API');
console.log('4. Copy the Project URL and anon public key');
console.log('5. Copy the service_role secret key');

console.log('\n📝 Create or update your .env.local file with these values.');


