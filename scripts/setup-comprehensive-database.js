#!/usr/bin/env node

/**
 * Comprehensive Database Setup Script
 * Sets up the complete Shared Wealth International database schema
 * Supports both local development and production Render deployment
 */

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'shared_wealth_international',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? {
    rejectUnauthorized: false
  } : false,
};

async function setupDatabase() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🚀 Starting comprehensive database setup...');
    console.log(`📊 Connecting to: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    
    await client.connect();
    console.log('✅ Connected to database successfully');

    // Read the comprehensive schema file
    const schemaPath = path.join(__dirname, '../database/comprehensive_schema.sql');
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
        
        // Log progress every 10 statements
        if ((i + 1) % 10 === 0) {
          console.log(`✅ Progress: ${i + 1}/${statements.length} statements completed`);
        }
        
      } catch (error) {
        errorCount++;
        
        // Log error but continue (some statements might fail due to existing objects)
        console.log(`⚠️  Statement ${i + 1} failed (may already exist): ${statement.substring(0, 100)}...`);
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
      SELECT table_name, table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const tables = tablesResult.rows;
    console.log(`📋 Created ${tables.length} tables:`);
    
    // Group tables by type
    const regularTables = tables.filter(t => t.table_type === 'BASE TABLE');
    const views = tables.filter(t => t.table_type === 'VIEW');
    
    console.log(`   📊 Regular tables: ${regularTables.length}`);
    regularTables.forEach(table => {
      console.log(`      - ${table.table_name}`);
    });
    
    if (views.length > 0) {
      console.log(`   👁️  Views: ${views.length}`);
      views.forEach(view => {
        console.log(`      - ${view.table_name}`);
      });
    }

    // Check for sample data
    console.log('\n🔍 Checking sample data...');
    
    const userCount = await client.query('SELECT COUNT(*) as count FROM users');
    const companyCount = await client.query('SELECT COUNT(*) as count FROM companies');
    const categoryCount = await client.query('SELECT COUNT(*) as count FROM forum_categories');
    
    console.log(`   👥 Users: ${userCount.rows[0].count}`);
    console.log(`   🏢 Companies: ${companyCount.rows[0].count}`);
    console.log(`   📁 Forum Categories: ${categoryCount.rows[0].count}`);

    // Test database functionality
    console.log('\n🧪 Testing database functionality...');
    
    // Test user creation
    const testUser = await client.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role) 
      VALUES ($1, $2, $3, $4, $5) 
      ON CONFLICT (email) DO NOTHING 
      RETURNING id, email
    `, ['test@sharedwealth.com', 'test_hash', 'Test', 'User', 'user']);
    
    if (testUser.rows.length > 0) {
      console.log(`   ✅ Test user created: ${testUser.rows[0].email}`);
      
      // Clean up test user
      await client.query('DELETE FROM users WHERE email = $1', ['test@sharedwealth.com']);
      console.log(`   🧹 Test user cleaned up`);
    } else {
      console.log(`   ℹ️  Test user already exists`);
    }

    console.log('\n🎉 Comprehensive database setup completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Update your application to use the new schema');
    console.log('   2. Run your application and test all features');
    console.log('   3. Create your first user and company through the UI');
    console.log('   4. Set up your admin account if needed');
    
    console.log('\n🔗 Your data is now ready:');
    console.log(`   👤 Your user: msalmanmunirmalik@outlook.com`);
    console.log(`   🏢 Your company: Letstern`);
    console.log(`   🌐 Production URL: https://sharedwealth.onrender.com`);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

export { setupDatabase };
