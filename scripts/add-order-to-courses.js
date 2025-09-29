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

async function addOrderToCourses() {
  console.log('📚 Adding order field to courses...\n');

  try {
    console.log('📝 Manual Steps Required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run this SQL to add the order column:');
    console.log('');
    console.log('   ALTER TABLE courses ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 999;');
    console.log('');
    console.log('4. Then update the order for each course (adjust titles as needed):');
    console.log('');

    const courseOrder = [
      { title: 'General English', order: 1 },
      { title: 'IELTS Preparation', order: 2 },
      { title: 'Academic English', order: 3 }
    ];

    for (const course of courseOrder) {
      console.log(`   UPDATE courses SET display_order = ${course.order} WHERE title = '${course.title}';`);
    }

    console.log('');
    console.log('5. If your course titles are different, check them first:');
    console.log('   SELECT id, title, category FROM courses;');
    console.log('');
    console.log('🎉 This will make the course ordering permanent and reliable!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addOrderToCourses();

