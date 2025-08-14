#!/usr/bin/env node

/**
 * Admin Setup Script for Shared Wealth International
 * This script creates the initial superadmin and admin accounts
 * 
 * Usage: node scripts/setup-admin.js
 * 
 * Prerequisites:
 * 1. Supabase project is running (cloud or local)
 * 2. Database migrations have been applied
 * 3. You have the Supabase URL and anon key
 */

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// Configuration - Update these with your Supabase details
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ewqwjduvjkddknpqpmfr.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cXdqZHV2amtkZGtucHFwbWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNTczMTEsImV4cCI6MjA2NzkzMzMxMX0.v6MDuvJaCWbczDW8KWoUUSGKFeaF_pXXP2N5yHPxmtY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupAdmin() {
  console.log('🚀 Shared Wealth International - Admin Setup');
  console.log('============================================\n');
  console.log(`🔗 Using Supabase: ${SUPABASE_URL}\n`);

  try {
    // Check if admin system exists
    console.log('📋 Checking database setup...');
    const { data: adminUsers, error: checkError } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);

    if (checkError) {
      console.error('❌ Database not ready. Please run the admin migration first.');
      console.error('Error:', checkError.message);
      return;
    }

    console.log('✅ Database is ready\n');

    // Get user email for superadmin
    const superadminEmail = await question('Enter email for Superadmin account: ');
    
    if (!superadminEmail) {
      console.log('❌ Email is required');
      return;
    }

    // Get user ID manually (since we can't use admin methods)
    const userId = await question('Enter the user ID (UUID) for this email: ');
    
    if (!userId) {
      console.log('❌ User ID is required');
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.log('❌ Invalid UUID format');
      return;
    }

    console.log(`✅ User ID accepted: ${userId}`);

    // Check if user is already an admin
    const { data: existingAdmin, error: adminCheckError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingAdmin) {
      console.log(`⚠️  User is already an admin with role: ${existingAdmin.role}`);
      const updateRole = await question('Do you want to update their role? (y/n): ');
      
      if (updateRole.toLowerCase() === 'y') {
        const newRole = await question('Enter new role (superadmin/admin/moderator/support): ');
        
        if (['superadmin', 'admin', 'moderator', 'support'].includes(newRole.toLowerCase())) {
          const { error: updateError } = await supabase
            .from('admin_users')
            .update({ 
              role: newRole.toLowerCase(),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

          if (updateError) {
            console.error('❌ Failed to update admin role:', updateError.message);
          } else {
            console.log(`✅ Admin role updated to: ${newRole}`);
          }
        } else {
          console.log('❌ Invalid role');
        }
      }
      return;
    }

    // Create superadmin account
    console.log('\n👑 Creating Superadmin account...');
    
    const superadminData = {
      user_id: userId,
      role: 'superadmin',
      permissions: {
        // Superadmin gets all permissions
        'users.view': true,
        'users.edit': true,
        'users.delete': true,
        'users.suspend': true,
        'users.activate': true,
        'companies.view': true,
        'companies.approve': true,
        'companies.reject': true,
        'companies.edit': true,
        'companies.suspend': true,
        'companies.delete': true,
        'content.view': true,
        'content.create': true,
        'content.edit': true,
        'content.delete': true,
        'content.publish': true,
        'funding.view': true,
        'funding.approve': true,
        'funding.reject': true,
        'funding.edit': true,
        'learning.view': true,
        'learning.create': true,
        'learning.edit': true,
        'learning.delete': true,
        'forum.view': true,
        'forum.moderate': true,
        'forum.delete': true,
        'forum.ban': true,
        'system.view': true,
        'system.edit': true,
        'system.logs': true,
        'system.backup': true,
        'admin.view': true,
        'admin.create': true,
        'admin.edit': true,
        'admin.delete': true,
        'analytics.view': true,
        'reports.generate': true,
        'reports.export': true
      },
      is_active: true,
      created_by: userId
    };

    const { data: superadmin, error: superadminError } = await supabase
      .from('admin_users')
      .insert([superadminData])
      .select()
      .single();

    if (superadminError) {
      console.error('❌ Failed to create superadmin:', superadminError.message);
      return;
    }

    console.log('✅ Superadmin account created successfully!');
    console.log(`   User ID: ${superadmin.user_id}`);
    console.log(`   Role: ${superadmin.role}`);
    console.log(`   Admin ID: ${superadmin.id}`);

    // Create admin dashboard settings
    console.log('\n⚙️  Creating admin dashboard settings...');
    
    const dashboardSettings = {
      admin_user_id: superadmin.id,
      dashboard_config: {
        default_view: 'overview',
        widgets: ['recent_activity', 'pending_approvals', 'system_stats'],
        theme: 'light'
      },
      preferences: {
        notifications: true,
        email_alerts: true,
        dashboard_refresh: 30000
      }
    };

    const { error: dashboardError } = await supabase
      .from('admin_dashboard_settings')
      .insert([dashboardSettings]);

    if (dashboardError) {
      console.error('⚠️  Failed to create dashboard settings:', dashboardError.message);
    } else {
      console.log('✅ Admin dashboard settings created');
    }

    // Log the admin creation
    console.log('\n📝 Logging admin creation activity...');
    
    const { error: logError } = await supabase.rpc('log_admin_action', {
      admin_user_uuid: superadmin.id,
      action_text: 'Account created',
      entity_type_param: 'admin_user',
      entity_id_param: superadmin.id
    });

    if (logError) {
      console.error('⚠️  Failed to log activity:', logError.message);
    } else {
      console.log('✅ Activity logged');
    }

    console.log('\n🎉 Superadmin setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Log in to the platform with the superadmin account');
    console.log('   2. Access the admin dashboard at /admin');
    console.log('   3. Create additional admin accounts as needed');
    console.log('   4. Configure platform settings and permissions');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    rl.close();
  }
}

async function createAdditionalAdmin() {
  console.log('👥 Create Additional Admin Account');
  console.log('==================================\n');

  try {
    const email = await question('Enter email for new admin account: ');
    
    if (!email) {
      console.log('❌ Email is required');
      return;
    }

    const userId = await question('Enter the user ID (UUID) for this email: ');
    
    if (!userId) {
      console.log('❌ User ID is required');
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.log('❌ Invalid UUID format');
      return;
    }

    console.log(`✅ User ID accepted: ${userId}`);

    // Check if user is already an admin
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingAdmin) {
      console.log(`⚠️  User is already an admin with role: ${existingAdmin.role}`);
      return;
    }

    // Select role
    console.log('\n📋 Available roles:');
    console.log('   1. admin - Full platform management');
    console.log('   2. moderator - Content and forum moderation');
    console.log('   3. support - User support and basic management');
    
    const roleChoice = await question('Select role (1-3): ');
    
    let role, permissions;
    
    switch (roleChoice) {
      case '1':
        role = 'admin';
        permissions = {
          'users.view': true,
          'users.edit': true,
          'users.suspend': true,
          'companies.view': true,
          'companies.approve': true,
          'companies.reject': true,
          'companies.edit': true,
          'content.view': true,
          'content.create': true,
          'content.edit': true,
          'content.publish': true,
          'funding.view': true,
          'funding.approve': true,
          'funding.reject': true,
          'learning.view': true,
          'learning.create': true,
          'learning.edit': true,
          'forum.view': true,
          'forum.moderate': true,
          'analytics.view': true,
          'reports.generate': true
        };
        break;
      case '2':
        role = 'moderator';
        permissions = {
          'users.view': true,
          'companies.view': true,
          'content.view': true,
          'content.edit': true,
          'forum.view': true,
          'forum.moderate': true,
          'forum.delete': true,
          'forum.ban': true
        };
        break;
      case '3':
        role = 'support';
        permissions = {
          'users.view': true,
          'companies.view': true,
          'content.view': true,
          'learning.view': true,
          'forum.view': true
        };
        break;
      default:
        console.log('❌ Invalid role selection');
        return;
    }

    // Create admin account
    console.log(`\n👤 Creating ${role} account...`);
    
    const adminData = {
      user_id: userId,
      role: role,
      permissions: permissions,
      is_active: true,
      created_by: userId
    };

    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .insert([adminData])
      .select()
      .single();

    if (adminError) {
      console.error('❌ Failed to create admin:', adminError.message);
      return;
    }

    console.log('✅ Admin account created successfully!');
    console.log(`   User ID: ${admin.user_id}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Admin ID: ${admin.id}`);

  } catch (error) {
    console.error('❌ Failed to create admin:', error.message);
  }
}

async function main() {
  console.log('🔧 Shared Wealth International - Admin Management');
  console.log('================================================\n');
  
  console.log('Available options:');
  console.log('1. Setup initial superadmin');
  console.log('2. Create additional admin account');
  console.log('3. Exit');
  
  const choice = await question('\nSelect option (1-3): ');
  
  switch (choice) {
    case '1':
      await setupAdmin();
      break;
    case '2':
      await createAdditionalAdmin();
      break;
    case '3':
      console.log('👋 Goodbye!');
      break;
    default:
      console.log('❌ Invalid option');
  }
  
  rl.close();
}

// Run the script
main().catch(console.error);
