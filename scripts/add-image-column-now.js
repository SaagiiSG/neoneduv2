// Add image column to courses table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addImageColumn() {
  try {
    console.log('🔧 Adding image column to courses table...');
    
    // First, let's check the current table structure
    const { data: tableInfo, error: infoError } = await supabase
      .rpc('exec_sql', {
        sql: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses' ORDER BY ordinal_position;`
      });

    if (infoError) {
      console.log('ℹ️  Could not check table structure (this is normal)');
    } else {
      console.log('📋 Current courses table columns:');
      tableInfo.forEach(col => console.log(`  - ${col.column_name}: ${col.data_type}`));
    }

    // Add the image column
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql: 'ALTER TABLE courses ADD COLUMN image TEXT;'
      });

    if (error) {
      if (error.message.includes('column "image" already exists')) {
        console.log('✅ Image column already exists in courses table!');
      } else {
        console.error('❌ Error adding image column:', error);
        console.log('\n📝 Manual SQL to run in Supabase SQL Editor:');
        console.log('ALTER TABLE courses ADD COLUMN image TEXT;');
        return;
      }
    } else {
      console.log('✅ Image column added successfully to courses table!');
    }

    // Also add to study_abroad table
    console.log('\n🔧 Adding image column to study_abroad table...');
    const { data: studyData, error: studyError } = await supabase
      .rpc('exec_sql', {
        sql: 'ALTER TABLE study_abroad ADD COLUMN image TEXT;'
      });

    if (studyError) {
      if (studyError.message.includes('column "image" already exists')) {
        console.log('✅ Image column already exists in study_abroad table!');
      } else {
        console.error('❌ Error adding image column to study_abroad:', studyError);
        console.log('\n📝 Manual SQL to run in Supabase SQL Editor:');
        console.log('ALTER TABLE study_abroad ADD COLUMN image TEXT;');
      }
    } else {
      console.log('✅ Image column added successfully to study_abroad table!');
    }

    console.log('\n🚀 Upload should work now! Try uploading an image in the admin panel.');

  } catch (error) {
    console.error('❌ Script error:', error);
    console.log('\n📝 Manual SQL commands to run in Supabase SQL Editor:');
    console.log('ALTER TABLE courses ADD COLUMN image TEXT;');
    console.log('ALTER TABLE study_abroad ADD COLUMN image TEXT;');
  }
}

addImageColumn();

