// Extract data from page.tsx and create database entries
const fs = require('fs');
const path = require('path');

// Read the page.tsx file
const pagePath = path.join(__dirname, '../src/app/page.tsx');
const pageContent = fs.readFileSync(pagePath, 'utf8');

// Extract team data
const teamDataMatch = pageContent.match(/const teamData = \[([\s\S]*?)\]/);
const teamData = teamDataMatch ? eval('[' + teamDataMatch[1] + ']') : [];

// Extract course data
const courseDataMatch = pageContent.match(/const courseData = \[([\s\S]*?)\]/);
const courseData = courseDataMatch ? eval('[' + courseDataMatch[1] + ']') : [];

// Extract study abroad data
const studyAbroadDataMatch = pageContent.match(/const studyAbroadData = \[([\s\S]*?)\]/);
const studyAbroadData = studyAbroadDataMatch ? eval('[' + studyAbroadDataMatch[1] + ']') : [];

console.log('📊 Extracted Data:');
console.log('Team Members:', teamData.length);
console.log('Courses:', courseData.length);
console.log('Study Abroad Programs:', studyAbroadData.length);

// Transform data for database
const transformedTeamData = teamData.map(member => ({
  name: member.name,
  role: member.position,
  image: member.image,
  bio: `${member.ditem1 || ''} ${member.ditem2 || ''} ${member.ditem3 || ''}`.trim()
}));

const transformedCourseData = courseData.map(course => ({
  title: course.name,
  description: `${course.duration} course. Levels: ${course.levelItem1}, ${course.levelItem2}`,
  link: `https://neonedu.com/${course.name.toLowerCase().replace(/\s+/g, '-')}`,
  category: 'English Language'
}));

const transformedStudyAbroadData = studyAbroadData.map(program => ({
  programName: `Study in ${program.country}`,
  country: program.country,
  description: `${program.description} ${program.universities}`,
  link: `https://neonedu.com/${program.country.toLowerCase().replace(/\s+/g, '-')}`
}));

console.log('\n🔄 Transformed Data:');
console.log('Team Members:', transformedTeamData);
console.log('Courses:', transformedCourseData);
console.log('Study Abroad Programs:', transformedStudyAbroadData);

// Export the data
const exportData = {
  teamMembers: transformedTeamData,
  courses: transformedCourseData,
  studyAbroad: transformedStudyAbroadData,
  contactInfo: {
    address: 'Ulaanbaatar, Mongolia',
    phone: '+976-11-123456',
    email: 'info@neonedu.com',
    socials: [
      { platform: 'Facebook', url: 'https://facebook.com/neonedu' },
      { platform: 'Instagram', url: 'https://instagram.com/neonedu' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/neonedu' }
    ]
  }
};

fs.writeFileSync(
  path.join(__dirname, '../extracted-data.json'),
  JSON.stringify(exportData, null, 2)
);

console.log('\n✅ Data extracted and saved to extracted-data.json');

