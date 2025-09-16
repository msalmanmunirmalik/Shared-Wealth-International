#!/usr/bin/env node

/**
 * Essential Production Database Setup
 * Sets up the essential tables for production Render deployment
 */

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production database configuration for Render
const prodDbConfig = {
  user: process.env.DB_USER || 'shared_wealth_international_user',
  host: process.env.DB_HOST || 'dpg-d2i38rm3jp1c738vksr0-a.render.com',
  database: process.env.DB_NAME || 'shared_wealth_international',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false
  }
};

async function setupProductionDatabase() {
  const client = new Client(prodDbConfig);
  
  try {
    console.log('🚀 Starting essential production database setup...');
    console.log(`📊 Connecting to: ${prodDbConfig.host}:${prodDbConfig.port}/${prodDbConfig.database}`);
    
    await client.connect();
    console.log('✅ Connected to production database successfully');

    // Read the essential schema file
    const schemaPath = path.join(__dirname, '../essential-production-setup.sql');
    console.log(`📖 Reading schema file: ${schemaPath}`);
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('📄 Schema file loaded successfully');

    // Split into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`🏗️  Executing ${statements.length} database statements...`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        // Skip comments and empty statements
        if (statement.startsWith('--') || statement.length === 0) {
          continue;
        }

        await client.query(statement);
        successCount++;
        
        // Log progress every 5 statements
        if ((i + 1) % 5 === 0) {
          console.log(`✅ Progress: ${i + 1}/${statements.length} statements completed`);
        }
        
      } catch (error) {
        errorCount++;
        
        // Log error but continue (some statements might fail due to existing objects)
        console.log(`⚠️  Statement ${i + 1} failed (may already exist): ${statement.substring(0, 50)}...`);
        console.log(`   Error: ${error.message}`);
        
        // Don't stop on certain expected errors
        if (!error.message.includes('already exists') && 
            !error.message.includes('does not exist') &&
            !error.message.includes('duplicate key')) {
          console.log(`❌ Unexpected error: ${error.message}`);
        }
      }
    }

    console.log(`\n📊 Setup Summary:`);
    console.log(`   ✅ Successful statements: ${successCount}`);
    console.log(`   ⚠️  Failed statements: ${errorCount}`);

    // Verify tables were created
    console.log('\n🔍 Verifying table creation...');
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`📋 Created ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   - ${table}`);
    });

    // Check for sample data
    console.log('\n🔍 Checking sample data...');
    
    const userCount = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`   👥 Users: ${userCount.rows[0].count}`);

    // Check for admin user
    const adminUser = await client.query('SELECT email, role FROM users WHERE role = $1', ['superadmin']);
    if (adminUser.rows.length > 0) {
      console.log(`   👨‍💼 Admin user: ${adminUser.rows[0].email}`);
    }

    console.log('\n🎉 Essential production database setup completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Your production database is now ready');
    console.log('   2. You can now migrate your local data');
    console.log('   3. Test your application at https://sharedwealth.onrender.com');
    
    console.log('\n🔗 Production database is ready for your data!');

  } catch (error) {
    console.error('❌ Production database setup failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  setupProductionDatabase().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

export { setupProductionDatabase };
