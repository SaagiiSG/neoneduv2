const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.log('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local')
  console.log('📝 To get this key:')
  console.log('1. Go to your Supabase dashboard')
  console.log('2. Settings → API')
  console.log('3. Copy the "service_role secret" key')
  console.log('4. Add it to .env.local as: SUPABASE_SERVICE_ROLE_KEY=your_key_here')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    console.log('🚀 Creating admin user...')
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'saranochir.s@gmail.com',
      password: 'Saagii21$',
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Saranochir Admin'
      }
    })

    if (error) {
      console.error('❌ Error creating user:', error.message)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', data.user.email)
    console.log('🆔 User ID:', data.user.id)
    console.log('🔑 Password: Saagii21$')
    console.log('')
    console.log('🎯 You can now sign in at http://localhost:3000')
    console.log('📝 Use these credentials:')
    console.log('   Email: saranochir.s@gmail.com')
    console.log('   Password: Saagii21$')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

createAdminUser()

