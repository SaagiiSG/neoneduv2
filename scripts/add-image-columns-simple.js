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

async function addImageColumns() {
  console.log('🖼️  Adding image columns to courses and study_abroad tables...\n');

  try {
    // Add image column to courses table
    console.log('📚 Adding image column to courses table...');
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('id')
      .limit(1);

    if (coursesError && coursesError.code === 'PGRST116') {
      console.log('⚠️  Courses table does not exist yet. Please create it first.');
    } else {
      // Try to add the column using raw SQL through the REST API
      console.log('✅ Courses table exists. You can manually add the image column using:');
      console.log('   ALTER TABLE courses ADD COLUMN image TEXT;');
    }

    // Add image column to study_abroad table
    console.log('🌍 Checking study_abroad table...');
    const { data: studyAbroadData, error: studyAbroadError } = await supabase
      .from('study_abroad')
      .select('id')
      .limit(1);

    if (studyAbroadError && studyAbroadError.code === 'PGRST116') {
      console.log('⚠️  Study_abroad table does not exist yet. Please create it first.');
    } else {
      console.log('✅ Study_abroad table exists. You can manually add the image column using:');
      console.log('   ALTER TABLE study_abroad ADD COLUMN image TEXT;');
    }

    console.log('\n📋 Manual Steps Required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run these SQL commands:');
    console.log('');
    console.log('   -- Add image column to courses table');
    console.log('   ALTER TABLE courses ADD COLUMN IF NOT EXISTS image TEXT;');
    console.log('');
    console.log('   -- Add image column to study_abroad table');
    console.log('   ALTER TABLE study_abroad ADD COLUMN IF NOT EXISTS image TEXT;');
    console.log('');
    console.log('4. Add comments to the columns:');
    console.log('   COMMENT ON COLUMN courses.image IS \'URL of the course image stored in Cloudinary\';');
    console.log('   COMMENT ON COLUMN study_abroad.image IS \'URL of the study abroad program image stored in Cloudinary\';');
    console.log('');
    console.log('🎉 After running these commands, image upload functionality will be ready!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addImageColumns();

