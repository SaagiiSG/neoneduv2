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

// Real timeline data from the company
const realTimelineData = [
  { year: 2015, event: "Founded in Ulaanbaatar, Mongolia" },
  { year: 2017, event: "Began sending students to Australia" },
  { year: 2022, event: "Launched English language teaching programs" },
  { year: 2023, event: "Expanded student placements to Canada and the USA" },
  { year: 2025, event: "Added study destination in China, South Korea, Singapore, Malaysia, and Hungary, and introduced Chinese language teaching" }
];

async function setupHistoryWithRealData() {
  try {
    console.log('🏗️ Setting up history table with REAL company data...');
    console.log('📡 Connecting to:', supabaseUrl);
    
    // First, check if table exists
    console.log('🔍 Checking if history table exists...');
    const { data: existingData, error: checkError } = await supabase
      .from('history')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code === 'PGRST116') {
      console.log('📋 History table does not exist. Please create it first.');
      console.log('');
      console.log('🔧 MANUAL SETUP REQUIRED:');
      console.log('1. Go to: https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Run this SQL:');
      console.log('');
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
      console.log('CREATE TRIGGER update_history_updated_at');
      console.log('    BEFORE UPDATE ON history');
      console.log('    FOR EACH ROW');
      console.log('    EXECUTE FUNCTION update_updated_at_column();');
      console.log('');
      console.log('After creating the table, run this script again to insert the real data.');
      return;
    } else if (checkError) {
      console.error('❌ Error checking table:', checkError.message);
      return;
    } else {
      console.log('✅ History table exists!');
    }
    
    // Check existing data
    console.log('📊 Checking existing data...');
    const { data: allData, error: dataError } = await supabase
      .from('history')
      .select('*')
      .order('year', { ascending: false });
    
    if (dataError) {
      console.error('❌ Error fetching data:', dataError.message);
      return;
    }
    
    if (allData && allData.length > 0) {
      console.log(`📋 Found ${allData.length} existing history items:`);
      allData.forEach(item => {
        console.log(`   - ${item.year}: ${item.event}`);
      });
      
      console.log('');
      console.log('🔄 Do you want to replace with real company data?');
      console.log('This will delete existing data and insert the real timeline.');
      
      // For now, let's just add the real data without deleting existing
      console.log('📝 Adding real company timeline data...');
    } else {
      console.log('📝 No existing data found. Adding real company timeline...');
    }
    
    // Insert the real timeline data
    const { data: insertData, error: insertError } = await supabase
      .from('history')
      .insert(realTimelineData)
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting real data:', insertError.message);
    } else {
      console.log(`✅ Successfully added ${insertData.length} real timeline items:`);
      insertData.forEach(item => {
        console.log(`   - ${item.year}: ${item.event}`);
      });
    }
    
    // Show final count
    const { data: finalData, error: finalError } = await supabase
      .from('history')
      .select('*')
      .order('year', { ascending: false });
    
    if (!finalError && finalData) {
      console.log('');
      console.log(`🎉 Total history items: ${finalData.length}`);
      console.log('📱 You can now:');
      console.log('   1. Go to your admin history page');
      console.log('   2. Refresh the browser');
      console.log('   3. See your real company timeline!');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupHistoryWithRealData();

