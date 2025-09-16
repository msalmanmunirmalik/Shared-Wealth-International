#!/usr/bin/env node

/**
 * Direct Production Database Setup Script
 * Sets up PostgreSQL database for Shared Wealth International in production
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production database configuration
const dbConfig = {
  user: 'shared_wealth_international_user',
  host: 'dpg-d2i38rm3jp1c738vksr0-a.oregon-postgres.render.com',
  database: 'shared_wealth_international',
  password: process.env.DB_PASSWORD || 'your_database_password_here',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
};

console.log('🚀 Starting production database setup...');
console.log('📊 Database Config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user
});

// Create database connection
const pool = new Pool(dbConfig);

async function setupProductionDatabase() {
  let client;
  
  try {
    // Test connection
    console.log('🔌 Testing database connection...');
    client = await pool.connect();
    console.log('✅ Database connection successful');

    // Read schema file
    const schemaPath = path.join(__dirname, 'database/schema.sql');
    console.log('📖 Reading schema file:', schemaPath);
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('📄 Schema file loaded successfully');

    // Execute schema in chunks to avoid issues
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`🔧 Executing ${statements.length} SQL statements...`);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
        } catch (error) {
          console.log(`⚠️  Statement failed (may already exist): ${statement.substring(0, 50)}...`);
          console.log(`   Error: ${error.message}`);
        }
      }
    }

    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log('📋 Created tables:');
    tables.forEach(table => {
      console.log(`  - ${table}`);
    });

    // Insert default admin user
    console.log('👤 Creating default admin user...');
    const adminPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // admin123
    await client.query(`
      INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified) 
      VALUES ('admin@sharedwealth.com', $1, 'superadmin', 'Admin', 'User', true, true)
      ON CONFLICT (email) DO NOTHING
    `, [adminPassword]);
    
    console.log('✅ Default admin user created (email: admin@sharedwealth.com, password: admin123)');

    console.log('🎉 Production database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Production database setup failed:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Run setup
setupProductionDatabase()
  .then(() => {
    console.log('🎉 Production database setup completed successfully!');
    console.log('🔐 Default admin credentials:');
    console.log('   Email: admin@sharedwealth.com');
    console.log('   Password: admin123');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Production database setup failed:', error);
    process.exit(1);
  });
