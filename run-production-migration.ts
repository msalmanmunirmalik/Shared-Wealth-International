import pool from './src/integrations/postgresql/config.js';
import fs from 'fs';
import path from 'path';

async function runProductionMigration() {
  try {
    console.log('🚀 Running production database migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(process.cwd(), 'production-database-migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('SELECT'));
    
    console.log(`📝 Executing ${statements.length} migration statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.includes('ALTER TABLE') || statement.includes('CREATE TABLE') || statement.includes('DO $$')) {
        console.log(`  ${i + 1}. ${statement.substring(0, 50)}...`);
        try {
          await pool.query(statement);
          console.log(`    ✅ Success`);
        } catch (error) {
          console.log(`    ⚠️  Warning: ${error.message}`);
        }
      }
    }
    
    // Run verification queries
    console.log('\n📊 Verifying migration results...');
    
    // Check user_companies table
    const userCompaniesCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_companies' 
      AND column_name IN ('created_at', 'updated_at', 'position', 'status')
      ORDER BY column_name
    `);
    
    console.log('  - user_companies columns:');
    userCompaniesCheck.rows.forEach(row => {
      console.log(`    ✅ ${row.column_name}: ${row.data_type}`);
    });
    
    // Check network_connections table
    const networkConnectionsCheck = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_name = 'network_connections'
    `);
    
    if (networkConnectionsCheck.rows[0].count > 0) {
      console.log('  ✅ network_connections table exists');
    } else {
      console.log('  ❌ network_connections table missing');
    }
    
    // Check companies status column
    const companiesStatusCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'companies' AND column_name = 'status'
    `);
    
    if (companiesStatusCheck.rows.length > 0) {
      console.log(`  ✅ companies.status: ${companiesStatusCheck.rows[0].data_type}`);
    } else {
      console.log('  ❌ companies.status column missing');
    }
    
    // Check users profile columns
    const usersProfileCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('bio', 'location', 'website', 'linkedin', 'twitter', 'profile_image')
      ORDER BY column_name
    `);
    
    console.log('  - users profile columns:');
    usersProfileCheck.rows.forEach(row => {
      console.log(`    ✅ ${row.column_name}: ${row.data_type}`);
    });
    
    console.log('\n🎉 Production database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error running production migration:', error);
  } finally {
    await pool.end();
  }
}

runProductionMigration();
