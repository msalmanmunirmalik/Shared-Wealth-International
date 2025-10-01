import pool from './src/integrations/postgresql/config.js';
import fs from 'fs';
import path from 'path';

async function applyMigration() {
  try {
    console.log('🔄 Applying database migration directly...');
    
    // Read the migration SQL file
    const migrationPath = path.join(process.cwd(), 'database', 'add_user_profile_fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.includes('ALTER TABLE')) {
        console.log(`📝 Executing: ${statement.substring(0, 50)}...`);
        await pool.query(statement);
        console.log('✅ Statement executed successfully');
      }
    }
    
    console.log('🎉 Database migration completed successfully!');
    
    // Test the migration by checking if columns exist
    const testQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('bio', 'location', 'website', 'linkedin', 'twitter', 'profile_image')
    `;
    
    const result = await pool.query(testQuery);
    console.log('📊 New columns found:', result.rows.map(row => row.column_name));
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

applyMigration();
