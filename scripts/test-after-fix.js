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

async function testAfterFix() {
  console.log('🧪 Testing database schema after fix...\n');

  try {
    // Test courses table
    console.log('📚 Testing courses table...');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);

    if (coursesError) {
      console.log('❌ Courses table error:', coursesError.message);
    } else {
      const columns = Object.keys(courses[0] || {});
      console.log('✅ Courses columns:', columns);
      
      const hasImage = columns.includes('image');
      const hasDuration = columns.includes('duration');
      const hasLevel1 = columns.includes('levelitem1');
      const hasLevel2 = columns.includes('levelitem2');
      
      console.log(`   Image column: ${hasImage ? '✅' : '❌'}`);
      console.log(`   Duration column: ${hasDuration ? '✅' : '❌'}`);
      console.log(`   Level1 column: ${hasLevel1 ? '✅' : '❌'}`);
      console.log(`   Level2 column: ${hasLevel2 ? '✅' : '❌'}`);
    }

    // Test study_abroad table
    console.log('\n🌍 Testing study_abroad table...');
    const { data: studyAbroad, error: studyError } = await supabase
      .from('study_abroad')
      .select('*')
      .limit(1);

    if (studyError) {
      console.log('❌ Study_abroad table error:', studyError.message);
    } else {
      const columns = Object.keys(studyAbroad[0] || {});
      console.log('✅ Study_abroad columns:', columns);
      
      const hasImage = columns.includes('image');
      const hasUniversities = columns.includes('universities');
      
      console.log(`   Image column: ${hasImage ? '✅' : '❌'}`);
      console.log(`   Universities column: ${hasUniversities ? '✅' : '❌'}`);
    }

    console.log('\n🎯 Summary:');
    console.log('If all columns show ✅, your image upload should work!');
    console.log('If any show ❌, you still need to run the SQL commands.');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAfterFix();

