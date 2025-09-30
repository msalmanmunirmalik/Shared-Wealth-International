#!/usr/bin/env node

/**
 * Deploy Database Schema to Render PostgreSQL
 * This script connects to the Render PostgreSQL instance and deploys the comprehensive schema
 * Uses the database connection details from the Render service
 */

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Render PostgreSQL connection details (from the service we analyzed)
const renderDbConfig = {
  host: 'dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com',
  port: 5432,
  database: 'shared_wealth_db',
  user: 'shared_wealth_db_user',
  password: process.env.RENDER_DB_PASSWORD || process.env.DATABASE_URL?.split('@')[0]?.split('://')[1]?.split(':')[1] || 'default_password',
  ssl: {
    rejectUnauthorized: false
  }
};

async function deploySchema() {
  const client = new Client(renderDbConfig);
  
  try {
    console.log('🔌 Connecting to Render PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to Render PostgreSQL successfully');

    // Read the comprehensive schema
    const schemaPath = path.join(__dirname, '..', 'database', 'comprehensive_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Deploying comprehensive database schema...');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      try {
        if (statement.trim()) {
          await client.query(statement);
          successCount++;
          console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
        }
      } catch (error) {
        if (error.message.includes('already exists') || error.message.includes('relation') && error.message.includes('already exists')) {
          console.log(`⚠️  Skipped (already exists): ${statement.substring(0, 50)}...`);
        } else {
          console.error(`❌ Error executing: ${statement.substring(0, 50)}...`);
          console.error(`   Error: ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log(`\n📊 Schema deployment summary:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

    // Verify tables were created
    console.log('\n🔍 Verifying table creation...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log(`📋 Created tables (${tablesResult.rows.length}):`);
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n🎉 Database schema deployment completed successfully!');

  } catch (error) {
    console.error('❌ Failed to deploy schema:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the deployment
deploySchema().catch(console.error);
