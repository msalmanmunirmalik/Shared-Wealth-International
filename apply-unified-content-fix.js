import { Pool } from 'pg';
import fs from 'fs';

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function applyUnifiedContentFix() {
  try {
    console.log('🔧 Applying unified_content table fix...');
    
    // Read the SQL fix file
    const sqlFix = fs.readFileSync('./fix-unified-content-table.sql', 'utf8');
    
    // Execute the SQL
    await pool.query(sqlFix);
    
    console.log('✅ Successfully applied unified_content table fix');
    
    // Verify the fix by checking if type column exists
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'unified_content' 
      AND column_name = 'type'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Verified: type column exists in unified_content table');
    } else {
      console.log('❌ Error: type column still missing');
    }
    
  } catch (error) {
    console.error('❌ Error applying unified_content fix:', error);
  } finally {
    await pool.end();
  }
}

applyUnifiedContentFix();
