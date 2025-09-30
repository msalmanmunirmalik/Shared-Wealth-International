#!/usr/bin/env node

/**
 * Deploy Database Schema to Render PostgreSQL
 * This script connects to the Render PostgreSQL instance and deploys the comprehensive schema
 */

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Render PostgreSQL connection details
const renderDbConfig = {
  host: 'dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com',
  port: 5432,
  database: 'shared_wealth_db',
  user: 'shared_wealth_db_user',
  password: process.env.RENDER_DB_PASSWORD, // You'll need to set this
  ssl: {
    rejectUnauthorized: false
  }
};

async function deploySchema() {
  const client = new Client(renderDbConfig);
  
  try {
    console.log('🔌 Connecting to Render PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to Render PostgreSQL');

    // Read the comprehensive schema
    const schemaPath = path.join(__dirname, '../database/comprehensive_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📖 Reading comprehensive schema...');
    console.log(`📄 Schema file: ${schemaPath}`);
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔧 Executing ${statements.length} SQL statements...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        if (statement.trim()) {
          await client.query(statement);
          successCount++;
          
          // Log progress every 10 statements
          if (successCount % 10 === 0) {
            console.log(`✅ Executed ${successCount}/${statements.length} statements...`);
          }
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error in statement ${i + 1}:`, error.message);
        console.error(`Statement: ${statement.substring(0, 100)}...`);
        
        // Continue with other statements unless it's a critical error
        if (error.message.includes('already exists') || 
            error.message.includes('does not exist')) {
          console.log('⚠️  Non-critical error, continuing...');
        } else {
          console.error('🚨 Critical error, stopping deployment');
          throw error;
        }
      }
    }
    
    console.log(`\n📊 Deployment Summary:`);
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`❌ Failed statements: ${errorCount}`);
    
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
      console.log(`  - ${row.table_name}`);
    });
    
    // Check for essential tables
    const essentialTables = ['users', 'companies', 'user_companies', 'unified_content'];
    const createdTables = tablesResult.rows.map(row => row.table_name);
    
    console.log('\n🎯 Essential tables check:');
    essentialTables.forEach(table => {
      if (createdTables.includes(table)) {
        console.log(`✅ ${table} - Created`);
      } else {
        console.log(`❌ ${table} - Missing`);
      }
    });
    
    console.log('\n🎉 Schema deployment completed successfully!');
    
  } catch (error) {
    console.error('🚨 Schema deployment failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from Render PostgreSQL');
  }
}

// Run the deployment
if (import.meta.url === `file://${process.argv[1]}`) {
  deploySchema().catch(console.error);
}

export { deploySchema };
