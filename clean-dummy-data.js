#!/usr/bin/env node

/**
 * Clean Dummy Data Script
 * 
 * This script removes dummy/sample data from the database while preserving
 * real companies and users from the Shared Wealth International network.
 * 
 * Real companies are identified from COMPANY_ACCOUNTS_SUMMARY.md
 */

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Database connection - uses production database
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:aGCQxaCa4eeEc1F13CgeGdf5egFdeaBd@junction.proxy.rlwy.net:58607/railway'
});

// Real companies from COMPANY_ACCOUNTS_SUMMARY.md
const REAL_COMPANIES = [
  'Beplay', 'Carsis Consulting', 'Consortio', 'Eternal Flame', 'Eupolisgrupa',
  'Fairbnb', 'Givey Ktd', 'Kula Eco Pads', 'LocoSoco PLC', 'Media Cultured',
  'NCDF', 'PadCare', 'Pathways Points', 'Purview Ltd', 'Research Automators',
  'SE Ghana', 'SEi Caledonia', 'SEi Middle East', 'SEi Tuatha', 'Solar Ear',
  'Spark', 'Supanova', 'Sustainable Roots', 'TTF', 'Terratai',
  'Universiti Malaya', 'Unyte Group', 'Washking', 'Whitby Shared Wealth'
];

// Real user emails from COMPANY_ACCOUNTS_SUMMARY.md
const REAL_USER_EMAILS = [
  'luis@ktalise.com', 'stephen@carsis.consulting', 'sam@consortiaco.io',
  'ken@africasgift.org', 'eupolisgrupa@gmail.com', 'emanuele.dalcarlo@fairbnb.coop',
  'nabikuja@gmail.com', 'lee.hawkins@asafgroup.org', 'james@locoso.co',
  'amjid@mediacultured.org', 'babatundeoralusi@gmail.com', 'ajinkya.dhariya@padcarelabs.com',
  'ike.udechuku@pathwaypoints.com', 'neil@givey.com', 'jonas@researchautomators.com',
  'execdir@seghana.net', 'thesoundsenseproject@gmail.com', 'amed@seiime.com',
  'sei.mariabel@gmail.com', 'strolltheworld@gmail.com', 'alex@sparkscot.com',
  'irma@supernovaeco.com', 'gugs@lifesciences-healthcare.com', 'andy.agathangelou@transparencytaskforce.org',
  'loraine@purview.co.uk', 'shakeelalpha@gmail.com', 'matt@terratai.com',
  'james.jamie@unyte.co.uk', 'washking@washkinggh.com', 'brianallanson@gmail.com',
  'msalmanmunirmalik@outlook.com', 'admin@sharedwealth.com'
];

// Dummy/sample data patterns to remove
const DUMMY_PATTERNS = {
  users: [
    'john.doe@example.com',
    'jane.smith@example.com', 
    'mike.johnson@example.com',
    'sarah.wilson@example.com',
    'david.brown@example.com',
    'lisa.davis@example.com'
  ],
  companies: [
    'EcoTech Solutions',
    'GreenEnergy Corp', 
    'Quantum Finance',
    'GreenTech Innovations',
    'DataFlow Systems',
    'BioMed Solutions',
    'Supernova Eco' // This is different from real "Supanova"
  ]
};

