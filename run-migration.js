import { Pool } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: 'postgresql://shared_wealth_db_user:fQ36Pb3VRDUHD6UsiqmeLCNG0KLXtYSd@dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com/shared_wealth_db',
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  console.log('🚀 Starting database migration...');
  
  try {
    // Read the migration SQL file
    const migrationSQL = fs.readFileSync('production-database-fix.sql', 'utf8');
    
    // Split into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`\n${i + 1}. Executing: ${statement.substring(0, 50)}...`);
        try {
          await pool.query(statement);
          console.log('✅ Success');
        } catch (error) {
          console.error('❌ Error:', error.message);
          // Continue with other statements
        }
      }
    }
    
    console.log('\n🎉 Migration completed!');
    
    // Run verification queries
    console.log('\n🔍 Running verification queries...');
    
    const verificationQueries = [
      {
        name: 'Users table profile columns',
        query: `SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'users' 
                AND column_name IN ('bio', 'location', 'website', 'linkedin', 'twitter', 'profile_image')
                ORDER BY column_name`
      },
      {
        name: 'User_companies table columns',
        query: `SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'user_companies' 
                AND column_name IN ('position', 'status', 'created_at', 'updated_at')
                ORDER BY column_name`
      },
      {
        name: 'Network_connections table exists',
        query: `SELECT COUNT(*) as table_exists 
                FROM information_schema.tables 
                WHERE table_name = 'network_connections'`
      },
      {
        name: 'Companies status column',
        query: `SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'companies' 
                AND column_name = 'status'`
      }
    ];
    
    for (const verification of verificationQueries) {
      try {
        console.log(`\n📊 ${verification.name}:`);
        const result = await pool.query(verification.query);
        console.log(result.rows);
      } catch (error) {
        console.error(`❌ Verification failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
