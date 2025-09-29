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

async function createHistoryTable() {
  try {
    console.log('🏗️ Setting up history table...');
    console.log('📡 Connecting to:', supabaseUrl);
    
    // Check if table exists first
    console.log('🔍 Checking if history table exists...');
    const { data: existingData, error: checkError } = await supabase
      .from('history')
      .select('id')
      .limit(1);
    
    if (existingData) {
      console.log('✅ History table already exists!');
      return;
    }
    
    if (checkError && checkError.code === 'PGRST116') {
      console.log('📋 History table does not exist.');
      console.log('');
      console.log('🔧 MANUAL SETUP REQUIRED:');
      console.log('Since Supabase client cannot execute DDL commands, you need to create the table manually.');
      console.log('');
      console.log('📋 Follow these steps:');
      console.log('1. Go to: https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor (left sidebar)');
      console.log('4. Copy and paste this SQL code:');
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
      console.log('-- Create indexes for better performance');
      console.log('CREATE INDEX IF NOT EXISTS idx_history_year ON history(year);');
      console.log('CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at);');
      console.log('');
      console.log('-- Create updated_at trigger function (if it doesn\'t exist)');
      console.log('CREATE OR REPLACE FUNCTION update_updated_at_column()');
      console.log('RETURNS TRIGGER AS $$');
      console.log('BEGIN');
      console.log('    NEW.updated_at = NOW();');
      console.log('    RETURN NEW;');
      console.log('END;');
      console.log('$$ language \'plpgsql\';');
      console.log('');
      console.log('-- Create updated_at trigger');
      console.log('DROP TRIGGER IF EXISTS update_history_updated_at ON history;');
      console.log('CREATE TRIGGER update_history_updated_at ');
      console.log('    BEFORE UPDATE ON history ');
      console.log('    TRIGGER');
      console.log('    EXECUTE FUNCTION update_updated_at_column();');
      console.log('```');
      console.log('');
      console.log('5. Click "Run" to execute the SQL');
      console.log('6. Refresh your admin panel and the history page should work!');
      console.log('');
      console.log('🌟 After creating the table, you can run:');
      console.log('node scripts/setup-history-with-real-data.js');
      console.log('to populate it with sample company timeline data.');
    } else {
      console.log('❌ Unexpected error:', checkError?.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createHistoryTable();
