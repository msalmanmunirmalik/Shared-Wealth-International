// Admin Setup Script for Wealth Pioneers Network
// Run this script to set up admin access

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ewqwjduvjkddknpqpmfr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cXdqZHV2amtkZGtucHFwbWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNTczMTEsImV4cCI6MjA2NzkzMzMxMX0.v6MDuvJaCWbczDW8KWoUUSGKFeaF_pXXP2N5yHPxmtY";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function setupAdmin() {
  console.log('🔧 Setting up admin access for Wealth Pioneers Network...\n');

  try {
    // Step 1: Check if admin user exists
    const { data: adminUsers, error: fetchError } = await supabase
      .from('admin_users')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching admin users:', fetchError.message);
      return;
    }

    if (adminUsers && adminUsers.length > 0) {
      console.log('✅ Admin users already exist:');
      adminUsers.forEach(user => {
        console.log(`   - ${user.email} (Super Admin: ${user.is_super_admin})`);
      });
    } else {
      console.log('ℹ️  No admin users found. You need to create one manually.');
      console.log('\n📋 To create an admin user:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to Authentication → Users');
      console.log('3. Create a new user or note an existing user ID');
      console.log('4. Run this SQL in the SQL Editor:');
      console.log(`
INSERT INTO public.admin_users (user_id, email, is_super_admin) 
VALUES ('your-user-id-here', 'your-email@example.com', true);
      `);
    }

    // Step 2: Check content sections
    const { data: contentSections, error: contentError } = await supabase
      .from('content_sections')
      .select('*');

    if (contentError) {
      console.error('❌ Error fetching content sections:', contentError.message);
      return;
    }

    console.log('\n📝 Content sections found:');
    contentSections.forEach(section => {
      console.log(`   - ${section.title} (${section.section_key})`);
    });

    // Step 3: Check partners
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('*');

    if (partnersError) {
      console.error('❌ Error fetching partners:', partnersError.message);
      return;
    }

    console.log(`\n🏢 Partners found: ${partners.length}`);
    partners.forEach(partner => {
      console.log(`   - ${partner.name} (${partner.is_active ? 'Active' : 'Inactive'})`);
    });

    // Step 4: Check directors
    const { data: directors, error: directorsError } = await supabase
      .from('directors')
      .select('*');

    if (directorsError) {
      console.error('❌ Error fetching directors:', directorsError.message);
      return;
    }

    console.log(`\n👥 Directors found: ${directors.length}`);
    directors.forEach(director => {
      console.log(`   - ${director.name} (${director.position})`);
    });

    console.log('\n✅ Setup check completed!');
    console.log('\n🚀 Next steps:');
    console.log('1. Create an admin user (see instructions above)');
    console.log('2. Go to http://localhost:8080/admin');
    console.log('3. Sign in with your admin credentials');
    console.log('4. Start managing your content!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

// Run the setup
setupAdmin(); 