async function cleanDummyData() {
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Start transaction
    await client.query('BEGIN');

    console.log('\n🧹 Starting dummy data cleanup...');

    // 1. Remove dummy companies
    console.log('\n📊 Removing dummy companies...');
    const dummyCompaniesQuery = `
      DELETE FROM companies 
      WHERE name = ANY($1) 
      AND name NOT IN (SELECT unnest($2::text[]))
    `;
    
    const dummyCompaniesResult = await client.query(dummyCompaniesQuery, [
      DUMMY_PATTERNS.companies,
      REAL_COMPANIES
    ]);
    
    console.log(`   ✅ Removed ${dummyCompaniesResult.rowCount} dummy companies`);

    // 2. Remove dummy users
    console.log('\n👥 Removing dummy users...');
    const dummyUsersQuery = `
      DELETE FROM users 
      WHERE email = ANY($1) 
      AND email NOT IN (SELECT unnest($2::text[]))
    `;
    
    const dummyUsersResult = await client.query(dummyUsersQuery, [
      DUMMY_PATTERNS.users,
      REAL_USER_EMAILS
    ]);
    
    console.log(`   ✅ Removed ${dummyUsersResult.rowCount} dummy users`);

    // 3. Remove orphaned user_companies relationships
    console.log('\n🔗 Cleaning orphaned user-company relationships...');
    const orphanedRelationsQuery = `
      DELETE FROM user_companies 
      WHERE user_id NOT IN (SELECT id FROM users) 
      OR company_id NOT IN (SELECT id FROM companies)
    `;
    
    const orphanedRelationsResult = await client.query(orphanedRelationsQuery);
    console.log(`   ✅ Removed ${orphanedRelationsResult.rowCount} orphaned relationships`);

    // 4. Remove orphaned content
    console.log('\n📝 Cleaning orphaned content...');
    const orphanedContentQuery = `
      DELETE FROM unified_content 
      WHERE (author_id IS NOT NULL AND author_id NOT IN (SELECT id FROM users))
      OR (company_id IS NOT NULL AND company_id NOT IN (SELECT id FROM companies))
    `;
    
    const orphanedContentResult = await client.query(orphanedContentQuery);
    console.log(`   ✅ Removed ${orphanedContentResult.rowCount} orphaned content items`);

    // 5. Remove orphaned file uploads
    console.log('\n📁 Cleaning orphaned file uploads...');
    const orphanedFilesQuery = `
      DELETE FROM file_uploads 
      WHERE uploaded_by IS NOT NULL AND uploaded_by NOT IN (SELECT id FROM users)
    `;
    
    const orphanedFilesResult = await client.query(orphanedFilesQuery);
    console.log(`   ✅ Removed ${orphanedFilesResult.rowCount} orphaned file uploads`);

    // 6. Update company status for real companies
    console.log('\n🏢 Updating real company statuses...');
    const updateCompanyStatusQuery = `
      UPDATE companies 
      SET status = 'approved', is_active = true, is_verified = true
      WHERE name = ANY($1)
    `;
    
    const updateStatusResult = await client.query(updateCompanyStatusQuery, [REAL_COMPANIES]);
    console.log(`   ✅ Updated status for ${updateStatusResult.rowCount} real companies`);

    // 7. Update user verification status
    console.log('\n✅ Updating user verification status...');
    const updateUserStatusQuery = `
      UPDATE users 
      SET email_verified = true, is_active = true
      WHERE email = ANY($1)
    `;
    
    const updateUserResult = await client.query(updateUserStatusQuery, [REAL_USER_EMAILS]);
    console.log(`   ✅ Updated verification for ${updateUserResult.rowCount} real users`);

    // Commit transaction
    await client.query('COMMIT');
    console.log('\n🎉 Dummy data cleanup completed successfully!');

    // Show final statistics
    console.log('\n📊 Final Database Statistics:');
    
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    const companyCount = await client.query('SELECT COUNT(*) FROM companies');
    const userCompanyCount = await client.query('SELECT COUNT(*) FROM user_companies');
    const contentCount = await client.query('SELECT COUNT(*) FROM unified_content');
    
    console.log(`   👥 Users: ${userCount.rows[0].count}`);
    console.log(`   🏢 Companies: ${companyCount.rows[0].count}`);
    console.log(`   🔗 User-Company Links: ${userCompanyCount.rows[0].count}`);
    console.log(`   📝 Content Items: ${contentCount.rows[0].count}`);

    console.log('\n✅ Database is now clean and ready for real users!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the cleanup
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanDummyData()
    .then(() => {
      console.log('\n🎉 Cleanup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Cleanup failed:', error);
      process.exit(1);
    });
}

export { cleanDummyData };
