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

async function createTables() {
  console.log('🏗️  Creating tables in Supabase...\n');

  const tables = [
    {
      name: 'team_members',
      sql: `
        CREATE TABLE IF NOT EXISTS team_members (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          role VARCHAR(100) NOT NULL,
          image TEXT NOT NULL,
          bio TEXT NOT NULL CHECK (length(bio) <= 500),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'courses',
      sql: `
        CREATE TABLE IF NOT EXISTS courses (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          description TEXT NOT NULL CHECK (length(description) <= 1000),
          link TEXT NOT NULL CHECK (link ~ '^https?://.+'),
          category VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'study_abroad',
      sql: `
        CREATE TABLE IF NOT EXISTS study_abroad (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          program_name VARCHAR(200) NOT NULL,
          country VARCHAR(100) NOT NULL,
          description TEXT NOT NULL CHECK (length(description) <= 1000),
          link TEXT NOT NULL CHECK (link ~ '^https?://.+'),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'contact_info',
      sql: `
        CREATE TABLE IF NOT EXISTS contact_info (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          address TEXT NOT NULL CHECK (length(address) <= 500),
          phone VARCHAR(20) NOT NULL,
          email VARCHAR(255) NOT NULL CHECK (email ~ '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT unique_contact_info UNIQUE (id)
        );
      `
    },
    {
      name: 'contact_info_socials',
      sql: `
        CREATE TABLE IF NOT EXISTS contact_info_socials (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          contact_info_id UUID NOT NULL REFERENCES contact_info(id) ON DELETE CASCADE,
          platform VARCHAR(50) NOT NULL,
          url TEXT NOT NULL CHECK (url ~ '^https?://.+'),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(contact_info_id, platform)
        );
      `
    }
  ];

  // Create trigger function
  const triggerFunctionSQL = `
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
  `;

  try {
    console.log('🔧 Creating trigger function...');
    const { error: triggerError } = await supabase.rpc('exec_sql', { sql: triggerFunctionSQL });
    if (triggerError) {
      console.log('⚠️  Trigger function might already exist:', triggerError.message);
    } else {
      console.log('✅ Trigger function created');
    }
  } catch (error) {
    console.log('⚠️  Could not create trigger function (might need manual creation)');
  }

  // Create tables
  for (const table of tables) {
    try {
      console.log(`📋 Creating table: ${table.name}...`);
      
      // Use the REST API to execute SQL
      const { data, error } = await supabase
        .from('_sql')
        .select('*')
        .limit(1);

      // Try alternative approach - direct SQL execution
      const { error: sqlError } = await supabase.rpc('exec', { sql: table.sql });
      
      if (sqlError) {
        console.log(`⚠️  ${table.name}: ${sqlError.message}`);
      } else {
        console.log(`✅ ${table.name} created successfully`);
      }
    } catch (error) {
      console.log(`❌ Error creating ${table.name}:`, error.message);
    }
  }

  // Create triggers
  const triggers = [
    'CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
    'CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
    'CREATE TRIGGER update_study_abroad_updated_at BEFORE UPDATE ON study_abroad FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
    'CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();'
  ];

  for (const trigger of triggers) {
    try {
      const { error } = await supabase.rpc('exec', { sql: trigger });
      if (error) {
        console.log(`⚠️  Trigger might already exist: ${error.message}`);
      }
    } catch (error) {
      console.log(`⚠️  Could not create trigger: ${error.message}`);
    }
  }

  console.log('\n🎉 Table creation process completed!');
  console.log('\n📝 If tables weren\'t created automatically, you can run the SQL manually in your Supabase dashboard:');
  console.log('\n🔗 Go to: https://supabase.com/dashboard');
  console.log('📋 Navigate to: SQL Editor');
  console.log('📄 Copy and paste the SQL from: server/database/migrations/');
}

createTables();


