-- Production Database Migration Script
-- This script fixes the database schema issues identified during investigation

-- 1. Add missing columns to user_companies table
ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 2. Create network_connections table
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

-- 3. Fix companies table status column (if it's a custom type)
-- First, check if status column exists and convert if needed
DO $$
BEGIN
    -- Check if status column exists and is a custom type
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'companies' 
        AND column_name = 'status' 
        AND data_type = 'USER-DEFINED'
    ) THEN
        -- Convert custom type to VARCHAR
        ALTER TABLE companies 
        ALTER COLUMN status TYPE VARCHAR(50) 
        USING status::text;
        
        -- Add check constraint
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
        ADD COLUMN status VARCHAR(50) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected'));
        
        RAISE NOTICE 'Added companies.status column';
    ELSE
        RAISE NOTICE 'companies.status column already exists and is VARCHAR';
    END IF;
END $$;

-- 4. Add missing profile columns to users table (if not already added)
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200);
ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);

-- 5. Verify the fixes
SELECT 'Migration completed successfully' as status;

-- Show current table structures
SELECT 'users table columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

SELECT 'user_companies table columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_companies' 
ORDER BY ordinal_position;

SELECT 'network_connections table exists:' as info;
SELECT COUNT(*) as table_exists 
FROM information_schema.tables 
WHERE table_name = 'network_connections';

SELECT 'companies.status column type:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'companies' AND column_name = 'status';
