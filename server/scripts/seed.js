const supabase = require('../lib/supabase');

// Seed data from the actual website
const seedData = {
  teamMembers: [
    {
      name: 'Dalantai.E',
      role: 'CEO & Co-Founder',
      image: '/Dalantai.png',
      bio: 'iMBA in International Business (2014), National Taiwan University of Science and Technology, Taiwan. MS (2006) and BS (2005), Mongolian National University of Education, Mongolia.'
    },
    {
      name: 'Anar.P',
      role: 'Co-Founder',
      image: '/Anar.png',
      bio: 'PhD in Educational Leadership (2020), Monash University, Australia. iMBA in International Business (2014), National Taiwan University of Science and Technology, Taiwan. MA (2009) and BS (2008), University of the Humanities, Mongolia.'
    },
    {
      name: 'Enkhjin. G',
      role: 'General Manager',
      image: '/Enkhjin.png',
      bio: 'MBA (2025) and Double BA in English Teaching and Translation (2024), University of the Humanities, Mongolia.'
    },
    {
      name: 'Kherlen. Sh',
      role: 'Teacher & Advisor',
      image: '/Kherlen.png',
      bio: 'MS in Environmental Biology (2021), Swansea University, UK. BS (2017), University of the Humanities, Mongolia.'
    },
    {
      name: 'Mandakhjargal.E',
      role: 'Teacher & Advisor',
      image: '/Mandakhjargal.png',
      bio: 'Double BA in English Teaching and Translation (2022), University of the Humanities, Mongolia.'
    },
    {
      name: 'Enkhjin. T',
      role: 'Teacher & Advisor',
      image: '/Enkhuush.png',
      bio: 'Double BA in English Teaching and Translation (2027), University of the Humanities, Mongolia.'
    },
    {
      name: 'Yumjir. Ts',
      role: 'Teacher & Advisor',
      image: '/Yumjir (1).png',
      bio: 'BA in Psychology (2027), University of the Humanities, Mongolia.'
    }
  ],
  courses: [
    {
      title: 'General English',
      description: '4-month comprehensive English course covering all language skills. Suitable for Beginner to Intermediate levels.',
      link: 'https://neonedu.com/general-english',
      category: 'English Language'
    },
    {
      title: 'IELTS Preparation',
      description: '4-month intensive IELTS preparation course. Designed for Upper Intermediate to Advanced students.',
      link: 'https://neonedu.com/ielts-preparation',
      category: 'English Language'
    },
    {
      title: 'Academic English',
      description: '4-month course focusing on research methodology and academic writing skills for university preparation.',
      link: 'https://neonedu.com/academic-english',
      category: 'Academic Preparation'
    }
  ],
  studyAbroad: [
    {
      programName: 'Study in Australia',
      country: 'Australia',
      description: 'World-class education in a globally recognized system. 220+ universities and colleges available.',
      link: 'https://neonedu.com/australia'
    },
    {
      programName: 'Study in Singapore',
      country: 'Singapore',
      description: 'Australian education, closer and more affordable. James Cook University, Singapore.',
      link: 'https://neonedu.com/singapore'
    },
    {
      programName: 'Study in South Korea',
      country: 'South Korea',
      description: 'High-quality education at affordable cost. Sejong University, SKKU.',
      link: 'https://neonedu.com/south-korea'
    },
    {
      programName: 'Study in Malaysia',
      country: 'Malaysia',
      description: 'Affordable study with transfer pathways to Australia, UK, USA. INTI international University.',
      link: 'https://neonedu.com/malaysia'
    },
    {
      programName: 'Study in China',
      country: 'China',
      description: 'Full, half, and stipend scholarships available. 800+ Universities and colleges.',
      link: 'https://neonedu.com/china'
    },
    {
      programName: 'Study in Hungary',
      country: 'Hungary',
      description: 'Begin studies without IELTS. University of Miskolc.',
      link: 'https://neonedu.com/hungary'
    }
  ],
  contactInfo: {
    address: 'Ulaanbaatar, Mongolia',
    phone: '+976-11-123456',
    email: 'info@neonedu.com',
    socials: [
      {
        platform: 'Facebook',
        url: 'https://facebook.com/neonedu'
      },
      {
        platform: 'Instagram',
        url: 'https://instagram.com/neonedu'
      },
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/company/neonedu'
      }
    ]
  }
};

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed team members
    console.log('Seeding team members...');
    const { data: teamMembers, error: teamError } = await supabase
      .from('team_members')
      .insert(seedData.teamMembers)
      .select();

    if (teamError) {
      console.error('Error seeding team members:', teamError);
    } else {
      console.log(`✅ Seeded ${teamMembers.length} team members`);
    }

    // Seed courses
    console.log('Seeding courses...');
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .insert(seedData.courses)
      .select();

    if (courseError) {
      console.error('Error seeding courses:', courseError);
    } else {
      console.log(`✅ Seeded ${courses.length} courses`);
    }

    // Seed study abroad programs
    console.log('Seeding study abroad programs...');
    const { data: studyAbroad, error: studyError } = await supabase
      .from('study_abroad')
      .insert(seedData.studyAbroad)
      .select();

    if (studyError) {
      console.error('Error seeding study abroad programs:', studyError);
    } else {
      console.log(`✅ Seeded ${studyAbroad.length} study abroad programs`);
    }

    // Seed contact info
    console.log('Seeding contact info...');
    const { data: contactInfo, error: contactError } = await supabase
      .from('contact_info')
      .insert([{
        address: seedData.contactInfo.address,
        phone: seedData.contactInfo.phone,
        email: seedData.contactInfo.email
      }])
      .select()
      .single();

    if (contactError) {
      console.error('Error seeding contact info:', contactError);
    } else {
      console.log('✅ Seeded contact info');

      // Seed social media links
      console.log('Seeding social media links...');
      const socialLinks = seedData.contactInfo.socials.map(social => ({
        contact_info_id: contactInfo.id,
        platform: social.platform,
        url: social.url
      }));

      const { data: socials, error: socialError } = await supabase
        .from('contact_info_socials')
        .insert(socialLinks)
        .select();

      if (socialError) {
        console.error('Error seeding social media links:', socialError);
      } else {
        console.log(`✅ Seeded ${socials.length} social media links`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    process.exit(0);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedData, seedDatabase };
