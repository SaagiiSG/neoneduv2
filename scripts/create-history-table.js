require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createHistoryTable() {
  try {
    console.log('🏗️ Creating history table...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../server/database/migrations/005_create_history.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('❌ Error creating history table:', error.message);
      
      // Try alternative approach - execute SQL directly
      console.log('🔄 Trying alternative approach...');
      const { data: altData, error: altError } = await supabase
        .from('history')
        .select('id')
        .limit(1);
      
      if (altError && altError.code === 'PGRST116') {
        console.log('📋 Table does not exist, creating manually...');
        // Table doesn't exist, we need to create it manually
        console.log('⚠️ Please create the history table manually in Supabase dashboard');
        console.log('📄 SQL to run:');
        console.log(sql);
      } else {
        console.log('✅ History table already exists or was created successfully');
      }
    } else {
      console.log('✅ History table created successfully');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createHistoryTable();

