-- Production Database Migration Script
-- Run this script on the production database to fix schema issues
-- Last updated: October 1, 2025

-- ========================================
-- 1. Add missing profile columns to users table
-- ========================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200);
ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);

-- ========================================
-- 2. Add missing columns to user_companies table
-- ========================================
ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS position VARCHAR(100);
ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- ========================================
-- 3. Create network_connections table if it doesn't exist
-- ========================================
CREATE TABLE IF NOT EXISTS network_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  connection_type VARCHAR(50) DEFAULT 'member' CHECK (connection_type IN ('member', 'partner', 'supplier', 'customer')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, company_id)
);

-- ========================================
-- 4. Fix companies.status column (convert from custom type to VARCHAR if needed)
-- ========================================
DO $$
BEGIN
  -- Check if status column exists and is of custom type
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'companies' 
    AND column_name = 'status' 
    AND data_type = 'USER-DEFINED'
  ) THEN
    -- Convert from custom type to VARCHAR
    ALTER TABLE companies 
    ALTER COLUMN status TYPE VARCHAR(50) 
    USING status::text;
    
    -- Add constraint
    ALTER TABLE companies 
    DROP CONSTRAINT IF EXISTS companies_status_check;
    
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
    -- Add status column if it doesn't exist
    ALTER TABLE companies 
    ADD COLUMN status VARCHAR(50) DEFAULT 'approved' 
    CHECK (status IN ('pending', 'approved', 'rejected'));
    
    RAISE NOTICE 'Added companies.status column';
  ELSE
    RAISE NOTICE 'companies.status column already exists and is VARCHAR';
  END IF;
END $$;

-- ========================================
-- 5. Verification Queries
-- ========================================

-- Verify users table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('bio', 'location', 'website', 'linkedin', 'twitter', 'profile_image')
ORDER BY column_name;

-- Verify user_companies table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_companies' 
AND column_name IN ('position', 'status', 'created_at', 'updated_at')
ORDER BY column_name;

-- Verify network_connections table exists
SELECT COUNT(*) as table_exists 
FROM information_schema.tables 
WHERE table_name = 'network_connections';

-- Verify companies.status column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'companies' 
AND column_name = 'status';

-- ========================================
-- Migration Complete
-- ========================================
SELECT 'Migration completed successfully!' AS status;

