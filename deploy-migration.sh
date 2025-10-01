#!/bin/bash

echo "🚀 Deploying database migration to production..."

# Check if we have the necessary environment variables
if [ -z "$RENDER_API_KEY" ]; then
    echo "❌ RENDER_API_KEY environment variable is required"
    echo "   Get your API key from: https://dashboard.render.com/account/settings"
    exit 1
fi

# Get the database service ID
DB_SERVICE_ID="dpg-d3ballbe5dus73cddqs0-a"

echo "📋 Database Service ID: $DB_SERVICE_ID"

# Create a temporary migration script
cat > temp_migration.sql << 'EOF'
-- Production Database Migration Script
-- Add missing columns to user_companies table
ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create network_connections table
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

-- Fix companies table status column
DO $$
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
END $$;

-- Add missing profile columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200);
ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500);

-- Verification
SELECT 'Migration completed successfully' as status;
EOF

echo "📝 Migration script created: temp_migration.sql"

echo "🔧 To complete the migration:"
echo "   1. Go to https://dashboard.render.com/d/$DB_SERVICE_ID"
echo "   2. Click on 'Shell' or 'Console' tab"
echo "   3. Copy and paste the contents of temp_migration.sql"
echo "   4. Execute the SQL commands"
echo "   5. Verify the migration was successful"

echo ""
echo "📋 Alternative: Use psql command line"
echo "   psql 'postgresql://shared_wealth_db_user:[PASSWORD]@dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com:5432/shared_wealth_db?sslmode=require' -f temp_migration.sql"

echo ""
echo "🎉 Migration script ready for deployment!"
