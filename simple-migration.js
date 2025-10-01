import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: 'postgresql://shared_wealth_db_user:fQ36Pb3VRDUHD6UsiqmeLCNG0KLXtYSd@dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com/shared_wealth_db',
  ssl: {
    rejectUnauthorized: false
  },
  max: 1, // Only one connection at a time
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

async function runSimpleMigration() {
  console.log('🚀 Starting simple database migration...');
  
  const statements = [
    // Add profile columns to users table
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT',
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200)',
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(500)',
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(500)',
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter VARCHAR(500)',
    'ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500)',
    
    // Add columns to user_companies table
    'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS position VARCHAR(100)',
    'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT \'active\'',
    'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    
    // Create network_connections table
    `CREATE TABLE IF NOT EXISTS network_connections (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
      connection_type VARCHAR(50) DEFAULT 'member' CHECK (connection_type IN ('member', 'partner', 'supplier', 'customer')),
      status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, company_id)
    )`,
    
    // Add status column to companies if it doesn't exist
    'ALTER TABLE companies ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT \'approved\''
  ];
  
  let client;
  
  try {
    client = await pool.connect();
    console.log('✅ Connected to database');
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n${i + 1}. Executing: ${statement.substring(0, 60)}...`);
      
      try {
        await client.query(statement);
        console.log('✅ Success');
      } catch (error) {
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log('⚠️ Already exists (skipping)');
        } else {
          console.error('❌ Error:', error.message);
        }
      }
    }
    
    console.log('\n🎉 Migration completed!');
    
    // Simple verification
    console.log('\n🔍 Running verification...');
    
    try {
      const result = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name IN ('bio', 'location', 'website', 'linkedin', 'twitter', 'profile_image')
        ORDER BY column_name
      `);
      console.log('📊 Users profile columns:', result.rows.map(r => r.column_name));
    } catch (error) {
      console.error('❌ Verification failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

runSimpleMigration();
