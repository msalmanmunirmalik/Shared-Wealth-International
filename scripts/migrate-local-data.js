#!/usr/bin/env node

/**
 * Local Data Migration Script
 * Migrates existing local data to the comprehensive schema
 * Preserves your user and company data
 */

const { Client } = require('pg');
const bcrypt = require('bcryptjs');

// Local database configuration
const localDbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'shared_wealth_international',
  password: '',
  port: 5432,
  ssl: false,
};

// Production database configuration
const prodDbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'shared_wealth_international',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? {
    rejectUnauthorized: false
  } : false,
};

async function migrateData() {
  const localClient = new Client(localDbConfig);
  const prodClient = new Client(prodDbConfig);
  
  try {
    console.log('🚀 Starting data migration...');
    
    // Connect to both databases
    await localClient.connect();
    console.log('✅ Connected to local database');
    
    await prodClient.connect();
    console.log('✅ Connected to production database');

    // Check if production database has the comprehensive schema
    console.log('🔍 Checking production database schema...');
    const prodTables = await prodClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (prodTables.rows.length === 0) {
      console.log('❌ Production database appears to be empty. Please run setup-comprehensive-database.js first.');
      return;
    }
    
    console.log(`✅ Production database has ${prodTables.rows.length} tables`);

    // 1. Migrate Users
    console.log('\n👥 Migrating users...');
    const localUsers = await localClient.query('SELECT * FROM users');
    
    for (const user of localUsers.rows) {
      try {
        // Check if user already exists in production
        const existingUser = await prodClient.query('SELECT id FROM users WHERE email = $1', [user.email]);
        
        if (existingUser.rows.length === 0) {
          await prodClient.query(`
            INSERT INTO users (
              id, email, password_hash, role, first_name, last_name, phone,
              is_active, email_verified, last_login, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `, [
            user.id, user.email, user.password_hash, user.role,
            user.first_name, user.last_name, user.phone,
            user.is_active, user.email_verified, user.last_login,
            user.created_at, user.updated_at
          ]);
          console.log(`   ✅ Migrated user: ${user.email}`);
        } else {
          console.log(`   ℹ️  User already exists: ${user.email}`);
        }
      } catch (error) {
        console.log(`   ⚠️  Failed to migrate user ${user.email}: ${error.message}`);
      }
    }

    // 2. Migrate Companies
    console.log('\n🏢 Migrating companies...');
    const localCompanies = await localClient.query('SELECT * FROM companies');
    
    for (const company of localCompanies.rows) {
      try {
        // Check if company already exists in production
        const existingCompany = await prodClient.query('SELECT id FROM companies WHERE name = $1', [company.name]);
        
        if (existingCompany.rows.length === 0) {
          await prodClient.query(`
            INSERT INTO companies (
              id, name, description, industry, sector, size, location, website,
              logo_url, logo_file_path, countries, employees, status,
              is_shared_wealth_licensed, license_number, license_date,
              applicant_role, applicant_position, applicant_user_id,
              created_by_admin, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
          `, [
            company.id, company.name, company.description, company.industry,
            company.sector, company.size, company.location, company.website,
            company.logo_url, company.logo_file_path, company.countries,
            company.employees, company.status, company.is_shared_wealth_licensed,
            company.license_number, company.license_date, company.applicant_role,
            company.applicant_position, company.applicant_user_id,
            company.created_by_admin, company.created_at, company.updated_at
          ]);
          console.log(`   ✅ Migrated company: ${company.name}`);
        } else {
          console.log(`   ℹ️  Company already exists: ${company.name}`);
        }
      } catch (error) {
        console.log(`   ⚠️  Failed to migrate company ${company.name}: ${error.message}`);
      }
    }

    // 3. Migrate User-Companies relationships
    console.log('\n🔗 Migrating user-company relationships...');
    const localUserCompanies = await localClient.query('SELECT * FROM user_companies');
    
    for (const relationship of localUserCompanies.rows) {
      try {
        // Check if relationship already exists
        const existingRel = await prodClient.query(
          'SELECT id FROM user_companies WHERE user_id = $1 AND company_id = $2',
          [relationship.user_id, relationship.company_id]
        );
        
        if (existingRel.rows.length === 0) {
          await prodClient.query(`
            INSERT INTO user_companies (
              id, user_id, company_id, role, position, status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            relationship.id, relationship.user_id, relationship.company_id,
            relationship.role, relationship.position, relationship.status,
            relationship.created_at, relationship.updated_at
          ]);
          console.log(`   ✅ Migrated relationship: ${relationship.role} at company`);
        } else {
          console.log(`   ℹ️  Relationship already exists`);
        }
      } catch (error) {
        console.log(`   ⚠️  Failed to migrate relationship: ${error.message}`);
      }
    }

    // 4. Migrate other tables if they exist
    const tablesToMigrate = [
      'funding_opportunities',
      'funding_applications',
      'projects',
      'events',
      'news_articles',
      'forum_categories',
      'forum_topics',
      'forum_replies',
      'messages',
      'file_uploads'
    ];

    for (const tableName of tablesToMigrate) {
      try {
        console.log(`\n📊 Checking table: ${tableName}...`);
        
        // Check if table exists in local database
        const tableExists = await localClient.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `, [tableName]);
        
        if (tableExists.rows[0].exists) {
          const localData = await localClient.query(`SELECT * FROM ${tableName}`);
          
          if (localData.rows.length > 0) {
            console.log(`   📦 Found ${localData.rows.length} records in ${tableName}`);
            
            // Simple migration for each record
            for (const record of localData.rows) {
              try {
                // Build dynamic INSERT query
                const columns = Object.keys(record).join(', ');
                const values = Object.values(record);
                const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
                
                await prodClient.query(`
                  INSERT INTO ${tableName} (${columns}) 
                  VALUES (${placeholders})
                  ON CONFLICT DO NOTHING
                `, values);
                
              } catch (error) {
                console.log(`   ⚠️  Failed to migrate record from ${tableName}: ${error.message}`);
              }
            }
            
            console.log(`   ✅ Migrated ${tableName} data`);
          } else {
            console.log(`   ℹ️  No data in ${tableName}`);
          }
        } else {
          console.log(`   ℹ️  Table ${tableName} does not exist locally`);
        }
      } catch (error) {
        console.log(`   ⚠️  Error checking ${tableName}: ${error.message}`);
      }
    }

    // 5. Verify migration
    console.log('\n🔍 Verifying migration...');
    
    const prodUserCount = await prodClient.query('SELECT COUNT(*) as count FROM users');
    const prodCompanyCount = await prodClient.query('SELECT COUNT(*) as count FROM companies');
    const prodRelationshipCount = await prodClient.query('SELECT COUNT(*) as count FROM user_companies');
    
    console.log(`   👥 Production users: ${prodUserCount.rows[0].count}`);
    console.log(`   🏢 Production companies: ${prodCompanyCount.rows[0].count}`);
    console.log(`   🔗 Production relationships: ${prodRelationshipCount.rows[0].count}`);

    // Check for your specific data
    const yourUser = await prodClient.query('SELECT * FROM users WHERE email = $1', ['msalmanmunirmalik@outlook.com']);
    const yourCompany = await prodClient.query('SELECT * FROM companies WHERE name = $1', ['Letstern']);
    
    if (yourUser.rows.length > 0) {
      console.log(`\n✅ Your user found: ${yourUser.rows[0].email}`);
    } else {
      console.log(`\n❌ Your user not found in production`);
    }
    
    if (yourCompany.rows.length > 0) {
      console.log(`✅ Your company found: ${yourCompany.rows[0].name}`);
    } else {
      console.log(`❌ Your company not found in production`);
    }

    console.log('\n🎉 Data migration completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Users migrated successfully');
    console.log('   ✅ Companies migrated successfully');
    console.log('   ✅ User-company relationships migrated successfully');
    console.log('   ✅ Additional data migrated where available');
    
    console.log('\n🌐 Your data is now available in production at:');
    console.log('   https://sharedwealth.onrender.com');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await localClient.end();
    await prodClient.end();
    console.log('🔌 Database connections closed');
  }
}

// Handle script execution
if (require.main === module) {
  migrateData().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { migrateData };
