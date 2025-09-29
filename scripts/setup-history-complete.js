require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please check your .env.local file has:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function setupHistoryTable() {
  try {
    console.log('🏗️ Setting up history table in Supabase...');
    console.log('📡 Connecting to:', supabaseUrl);
    
    // First, check if table exists
    console.log('🔍 Checking if history table exists...');
    const { data: existingData, error: checkError } = await supabase
      .from('history')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code === 'PGRST116') {
      console.log('📋 History table does not exist. Creating it...');
      
      // Create the table using raw SQL execution
      const createTableSQL = `
        -- Create history table
        CREATE TABLE IF NOT EXISTS history (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
            event TEXT NOT NULL CHECK (length(event) > 0 AND length(event) <= 2000),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_history_year ON history(year);
        CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at);
        
        -- Create updated_at trigger function (if it doesn't exist)
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
        
        -- Create updated_at trigger
        DROP TRIGGER IF EXISTS update_history_updated_at ON history;
        CREATE TRIGGER update_history_updated_at 
            BEFORE UPDATE ON history 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
      `;
      
      console.log('🔧 Executing table creation SQL...');
      
      // Try to execute the SQL using a different approach
      try {
        // Use the REST API to execute SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          },
          body: JSON.stringify({ sql: createTableSQL })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('✅ History table created successfully!');
        
      } catch (sqlError) {
        console.log('⚠️ Could not execute SQL automatically. Please create the table manually.');
        console.log('');
        console.log('📋 Manual Setup Required:');
        console.log('1. Go to: https://supabase.com/dashboard');
        console.log('2. Select your project');
        console.log('3. Go to SQL Editor');
        console.log('4. Run this SQL:');
        console.log('');
        console.log(createTableSQL);
        console.log('');
        return;
      }
      
    } else if (checkError) {
      console.error('❌ Error checking table:', checkError.message);
      return;
    } else {
      console.log('✅ History table already exists!');
    }
    
    // Now check if we have any data
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
      console.log(`✅ Found ${allData.length} existing history items`);
      allData.forEach(item => {
        console.log(`   - ${item.year}: ${item.event.substring(0, 50)}...`);
      });
    } else {
      console.log('📝 No data found. Adding sample data...');
      
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
        console.log(`✅ Added ${insertData.length} sample history items`);
        insertData.forEach(item => {
          console.log(`   - ${item.year}: ${item.event.substring(0, 50)}...`);
        });
      }
    }
    
    console.log('');
    console.log('🎉 History table setup complete!');
    console.log('📱 You can now:');
    console.log('   1. Go to your admin history page');
    console.log('   2. Refresh the browser');
    console.log('   3. Start managing history items');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('');
    console.log('🔧 Manual Setup Required:');
    console.log('Please follow the instructions in HISTORY_SETUP.md');
  }
}

setupHistoryTable();

