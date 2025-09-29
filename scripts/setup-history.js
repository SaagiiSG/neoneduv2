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

async function setupHistory() {
  try {
    console.log('🏗️ Setting up history table...');
    
    // Try to create the table using a different approach
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('📋 History table does not exist.');
      console.log('🔧 Please create it manually in your Supabase dashboard:');
      console.log('');
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
      console.log('-- Insert sample data');
      console.log('INSERT INTO history (year, event) VALUES');
      console.log('(2024, \'Neon Edu was founded with a vision to provide quality education services\'),');
      console.log('(2023, \'Initial planning and development of educational programs began\'),');
      console.log('(2022, \'Research and market analysis for educational services completed\');');
      console.log('');
      console.log('After creating the table, refresh the admin history page.');
      
    } else if (error) {
      console.error('❌ Error accessing history table:', error.message);
    } else {
      console.log('✅ History table exists and is accessible');
      console.log(`📊 Found ${data.length} existing records`);
      
      if (data.length === 0) {
        console.log('📝 Adding sample data...');
        const sampleData = [
          { year: 2024, event: 'Neon Edu was founded with a vision to provide quality education services' },
          { year: 2023, event: 'Initial planning and development of educational programs began' },
          { year: 2022, event: 'Research and market analysis for educational services completed' }
        ];
        
        const { data: insertData, error: insertError } = await supabase
          .from('history')
          .insert(sampleData)
          .select();
        
        if (insertError) {
          console.error('❌ Error inserting sample data:', insertError.message);
        } else {
          console.log('✅ Sample data inserted successfully');
          console.log(`📊 Added ${insertData.length} history items`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupHistory();

