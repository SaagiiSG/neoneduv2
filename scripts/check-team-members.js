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

async function checkTeamMembers() {
  console.log('👥 Checking team members in database...\n');

  try {
    const { data: teamMembers, error } = await supabase
      .from('team_members')
      .select('id, name, role')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching team members:', error);
      return;
    }

    console.log(`📋 Found ${teamMembers.length} team members:`);
    console.log('');
    
    teamMembers.forEach((member, index) => {
      console.log(`${index + 1}. ID: ${member.id}`);
      console.log(`   Name: "${member.name}"`);
      console.log(`   Role: "${member.role}"`);
      console.log('');
    });

    console.log('🎯 Current names in database:');
    const names = teamMembers.map(m => `"${m.name}"`).join(', ');
    console.log(names);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkTeamMembers();

