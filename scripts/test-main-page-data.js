const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testMainPageData() {
  console.log('🧪 Testing main page data fetching...\n');

  try {
    // Test team members
    console.log('👥 Testing team members...');
    const { data: teamData, error: teamError } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (teamError) {
      console.log('❌ Team members error:', teamError.message);
    } else {
      console.log(`✅ Found ${teamData.length} team members:`);
      teamData.forEach((member, index) => {
        console.log(`   ${index + 1}. ${member.name} - ${member.role}`);
      });
    }

    // Test courses
    console.log('\n📚 Testing courses...');
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true });

    if (courseError) {
      console.log('❌ Courses error:', courseError.message);
    } else {
      console.log(`✅ Found ${courseData.length} courses:`);
      courseData.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.title} - ${course.description}`);
      });
    }

    // Test study abroad
    console.log('\n🌍 Testing study abroad programs...');
    const { data: studyData, error: studyError } = await supabase
      .from('study_abroad')
      .select('*')
      .order('created_at', { ascending: true });

    if (studyError) {
      console.log('❌ Study abroad error:', studyError.message);
    } else {
      console.log(`✅ Found ${studyData.length} study abroad programs:`);
      studyData.forEach((program, index) => {
        console.log(`   ${index + 1}. ${program.program_name} - ${program.country}`);
      });
    }

    console.log('\n🎯 Summary:');
    console.log(`Team members: ${teamData?.length || 0}`);
    console.log(`Courses: ${courseData?.length || 0}`);
    console.log(`Study abroad programs: ${studyData?.length || 0}`);

    if ((teamData?.length || 0) === 0 && (courseData?.length || 0) === 0) {
      console.log('\n⚠️  No data found! This might be why the main page is empty.');
      console.log('💡 Try adding some data through the admin panel.');
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testMainPageData();

