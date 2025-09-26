const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');

    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@neonedu.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Admin User'
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ Admin user already exists!');
        console.log('📧 Email: admin@neonedu.com');
        console.log('🔑 Password: admin123');
        return;
      }
      throw error;
    }

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@neonedu.com');
    console.log('🔑 Password: admin123');
    console.log('🔗 Login at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdminUser();


