// Test the exact same data fetching logic as the frontend
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing frontend Supabase configuration');
  console.log('Available env vars:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseAnonKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Copy the exact functions from data.ts
async function getTeamMembers() {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

async function getCourses() {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

function transformTeamData(dbData) {
  const teamOrder = [
    'Dalantai.E',
    'Anar.P', 
    'Enkhjin. G',
    'Kherlen. Sh',
    'Mandakhjargal.E',
    'Enkhjin. T',
    'Yumjir. Ts'
  ];

  return dbData
    .map(member => ({
      name: member.name,
      image: member.image,
      position: member.role,
      ditem1: member.bio,
      ditem2: '',
      ditem3: ''
    }))
    .sort((a, b) => {
      const indexA = teamOrder.indexOf(a.name);
      const indexB = teamOrder.indexOf(b.name);
      
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      return a.name.localeCompare(b.name);
    });
}

function transformCourseData(dbData) {
  const courseOrder = [
    'General English',
    'IELTS Preparation', 
    'Academic English'
  ];

  return dbData
    .map(course => ({
      name: course.title,
      duration: course.duration || (course.description?.includes('months') ? 
        course.description.match(/\d+ months/)?.[0] || '4 months' : '4 months'),
      image: course.image || (course.title === 'General English' ? '/classroom2.svg' :
             course.title === 'IELTS Preparation' ? '/classroom1.png' :
             course.title === 'Academic English' ? '/office.svg' :
             course.category === 'General English' ? '/classroom2.svg' :
             course.category === 'IELTS Preparation' ? '/classroom1.png' :
             course.category === 'Academic English' ? '/office.svg' :
             '/office.svg'),
      levelItem1: course.levelitem1 || (course.description?.includes('Beginner') ? 'Beginner' :
                  course.description?.includes('Upper Intermediate') ? 'Upper Intermediate' :
                  'Research methodology'),
      levelItem2: course.levelitem2 || (course.description?.includes('Intermediate') ? 'Intermediate' :
                  course.description?.includes('Advanced') ? 'Advanced' :
                  'Academic writing')
    }))
    .sort((a, b) => {
      const categoryA = courseOrder.indexOf(a.name) !== -1 ? courseOrder.indexOf(a.name) : 999;
      const categoryB = courseOrder.indexOf(b.name) !== -1 ? courseOrder.indexOf(b.name) : 999;
      
      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }
      
      return a.name.localeCompare(b.name);
    });
}

async function testFrontendData() {
  console.log('🧪 Testing frontend data fetching and transformation...\n');

  try {
    console.log('👥 Fetching and transforming team members...');
    const teamMembers = await getTeamMembers();
    const transformedTeam = transformTeamData(teamMembers);
    
    console.log(`✅ Raw team data: ${teamMembers.length} members`);
    console.log(`✅ Transformed team data: ${transformedTeam.length} members`);
    transformedTeam.forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.name} - ${member.position}`);
    });

    console.log('\n📚 Fetching and transforming courses...');
    const courses = await getCourses();
    const transformedCourses = transformCourseData(courses);
    
    console.log(`✅ Raw course data: ${courses.length} courses`);
    console.log(`✅ Transformed course data: ${transformedCourses.length} courses`);
    transformedCourses.forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.name} - ${course.duration}`);
    });

    console.log('\n🎯 Summary:');
    console.log(`Team members ready for frontend: ${transformedTeam.length}`);
    console.log(`Courses ready for frontend: ${transformedCourses.length}`);

    if (transformedTeam.length > 0 && transformedCourses.length > 0) {
      console.log('\n✅ Data is ready for the main page!');
      console.log('💡 If the main page is still empty, check the browser console for errors.');
    } else {
      console.log('\n⚠️  No data ready for frontend display');
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testFrontendData();

