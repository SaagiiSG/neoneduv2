const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Supabase credentials not found in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyUser() {
  try {
    console.log('🔍 Verifying user creation...')
    console.log('📧 Looking for: saranochir.s@gmail.com')
    console.log('')
    
    // Try to sign in with the credentials to verify they exist
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'saranochir.s@gmail.com',
      password: 'Saagii21$'
    })

    if (error) {
      console.log('❌ Sign in failed:', error.message)
      
      if (error.message.includes('Invalid login credentials')) {
        console.log('')
        console.log('💡 This could mean:')
        console.log('   1. User was not created successfully')
        console.log('   2. Password is incorrect')
        console.log('   3. Email needs confirmation')
        console.log('')
        console.log('🔄 Let\'s try creating the user again...')
        
        // Try to create the user again
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: 'saranochir.s@gmail.com',
          password: 'Saagii21$',
          options: {
            data: {
              role: 'admin',
              name: 'Saranochir Admin'
            }
          }
        })

        if (signupError) {
          console.log('❌ Signup failed:', signupError.message)
        } else {
          console.log('✅ User created successfully!')
          console.log('📧 Email:', signupData.user.email)
          console.log('🆔 User ID:', signupData.user.id)
        }
      }
      return
    }

    console.log('✅ User verification successful!')
    console.log('📧 Email:', data.user.email)
    console.log('🆔 User ID:', data.user.id)
    console.log('📅 Created at:', new Date(data.user.created_at).toLocaleString())
    console.log('')
    console.log('🎯 Your user exists and can sign in!')
    console.log('🌐 Visit http://localhost:3000 to test the app')
    
    // Sign out after verification
    await supabase.auth.signOut()
    console.log('🔒 Signed out after verification')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

verifyUser()

