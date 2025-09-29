require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const sampleHistoryData = [
  {
    year: 2018,
    event: "Founded Neon Edu with a vision to connect Mongolian students with world-class education opportunities abroad."
  },
  {
    year: 2019,
    event: "Established partnerships with universities in Australia and South Korea, our first international education programs."
  },
  {
    year: 2020,
    event: "Launched our IELTS preparation courses and English language programs to support student success in international markets."
  },
  {
    year: 2021,
    event: "Expanded our network to include universities in Singapore and Malaysia, offering more diverse study options for students."
  },
  {
    year: 2022,
    event: "Introduced our Academic English program, designed specifically for students preparing for university-level studies abroad."
  },
  {
    year: 2023,
    event: "Launched our General English courses to support students of all levels, from beginners to advanced learners."
  },
  {
    year: 2024,
    event: "Established new partnerships with universities in China and Hungary, significantly expanding our global education network."
  },
  {
    year: 2025,
    event: "Continuing to grow and innovate, connecting more Mongolian students with their dream international education opportunities."
  }
];

async function populateHistoryData() {
  try {
    console.log('🏗️ Populating history table with sample data...');
    console.log('📡 Connecting to:', supabaseUrl);
    
    // First, check if table exists
    console.log('🔍 Checking if history table exists...');
    const { data: existingData, error: checkError } = await supabase
      .from('history')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code === 'PGRST116') {
      console.log('❌ History table does not exist yet.');
      console.log('');
      console.log('🔧 Please create the table first by running in Supabase SQL Editor:');
      console.log('');
      console.log('```sql');
      console.log('-- Create history table');
      console.log('CREATE TABLE IF NOT EXISTS history (');
      console.log('    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
      console.log('    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),');
      console.log('    event TEXT NOT NULL CHECK (length(event) > 0 AND length(event) <= 2000),');
      console.log('    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),');
      console.log('    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
      console.log(');');
      console.log('');
      console.log('-- Create indexes');
      console.log('CREATE INDEX IF NOT EXISTS idx_history_year ON history(year);');
      console.log('CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at);');
      console.log('');
      console.log('-- Create trigger function');
      console.log('CREATE OR REPLACE FUNCTION update_updated_at_column()');
      console.log('RETURNS TRIGGER AS $$');
      console.log('BEGIN');
      console.log('    NEW.updated_at = NOW();');
      console.log('    RETURN NEW;');
      console.log('END;');
      console.log('$$ language \'plpgsql\';');
      console.log('');
      console.log('-- Create trigger');
      console.log('DROP TRIGGER IF EXISTS update_history_updated_at ON history;');
      console.log('CREATE TRIGGER update_history_updated_at ');
      console.log('    BEFORE UPDATE ON history ');
      console.log('    FOR EACH ROW ');
      console.log('    EXECUTE FUNCTION update_updated_at_column();');
      console.log('```');
      console.log('');
      console.log('After creating the table, run this script again to populate it with sample data.');
      return;
    }
    
    if (existingData) {
      // Check if table already has data
      const { data: existingItems, error: countError } = await supabase
        .from('history')
        .select('id');
      
      if (countError) {
        console.error('❌ Error checking existing data:', countError.message);
        return;
      }
      
      if (existingItems && existingItems.length > 0) {
        console.log(`✅ History table already has ${existingItems.length} items.`);
        console.log('🔄 Adding new sample items...');
      } else {
        console.log('📋 History table is empty. Adding sample data...');
      }
    }
    
    // Insert sample data
    console.log('📝 Inserting sample history items...');
    const { data, error } = await supabase
      .from('history')
      .insert(sampleHistoryData)
      .select();
    
    if (error) {
      console.error('❌ Error inserting sample data:', error.message);
      return;
    }
    
    console.log(`✅ Successfully added ${data.length} history items!`);
    console.log('');
    console.log('🎉 Timeline Items Added:');
    data.forEach((item, index) => {
      console.log(`${index + 1}. ${item.year}: ${item.event.substring(0, 80)}${item.event.length > 80 ? '...' : ''}`);
    });
    console.log('');
    console.log('🌟 Now go to your admin panel and refresh the history page to see all items!');
    console.log('🔗 URL: http://localhost:3000/admin/history');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

populateHistoryData();