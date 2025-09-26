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

// Updated study abroad data with properly separated descriptions
const updatedStudyAbroadData = [
  {
    id: '0637deea-2bff-4db4-a1d4-ae0b99aa1f5f', // Australia
    description: 'World-class education in a globally recognized system',
    universities: '220+ universities and colleges available'
  },
  {
    id: '469b6e38-b8dd-44af-88ea-10267cc2c213', // Singapore
    description: 'Australian education, closer and more affordable',
    universities: 'James Cook University, Singapore'
  },
  {
    id: '635aa45d-5e2c-4a50-ae60-d7b14c11c2a2', // South Korea
    description: 'High-quality education at affordable cost',
    universities: 'Sejong University, SKKU'
  },
  {
    id: 'd0bbb9b4-d89c-4601-a9b1-d6b3c6156241', // Malaysia
    description: 'Affordable study with transfer pathways to Australia, UK, USA',
    universities: 'INTI international University'
  },
  {
    id: 'f91234b9-f6e7-47b9-91ae-2d2eea05f2e1', // China
    description: 'Full, half, and stipend scholarships available',
    universities: '800+ Universities and colleges'
  },
  {
    id: 'ec1aa816-dd69-4c3f-8178-130c675cec9c', // Hungary
    description: 'Begin studies without IELTS',
    universities: 'University of Miskolc'
  }
];

async function updateStudyAbroadData() {
  console.log('🔄 Updating study abroad data with separated descriptions...\n');

  for (const program of updatedStudyAbroadData) {
    try {
      console.log(`📝 Updating ${program.id}...`);
      
      // For now, we'll store the separated data in the description field with a delimiter
      // Format: "description|universities"
      const combinedDescription = `${program.description}|${program.universities}`;
      
      const { error } = await supabase
        .from('study_abroad')
        .update({ 
          description: combinedDescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', program.id);

      if (error) {
        console.error(`❌ Error updating ${program.id}:`, error.message);
      } else {
        console.log(`✅ Updated ${program.id}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${program.id}:`, error.message);
    }
  }

  console.log('\n🎉 Study abroad data update completed!');
  console.log('\n📋 The data is now stored in this format:');
  console.log('   description: "main description|universities info"');
  console.log('   This will be split properly in the frontend transformation.');
}

updateStudyAbroadData();


