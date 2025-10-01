# Production Database Migration Instructions

## Overview
The production database is missing several columns and tables that are required for the application to function properly. This migration will add the missing schema elements.

## Database Information
- **Database ID**: `dpg-d3ballbe5dus73cddqs0-a`
- **Database Name**: `shared_wealth_db`
- **User**: `shared_wealth_db_user`
- **Region**: Oregon
- **Plan**: Free

## Migration Script
The SQL migration script is located at: `production-database-fix.sql`

## How to Apply the Migration

### Option 1: Using Render Dashboard (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/d/dpg-d3ballbe5dus73cddqs0-a)
2. Click on "Shell" or "Connect"
3. Copy and paste the contents of `production-database-fix.sql`
4. Execute the script
5. Verify the output shows all columns were added successfully

### Option 2: Using psql command line
```bash
# Connect to the database
psql postgresql://shared_wealth_db_user:<PASSWORD>@dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com:5432/shared_wealth_db

# Run the migration script
\i production-database-fix.sql
```

### Option 3: Using the Application (Automated)
The application has a migration endpoint at `/api/migration/run` but it's currently returning 404. This needs to be fixed first.

## What the Migration Does

### 1. Adds Profile Columns to `users` Table
- `bio` (TEXT)
- `location` (VARCHAR 200)
- `website` (VARCHAR 500)
- `linkedin` (VARCHAR 500)
- `twitter` (VARCHAR 500)
- `profile_image` (VARCHAR 500)

### 2. Adds Columns to `user_companies` Table
- `position` (VARCHAR 100)
- `status` (VARCHAR 50, default 'active')
- `created_at` (TIMESTAMP, default CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP, default CURRENT_TIMESTAMP)

### 3. Creates `network_connections` Table
This table manages user-company network relationships with:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to users)
- `company_id` (UUID, foreign key to companies)
- `connection_type` (VARCHAR 50)
- `status` (VARCHAR 50)
- `created_at`, `updated_at` (TIMESTAMP)

### 4. Fixes `companies.status` Column
Converts the `status` column from a custom type to VARCHAR(50) with a check constraint.

## Verification
After running the migration, the script will output verification queries showing:
- All new columns in `users` table
- All new columns in `user_companies` table
- Confirmation that `network_connections` table exists
- Status of `companies.status` column

## What to Do After Migration
1. Re-enable database queries in the application code
2. Deploy the updated code
3. Test the complete signup flow with profile data
4. Test dashboard and companies directory

## Rollback (if needed)
If something goes wrong, you can rollback by:
```sql
ALTER TABLE users DROP COLUMN IF EXISTS bio;
ALTER TABLE users DROP COLUMN IF EXISTS location;
ALTER TABLE users DROP COLUMN IF EXISTS website;
ALTER TABLE users DROP COLUMN IF EXISTS linkedin;
ALTER TABLE users DROP COLUMN IF EXISTS twitter;
ALTER TABLE users DROP COLUMN IF EXISTS profile_image;

ALTER TABLE user_companies DROP COLUMN IF EXISTS position;
ALTER TABLE user_companies DROP COLUMN IF EXISTS status;
ALTER TABLE user_companies DROP COLUMN IF EXISTS created_at;
ALTER TABLE user_companies DROP COLUMN IF EXISTS updated_at;

DROP TABLE IF EXISTS network_connections;
```

## Need Help?
If you encounter any issues, check the Render logs for error messages or contact support.

