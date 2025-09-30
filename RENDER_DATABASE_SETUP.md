# Render Database Setup Guide

## Overview
This guide explains how to set up the database schema and populate it with data for the Shared Wealth International platform deployed on Render.

## Prerequisites
- Render PostgreSQL database instance is running
- Database connection details are available
- Node.js and npm/pnpm are installed locally

## Database Connection Details
- **Host**: `dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com`
- **Port**: `5432`
- **Database**: `shared_wealth_db`
- **User**: `shared_wealth_db_user`
- **Password**: Available in Render dashboard

## Setup Steps

### 1. Get Database Password
1. Go to your Render dashboard
2. Navigate to the PostgreSQL service (`shared-wealth-db`)
3. Copy the database password from the connection details

### 2. Set Environment Variable
```bash
export RENDER_DB_PASSWORD='your_database_password_here'
```

### 3. Run Setup Script
```bash
cd wealth-pioneers-network
./scripts/setup-render-database.sh
```

### 4. Manual Setup (Alternative)
If you prefer to run the steps manually:

```bash
# Deploy schema
node scripts/deploy-schema-to-render.js

# Populate database
node scripts/populate-render-db.js
```

## What Gets Created

### Database Schema
- **Users table**: User accounts with authentication
- **Companies table**: Company profiles and information
- **User-Companies table**: Relationships between users and companies
- **Unified Content table**: News, updates, and content management
- **Social Features**: Connections, reactions, comments
- **Funding Platform**: Opportunities and applications
- **Collaboration Tools**: Projects and meetings
- **Forum System**: Categories, topics, and replies
- **Messaging System**: Direct messages
- **File Management**: Upload and file handling
- **Admin Tools**: Activity logs and notifications

### Sample Data
- **30 Companies**: Diverse range of sustainable businesses
- **30 Users**: Company directors with login credentials
- **30 Relationships**: User-company associations
- **Default Admin**: `admin@sharedwealth.com` / `admin123`

## Default Login Credentials

### Admin Account
- **Email**: `admin@sharedwealth.com`
- **Password**: `admin123`
- **Role**: `superadmin`

### Company Director Accounts
- **Email Pattern**: `{companyname}@sharedwealth.com`
- **Password**: `Sharedwealth123`
- **Role**: `director`

### Example Company Accounts
- `supernovaeco@sharedwealth.com` / `Sharedwealth123`
- `greentechsolutions@sharedwealth.com` / `Sharedwealth123`
- `oceancleanupco@sharedwealth.com` / `Sharedwealth123`

## Verification

### Check Database Tables
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

### Check Company Count
```sql
SELECT COUNT(*) FROM companies;
```

### Check User Count
```sql
SELECT COUNT(*) FROM users;
```

### Check Relationships
```sql
SELECT COUNT(*) FROM user_companies;
```

## Testing Production API

### Health Check
```bash
curl https://shared-wealth-international.onrender.com/api/health
```

### Authentication Test
```bash
curl -X POST https://shared-wealth-international.onrender.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "supernovaeco@sharedwealth.com", "password": "Sharedwealth123"}'
```

### Companies List
```bash
curl https://shared-wealth-international.onrender.com/api/companies
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if the database is running in Render dashboard
   - Verify the connection details are correct

2. **Authentication Failed**
   - Ensure the password is correct
   - Check if the user has proper permissions

3. **Schema Already Exists**
   - The script will skip existing tables
   - Use `DROP TABLE` statements if you need to reset

4. **SSL/TLS Required**
   - The connection uses SSL by default
   - This is required for Render PostgreSQL

### Reset Database
If you need to start over:
```sql
-- Drop all tables (be careful!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

## Security Notes

- Database password is sensitive information
- Never commit passwords to version control
- Use environment variables for all sensitive data
- Enable SSL/TLS for all database connections
- Regularly rotate database passwords

## Support

If you encounter issues:
1. Check the Render dashboard for service status
2. Review the application logs in Render
3. Verify environment variables are set correctly
4. Test database connectivity manually

## Next Steps

After successful database setup:
1. Test all API endpoints
2. Verify frontend-backend communication
3. Test user authentication and authorization
4. Verify company data is accessible
5. Test social features and content management
6. Validate admin functionality
