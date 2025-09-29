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

async function testCourseCreation() {
  console.log('🧪 Testing course creation...\n');

  try {
    // Test data that matches current schema
    const testCourse = {
      title: 'Test Course',
      description: '4 months - Beginner, Intermediate',
      link: 'https://neonedu.com',
      category: '4 months'
    };

    console.log('📝 Attempting to create test course with data:', testCourse);

    const { data: course, error } = await supabase
      .from('courses')
      .insert([testCourse])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating test course:', error);
      console.log('🔍 Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Test course created successfully:', course);
      
      // Clean up - delete the test course
      await supabase
        .from('courses')
        .delete()
        .eq('id', course.id);
      console.log('🧹 Test course deleted');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testCourseCreation();
