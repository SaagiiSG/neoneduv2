const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Supabase credentials not found in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createAdminUser() {
  try {
    console.log('🚀 Creating admin user with signup...')
    console.log('📧 Email: saranochir.s@gmail.com')
    console.log('🔑 Password: Saagii21$')
    console.log('')
    
    const { data, error } = await supabase.auth.signUp({
      email: 'saranochir.s@gmail.com',
      password: 'Saagii21$',
      options: {
        data: {
          role: 'admin',
          name: 'Saranochir Admin'
        }
      }
    })

    if (error) {
      console.error('❌ Error creating user:', error.message)
      
      if (error.message.includes('already registered')) {
        console.log('')
        console.log('ℹ️  User already exists. You can now sign in at http://localhost:3000')
        console.log('📝 Use these credentials:')
        console.log('   Email: saranochir.s@gmail.com')
        console.log('   Password: Saagii21$')
      }
      return
    }

    if (data.user && !data.session) {
      console.log('✅ Admin user created successfully!')
      console.log('📧 Email:', data.user.email)
      console.log('🆔 User ID:', data.user.id)
      console.log('')
      console.log('📧 Check your email to confirm the account')
      console.log('🎯 After confirmation, you can sign in at http://localhost:3000')
      console.log('📝 Use these credentials:')
      console.log('   Email: saranochir.s@gmail.com')
      console.log('   Password: Saagii21$')
    } else if (data.session) {
      console.log('✅ Admin user created and signed in!')
      console.log('📧 Email:', data.user.email)
      console.log('🆔 User ID:', data.user.id)
      console.log('')
      console.log('🎯 You are now signed in! Visit http://localhost:3000')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

createAdminUser()

