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
    const fs = require('fs');
    const path = require('path');

    // Read the migration SQL files
    const coursesMigrationPath = path.join(__dirname, '..', 'server', 'database', 'migrations', '006_add_image_to_courses.sql');
    const studyAbroadMigrationPath = path.join(__dirname, '..', 'server', 'database', 'migrations', '007_add_image_to_study_abroad.sql');
    
    const coursesMigrationSQL = fs.readFileSync(coursesMigrationPath, 'utf8');
    const studyAbroadMigrationSQL = fs.readFileSync(studyAbroadMigrationPath, 'utf8');

    // Execute courses migration
    console.log('📚 Adding image column to courses table...');
    const { data: coursesData, error: coursesError } = await supabase.rpc('exec_sql', {
      sql: coursesMigrationSQL
    });

    if (coursesError) {
      console.error('❌ Error adding image column to courses:', coursesError);
    } else {
      console.log('✅ Successfully added image column to courses table!');
    }

    // Execute study_abroad migration
    console.log('🌍 Adding image column to study_abroad table...');
    const { data: studyAbroadData, error: studyAbroadError } = await supabase.rpc('exec_sql', {
      sql: studyAbroadMigrationSQL
    });

    if (studyAbroadError) {
      console.error('❌ Error adding image column to study_abroad:', studyAbroadError);
    } else {
      console.log('✅ Successfully added image column to study_abroad table!');
    }

    console.log('\n🎉 Image upload functionality is now ready!');
    console.log('📝 Both courses and study abroad programs now support image uploads.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

addImageColumns();

