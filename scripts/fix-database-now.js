const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration in .env.local');
  console.log('📝 Make sure you have:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=your_url');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixDatabase() {
  console.log('🔧 Fixing database schema for image uploads...\n');

  try {
    // Check current courses table structure
    console.log('📋 Current courses table columns:');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);

    if (coursesError && coursesError.code === 'PGRST116') {
      console.log('❌ Courses table does not exist');
      return;
    }

    console.log('✅ Courses table exists:', Object.keys(courses[0] || {}));

    // Check current study_abroad table structure  
    console.log('\n📋 Current study_abroad table columns:');
    const { data: studyAbroad, error: studyError } = await supabase
      .from('study_abroad')
      .select('*')
      .limit(1);

    if (studyError && studyError.code === 'PGRST116') {
      console.log('❌ Study_abroad table does not exist');
      return;
    }

    console.log('✅ Study_abroad table exists:', Object.keys(studyAbroad[0] || {}));

    console.log('\n🚨 MANUAL ACTION REQUIRED:');
    console.log('Go to your Supabase Dashboard → SQL Editor and run these commands:\n');

    // Courses table updates
    console.log('-- Fix courses table:');
    console.log('ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration TEXT;');
    console.log('ALTER TABLE courses ADD COLUMN IF NOT EXISTS levelitem1 TEXT;');
    console.log('ALTER TABLE courses ADD COLUMN IF NOT EXISTS levelitem2 TEXT;');
    console.log('ALTER TABLE courses ADD COLUMN IF NOT EXISTS image TEXT;');
    console.log('');

    // Study abroad table updates
    console.log('-- Fix study_abroad table:');
    console.log('ALTER TABLE study_abroad ADD COLUMN IF NOT EXISTS universities TEXT;');
    console.log('ALTER TABLE study_abroad ADD COLUMN IF NOT EXISTS image TEXT;');
    console.log('');

    // Add comments
    console.log('-- Add column comments:');
    console.log("COMMENT ON COLUMN courses.duration IS 'Course duration (e.g., 4 months, 6 weeks)';");
    console.log("COMMENT ON COLUMN courses.levelitem1 IS 'First level item (e.g., Beginner, Intermediate)';");
    console.log("COMMENT ON COLUMN courses.levelitem2 IS 'Second level item (e.g., Upper Intermediate, Advanced)';");
    console.log("COMMENT ON COLUMN courses.image IS 'URL of the course image stored in Cloudinary';");
    console.log("COMMENT ON COLUMN study_abroad.universities IS 'Universities offering the program';");
    console.log("COMMENT ON COLUMN study_abroad.image IS 'URL of the study abroad program image stored in Cloudinary';");
    console.log('');

    console.log('🎉 After running these commands, image uploads will work perfectly!');
    console.log('📱 Test by:');
    console.log('   1. Going to Admin Panel → Courses');
    console.log('   2. Clicking "Add New Course"');
    console.log('   3. Uploading a small image (< 2MB)');
    console.log('   4. Filling the form and saving');

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n📝 Fallback: Copy and paste these SQL commands in Supabase SQL Editor:');
    console.log('ALTER TABLE courses ADD COLUMN IF NOT EXISTS image TEXT;');
    console.log('ALTER TABLE study_abroad ADD COLUMN IF NOT EXISTS image TEXT;');
  }
}

fixDatabase();

