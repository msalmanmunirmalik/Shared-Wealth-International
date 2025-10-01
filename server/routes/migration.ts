import { Router } from 'express';
import pool from '../../src/integrations/postgresql/config.js';

const router = Router();

// Migration endpoint - should be protected in production
router.post('/run', async (req, res) => {
  try {
    console.log('🚀 Running database migration...');
    
    const migrationQueries = [
      // 1. Add missing columns to user_companies table
      'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      
      // 2. Create network_connections table
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
      
      // 3. Fix companies table status column
      `DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'companies' 
          AND column_name = 'status' 
          AND data_type = 'USER-DEFINED'
        ) THEN
          ALTER TABLE companies 
          ALTER COLUMN status TYPE VARCHAR(50) 
          USING status::text;
          
          ALTER TABLE companies 
          ADD CONSTRAINT companies_status_check 
          CHECK (status IN ('pending', 'approved', 'rejected'));
          
          RAISE NOTICE 'Converted companies.status from custom type to VARCHAR';
        ELSIF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'companies' 
          AND column_name = 'status'
        ) THEN
          ALTER TABLE companies 
          ADD COLUMN status VARCHAR(50) DEFAULT 'pending' 
          CHECK (status IN ('pending', 'approved', 'rejected'));
          
          RAISE NOTICE 'Added companies.status column';
        ELSE
          RAISE NOTICE 'companies.status column already exists and is VARCHAR';
        END IF;
      END $$`,
      
      // 4. Add missing profile columns to users table
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(500)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(500)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter VARCHAR(500)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500)'
    ];
    
    const results = [];
    
    for (const query of migrationQueries) {
      try {
        console.log(`Executing: ${query.substring(0, 50)}...`);
        await pool.query(query);
        results.push({ query: query.substring(0, 50), status: 'success' });
      } catch (error) {
        console.error(`Error executing query: ${error.message}`);
        results.push({ query: query.substring(0, 50), status: 'error', error: error.message });
      }
    }
    
    // Verification queries
    const verificationQueries = [
      'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'user_companies\' AND column_name IN (\'created_at\', \'updated_at\', \'position\', \'status\') ORDER BY column_name',
      'SELECT COUNT(*) as table_exists FROM information_schema.tables WHERE table_name = \'network_connections\'',
      'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'companies\' AND column_name = \'status\'',
      'SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'users\' AND column_name IN (\'bio\', \'location\', \'website\', \'linkedin\', \'twitter\', \'profile_image\') ORDER BY column_name'
    ];
    
    const verificationResults = [];
    
    for (const query of verificationQueries) {
      try {
        const result = await pool.query(query);
        verificationResults.push({ query: query.substring(0, 50), data: result.rows });
      } catch (error) {
        verificationResults.push({ query: query.substring(0, 50), error: error.message });
      }
    }
    
    console.log('✅ Migration completed successfully');
    
    res.json({
      success: true,
      message: 'Database migration completed',
      results,
      verification: verificationResults
    });
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
});

export default router;
