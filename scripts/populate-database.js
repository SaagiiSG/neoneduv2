const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read the extracted data
const dataPath = path.join(__dirname, '../extracted-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const API_BASE = 'http://localhost:3000/api';

async function populateDatabase() {
  console.log('🚀 Starting database population...\n');

  try {
    // Populate Team Members
    console.log('👥 Adding team members...');
    for (const member of data.teamMembers) {
      try {
        const response = await axios.post(`${API_BASE}/team-members`, member);
        console.log(`✅ Added: ${member.name}`);
      } catch (error) {
        console.log(`⚠️  ${member.name}: ${error.response?.data?.message || error.message}`);
      }
    }

    // Populate Courses
    console.log('\n📚 Adding courses...');
    for (const course of data.courses) {
      try {
        const response = await axios.post(`${API_BASE}/courses`, course);
        console.log(`✅ Added: ${course.title}`);
      } catch (error) {
        console.log(`⚠️  ${course.title}: ${error.response?.data?.message || error.message}`);
      }
    }

    // Populate Study Abroad Programs
    console.log('\n🌍 Adding study abroad programs...');
    for (const program of data.studyAbroad) {
      try {
        const response = await axios.post(`${API_BASE}/study-abroad`, program);
        console.log(`✅ Added: ${program.programName}`);
      } catch (error) {
        console.log(`⚠️  ${program.programName}: ${error.response?.data?.message || error.message}`);
      }
    }

    // Populate Contact Info
    console.log('\n📞 Adding contact info...');
    try {
      const response = await axios.put(`${API_BASE}/contact-info`, {
        address: data.contactInfo.address,
        phone: data.contactInfo.phone,
        email: data.contactInfo.email
      });
      console.log('✅ Added: Contact Info');

      // Add social media links
      for (const social of data.contactInfo.socials) {
        try {
          const socialResponse = await axios.post(`${API_BASE}/contact-info/socials`, social);
          console.log(`✅ Added: ${social.platform}`);
        } catch (error) {
          console.log(`⚠️  ${social.platform}: ${error.response?.data?.message || error.message}`);
        }
      }
    } catch (error) {
      console.log(`⚠️  Contact Info: ${error.response?.data?.message || error.message}`);
    }

    console.log('\n🎉 Database population completed!');
    console.log('\n📊 Summary:');
    console.log(`- Team Members: ${data.teamMembers.length}`);
    console.log(`- Courses: ${data.courses.length}`);
    console.log(`- Study Abroad Programs: ${data.studyAbroad.length}`);
    console.log(`- Contact Info: 1`);
    console.log(`- Social Media Links: ${data.contactInfo.socials.length}`);

  } catch (error) {
    console.error('❌ Error during population:', error.message);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  populateDatabase();
}

module.exports = { populateDatabase };


