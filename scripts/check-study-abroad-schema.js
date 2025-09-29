const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkStudyAbroadSchema() {
  console.log('🔍 Checking study_abroad table schema...\n');

  try {
    // Check what columns currently exist
    console.log('📋 Checking current study_abroad table structure...');
    const { data: programs, error: fetchError } = await supabase
      .from('study_abroad')
      .select('*')
      .limit(1);

    if (fetchError && fetchError.code === 'PGRST116') {
      console.log('❌ Study_abroad table does not exist. Please create it first.');
      return;
    }

    if (fetchError) {
      console.error('❌ Error fetching data:', fetchError);
      return;
    }

    if (programs.length === 0) {
      console.log('✅ Study_abroad table exists but is empty.');
      console.log('📝 You can add programs now.');
      return;
    }

    console.log('✅ Study_abroad table exists. Current columns:', Object.keys(programs[0] || {}));
    console.log('📄 Sample data:', programs[0]);

    // Check if image column exists
    const hasImageColumn = programs[0] && 'image' in programs[0];
    console.log(`\n🖼️  Image column exists: ${hasImageColumn ? '✅ Yes' : '❌ No'}`);

    if (!hasImageColumn) {
      console.log('\n📝 To add image upload functionality, run this SQL:');
      console.log('   ALTER TABLE study_abroad ADD COLUMN IF NOT EXISTS image TEXT;');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkStudyAbroadSchema();

