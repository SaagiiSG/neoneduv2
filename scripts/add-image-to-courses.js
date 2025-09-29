const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addImageColumn() {
  console.log('🖼️  Adding image column to courses table...\n');

  try {
    // Read the migration SQL
    const fs = require('fs');
    const path = require('path');
    const migrationPath = path.join(__dirname, '..', 'server', 'database', 'migrations', '006_add_image_to_courses.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      console.error('❌ Error running migration:', error);
      process.exit(1);
    }

    console.log('✅ Successfully added image column to courses table!');
    console.log('📝 The courses table now supports image uploads.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

addImageColumn();

