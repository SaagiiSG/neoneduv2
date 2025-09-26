const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateStudyAbroadSchema() {
  console.log('🔄 Updating study_abroad table schema...\n');

  try {
    // Add universities column
    console.log('📋 Adding universities column...');
    const { error: addColumnError } = await supabase.rpc('exec', {
      sql: 'ALTER TABLE study_abroad ADD COLUMN IF NOT EXISTS universities TEXT;'
    });
    
    if (addColumnError) {
      console.log('⚠️  Could not add universities column automatically');
      console.log('Please run this SQL in your Supabase dashboard:');
      console.log('ALTER TABLE study_abroad ADD COLUMN IF NOT EXISTS universities TEXT;');
    } else {
      console.log('✅ Universities column added successfully');
    }

    console.log('\n📝 If the column wasn\'t added automatically, please run this SQL in your Supabase dashboard:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Run: ALTER TABLE study_abroad ADD COLUMN IF NOT EXISTS universities TEXT;');

  } catch (error) {
    console.error('❌ Error updating schema:', error.message);
    console.log('\n📝 Please run this SQL manually in your Supabase dashboard:');
    console.log('ALTER TABLE study_abroad ADD COLUMN IF NOT EXISTS universities TEXT;');
  }
}

updateStudyAbroadSchema();


