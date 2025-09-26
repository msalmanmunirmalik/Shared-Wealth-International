#!/usr/bin/env node

/**
 * Company Account Verification Script
 * Verifies all company accounts are properly created and active
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sharedwealth',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function verifyAccounts() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verifying Company Accounts');
    console.log('============================');
    console.log('');

    // Get all director users with their companies
    const directorUsers = await client.query(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.role,
        u.is_active,
        u.email_verified,
        u.created_at,
        c.name as company_name,
        c.location,
        c.website,
        c.countries,
        c.status as company_status,
        uc.role as company_role,
        uc.position,
        uc.status as user_company_status
      FROM users u
      LEFT JOIN user_companies uc ON u.id = uc.user_id
      LEFT JOIN companies c ON uc.company_id = c.id
      WHERE u.role = 'director'
      ORDER BY c.name, u.email
    `);

    console.log(`📊 Total director accounts found: ${directorUsers.rows.length}`);
    console.log('');

    if (directorUsers.rows.length === 0) {
      console.log('❌ No director accounts found!');
      return;
    }

    // Group by company
    const companies = {};
    directorUsers.rows.forEach(user => {
      const companyName = user.company_name || 'No Company';
      if (!companies[companyName]) {
        companies[companyName] = [];
      }
      companies[companyName].push(user);
    });

    console.log(`🏢 Companies with accounts: ${Object.keys(companies).length}`);
    console.log('');

    // Display results by company
    Object.entries(companies).forEach(([companyName, users]) => {
      console.log(`🏢 ${companyName}`);
      console.log(`   Status: ${users[0]?.company_status || 'Unknown'}`);
      console.log(`   Location: ${users[0]?.location || 'Not specified'}`);
      console.log(`   Website: ${users[0]?.website || 'Not specified'}`);
      console.log(`   Countries: ${users[0]?.countries ? users[0].countries.join(', ') : 'Not specified'}`);
      console.log(`   Users (${users.length}):`);
      
      users.forEach(user => {
        const status = user.is_active ? '✅ Active' : '❌ Inactive';
        const verified = user.email_verified ? '✅ Verified' : '❌ Unverified';
        console.log(`      • ${user.email} (${user.first_name} ${user.last_name})`);
        console.log(`        Role: ${user.role} | Company Role: ${user.company_role} | Position: ${user.position}`);
        console.log(`        Status: ${status} | Email: ${verified} | User-Company: ${user.user_company_status}`);
      });
      console.log('');
    });

    // Summary statistics
    const activeUsers = directorUsers.rows.filter(u => u.is_active);
    const verifiedUsers = directorUsers.rows.filter(u => u.email_verified);
    const activeCompanies = directorUsers.rows.filter(u => u.company_status === 'approved');
    const activeUserCompanies = directorUsers.rows.filter(u => u.user_company_status === 'active');

    console.log('📊 VERIFICATION SUMMARY');
    console.log('=======================');
    console.log(`✅ Active Users: ${activeUsers.length}/${directorUsers.rows.length}`);
    console.log(`✅ Email Verified: ${verifiedUsers.length}/${directorUsers.rows.length}`);
    console.log(`✅ Active Companies: ${activeCompanies.length}/${directorUsers.rows.length}`);
    console.log(`✅ Active User-Company Links: ${activeUserCompanies.length}/${directorUsers.rows.length}`);
    console.log('');

    // Check for issues
    const issues = [];
    directorUsers.rows.forEach(user => {
      if (!user.is_active) {
        issues.push(`User ${user.email} is inactive`);
      }
      if (!user.email_verified) {
        issues.push(`User ${user.email} email not verified`);
      }
      if (!user.company_name) {
        issues.push(`User ${user.email} has no company association`);
      }
      if (user.company_status !== 'approved') {
        issues.push(`Company ${user.company_name} is not approved`);
      }
      if (user.user_company_status !== 'active') {
        issues.push(`User-Company link for ${user.email} is not active`);
      }
    });

    if (issues.length > 0) {
      console.log('⚠️  ISSUES FOUND:');
      issues.forEach(issue => console.log(`   • ${issue}`));
      console.log('');
    } else {
      console.log('🎉 ALL ACCOUNTS ARE PROPERLY CONFIGURED!');
      console.log('');
    }

    // Password verification reminder
    console.log('🔐 PASSWORD INFORMATION');
    console.log('======================');
    console.log('All company accounts use the password: Sharedwealth123');
    console.log('Users can log in at: https://sharedwealth.net/login');
    console.log('');

  } catch (error) {
    console.error('❌ Error verifying accounts:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run verification
verifyAccounts().catch(console.error);
