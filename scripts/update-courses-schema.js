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

async function updateCoursesSchema() {
  console.log('🔄 Updating courses table schema...\n');

  try {
    // First, let's check what columns currently exist
    console.log('📋 Checking current courses table structure...');
    const { data: courses, error: fetchError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);

    if (fetchError && fetchError.code === 'PGRST116') {
      console.log('❌ Courses table does not exist. Please create it first.');
      return;
    }

    console.log('✅ Courses table exists. Current columns:', Object.keys(courses[0] || {}));

    // Add new columns if they don't exist
    console.log('\n🔧 Adding new columns to courses table...');
    
    const newColumns = [
      'ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration TEXT;',
      'ALTER TABLE courses ADD COLUMN IF NOT EXISTS levelitem1 TEXT;', 
      'ALTER TABLE courses ADD COLUMN IF NOT EXISTS levelitem2 TEXT;',
      'ALTER TABLE courses ADD COLUMN IF NOT EXISTS image TEXT;'
    ];

    // Add comments to the columns
    const comments = [
      "COMMENT ON COLUMN courses.duration IS 'Course duration (e.g., 4 months, 6 weeks)';",
      "COMMENT ON COLUMN courses.levelitem1 IS 'First level item (e.g., Beginner, Intermediate)';",
      "COMMENT ON COLUMN courses.levelitem2 IS 'Second level item (e.g., Upper Intermediate, Advanced)';",
      "COMMENT ON COLUMN courses.image IS 'URL of the course image stored in Cloudinary';"
    ];

    console.log('\n📝 Manual Steps Required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run these SQL commands:');
    console.log('');
    
    newColumns.forEach(sql => {
      console.log(`   ${sql}`);
    });
    
    console.log('');
    console.log('4. Add comments to the columns:');
    comments.forEach(sql => {
      console.log(`   ${sql}`);
    });

    console.log('\n🔄 After adding the columns, you may want to migrate existing data:');
    console.log('   -- Example migration for existing courses:');
    console.log("   UPDATE courses SET duration = '4 months' WHERE duration IS NULL;");
    console.log("   UPDATE courses SET levelitem1 = 'Beginner' WHERE levelitem1 IS NULL;");
    console.log("   UPDATE courses SET levelitem2 = 'Intermediate' WHERE levelitem2 IS NULL;");

    console.log('\n🎉 After running these commands, the course admin will work properly!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateCoursesSchema();

