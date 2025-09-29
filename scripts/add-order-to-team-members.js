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

async function addOrderToTeamMembers() {
  console.log('👥 Adding order field to team members...\n');

  try {
    // Define the specific order with IDs
    const teamOrder = [
      { name: 'Dalantai.E', order: 1 },
      { name: 'Anar.P', order: 2 },
      { name: 'Enkhjin. G', order: 3 },
      { name: 'Kherlen. Sh', order: 4 },
      { name: 'Mandakhjargal.E', order: 5 },
      { name: 'Enkhjin. T', order: 6 },
      { name: 'Yumjir. Ts', order: 7 }
    ];

    console.log('📝 Manual Steps Required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run this SQL to add the order column:');
    console.log('');
    console.log('   ALTER TABLE team_members ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 999;');
    console.log('');
    console.log('4. Then update the order for each team member:');
    console.log('');

    for (const member of teamOrder) {
      console.log(`   UPDATE team_members SET display_order = ${member.order} WHERE name = '${member.name}';`);
    }

    console.log('');
    console.log('5. After running these commands, update the data fetching to use:');
    console.log('   .order("display_order", { ascending: true })');
    console.log('');
    console.log('🎉 This will make the ordering permanent and reliable!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addOrderToTeamMembers();

