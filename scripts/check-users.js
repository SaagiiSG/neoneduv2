const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Supabase credentials not found in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkUsers() {
  try {
    console.log('🔍 Checking users in your Supabase database...')
    console.log('')
    
    // Get current session to see if we're authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ Error getting session:', sessionError.message)
      return
    }

    if (session) {
      console.log('✅ You are currently signed in as:')
      console.log('📧 Email:', session.user.email)
      console.log('🆔 User ID:', session.user.id)
      console.log('📅 Created at:', new Date(session.user.created_at).toLocaleString())
      console.log('')
    } else {
      console.log('ℹ️  No active session found')
      console.log('')
    }

    // Try to get user profile data
    if (session) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.log('⚠️  Error fetching profile:', profileError.message)
      } else if (profile) {
        console.log('📋 User Profile Data:')
        console.log('   Name:', profile.name || 'Not set')
        console.log('   Role:', profile.role || 'Not set')
        console.log('   Updated at:', profile.updated_at ? new Date(profile.updated_at).toLocaleString() : 'Not set')
      } else {
        console.log('📋 No custom profile table found (this is normal)')
      }
    }

    console.log('')
    console.log('🌐 To see all users in Supabase Dashboard:')
    console.log('1. Go to: https://supabase.com/dashboard')
    console.log('2. Click your project')
    console.log('3. Click "Authentication" → "Users"')
    console.log('4. Or click "Table Editor" → "auth" → "users"')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

checkUsers()

