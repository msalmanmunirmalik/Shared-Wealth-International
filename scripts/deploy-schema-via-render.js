#!/usr/bin/env node

/**
 * Deploy Database Schema to Render PostgreSQL via Render MCP
 * This script uses the Render MCP service to deploy the database schema
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the comprehensive schema
const schemaPath = path.join(__dirname, '..', 'database', 'comprehensive_schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split the schema into individual statements
const statements = schema
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

console.log('📋 Database Schema Deployment via Render MCP');
console.log(`📄 Found ${statements.length} SQL statements to execute`);

// Export the statements for use with Render MCP
export { statements };

// If running directly, show the statements
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('\n🔍 SQL Statements to execute:');
  statements.forEach((stmt, index) => {
    console.log(`\n${index + 1}. ${stmt.substring(0, 100)}${stmt.length > 100 ? '...' : ''}`);
  });
  
  console.log('\n💡 To deploy this schema, use the Render MCP service to execute each statement.');
  console.log('   Example: mcp_render_query_render_postgres with each SQL statement');
}
