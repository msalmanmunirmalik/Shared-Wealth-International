# Render Production Setup Guide
## Shared Wealth International E2E Deployment

### Current Status Investigation
**Service**: `srv-d3nnamje5dus73ef4rm0`
- **Type**: Static Site (Frontend Only)
- **URL**: https://shared-wealth-international.onrender.com
- **Status**: ✅ Live
- **Problem**: Missing backend API and database

---

## 🚨 Critical Issues Found

### 1. No Backend Server
The static site at `srv-d3nnamje5dus73ef4rm0` is **only serving frontend files**.
- No Node.js server running
- No API endpoints available
- Frontend trying to call `https://sharedwealth.net/api` (doesn't exist)

### 2. No Database
- No PostgreSQL database for Shared Wealth International
- Existing free database is for Edbirds project
- **Render Free Tier Limit**: Only 1 free PostgreSQL database allowed

### 3. Database Limitation
You currently have:
- `edbirds-db` (dpg-d3n4dcbuibrs73bgc7ng-a) - Free tier PostgreSQL
- Cannot create another free database

---

## ✅ Solution Options

### Option 1: Use Existing Free Database (Recommended for Testing)
**Cost**: Free  
**Steps**:
1. Use the existing `edbirds-db` database
2. Create a new schema/database within it for Shared Wealth
3. Run migration scripts to set up tables

**Pros**:
- Free
- Quick setup
- Good for testing

**Cons**:
- Shared with Edbirds project
- Not recommended for production

### Option 2: Upgrade to Paid Database (Recommended for Production)
**Cost**: $7/month (Starter Plan)  
**Steps**:
1. Create new PostgreSQL database (Starter plan)
2. Dedicated database for Shared Wealth International
3. Better performance and storage

**Pros**:
- Dedicated resources
- Better for production
- More storage (10GB vs 1GB)

**Cons**:
- Monthly cost

### Option 3: Delete Edbirds Database
**Cost**: Free  
**Steps**:
1. Delete `edbirds-db` if not needed
2. Create new free database for Shared Wealth
3. Run migration scripts

**Warning**: This will delete all Edbirds data permanently!

---

## 📋 Required Resources

### 1. PostgreSQL Database
- **Purpose**: Store all application data
- **Tables Needed**: 
  - users
  - companies
  - user_companies
  - network_connections
  - unified_content
  - and 20+ more tables

### 2. Web Service (Backend API)
- **Runtime**: Node.js
- **Build Command**: `pnpm install && pnpm run server:build`
- **Start Command**: `pnpm run server:start` or `node dist/server/server.js`
- **Port**: 8080 (or Render default 10000)
- **Plan**: Free or Starter ($7/month)

### 3. Environment Variables Needed

#### For Web Service:
```bash
# Database (from Render PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database
DB_USER=<from_database>
DB_HOST=<from_database>
DB_NAME=<from_database>
DB_PASSWORD=<from_database>
DB_PORT=5432

# JWT & Security
JWT_SECRET=<generate_secure_random_string>
JWT_EXPIRES_IN=7d
JWT_AUDIENCE=wealth-pioneers-users
JWT_ISSUER=shared-wealth-international

# Session
SESSION_SECRET=<generate_secure_random_string>
CSRF_SECRET=<generate_secure_random_string>

# App
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://shared-wealth-international.onrender.com

# Email (Optional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
```

#### For Static Site (Frontend):
```bash
VITE_API_URL=https://your-backend-service.onrender.com/api
```

---

## 🛠️ Step-by-Step Deployment

### Step 1: Choose Database Option
**Recommended**: Option 2 (Paid Starter Database)

### Step 2: Create PostgreSQL Database
```bash
# Via Render Dashboard
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Name: shared-wealth-db
4. Plan: Starter ($7/month)
5. Region: Oregon
6. Click "Create Database"
```

### Step 3: Save Database Credentials
After creation, save these from the database info page:
- Internal Database URL
- External Database URL
- PSQL Command
- Database Name
- Username
- Password

### Step 4: Run Database Migrations
Connect to the database and run:
```bash
# Files to run in order:
1. database/comprehensive_schema.sql
2. production-database-fix.sql
3. database/sample_data_final.sql (optional)
```

### Step 5: Create Web Service (Backend)
```bash
# Via Render Dashboard
1. Click "New +" → "Web Service"
2. Connect repository: Shared-Wealth-International
3. Settings:
   - Name: shared-wealth-api
   - Runtime: Node
   - Build Command: pnpm install && pnpm run server:build
   - Start Command: node dist/server/server.js
   - Plan: Free or Starter
   - Region: Oregon
4. Add all environment variables from above
5. Click "Create Web Service"
```

### Step 6: Update Static Site Environment
Go to `srv-d3nnamje5dus73ef4rm0` settings:
1. Add Environment Variable:
   ```
   VITE_API_URL=https://shared-wealth-api.onrender.com/api
   ```
2. Trigger Manual Deploy

### Step 7: Verify Deployment
Test these endpoints:
```bash
# Health check
curl https://shared-wealth-api.onrender.com/health

# API status
curl https://shared-wealth-api.onrender.com/api/status

# Database health
curl https://shared-wealth-api.onrender.com/health/db
```

---

## 📝 Database Schema Files Available

Located in `/database/` directory:

1. **comprehensive_schema.sql** - Full database schema
2. **production-database-fix.sql** - Production fixes and migrations
3. **sample_data_final.sql** - Sample data for testing
4. **unified_content_table.sql** - Content management tables
5. **social_features_sample_data.sql** - Social features data

---

## 🔐 Security Checklist

- [ ] Use strong, randomly generated JWT_SECRET
- [ ] Use strong, randomly generated SESSION_SECRET
- [ ] Use strong database password (auto-generated by Render)
- [ ] Set NODE_ENV=production
- [ ] Configure CORS properly
- [ ] Enable SSL for database connections
- [ ] Review and limit IP allowlist if needed

---

## 💰 Cost Breakdown

### Minimum (Using Free Tier):
- Static Site (Frontend): $0
- Web Service (Backend): $0 (sleeps after inactivity)
- PostgreSQL (Shared): $0
**Total**: $0/month

### Recommended Production:
- Static Site (Frontend): $0
- Web Service (Backend): $7/month (Starter)
- PostgreSQL (Dedicated): $7/month (Starter)
**Total**: $14/month

---

## 🐛 Troubleshooting

### Backend Not Starting
- Check build logs in Render dashboard
- Verify all environment variables are set
- Check NODE_VERSION is compatible (v18+)

### Database Connection Errors
- Verify DATABASE_URL format
- Check database is available (not suspended)
- Ensure SSL mode is enabled: `?sslmode=require`

### Frontend Can't Reach Backend
- Verify VITE_API_URL in static site env vars
- Check backend service is running
- Test backend endpoints directly with curl
- Check CORS settings allow frontend domain

---

## 📞 Next Steps

1. **Decide on database option** (Recommend: Paid Starter)
2. **Create PostgreSQL database** on Render
3. **Run database migrations** via PSQL command
4. **Create web service** for backend API
5. **Configure environment variables** for both services
6. **Update static site** with correct API URL
7. **Test end-to-end** functionality

---

## 📊 Current Resources Summary

### Existing Services on Render:
- ✅ `srv-d3nnamje5dus73ef4rm0` - Static Site (Frontend)
- ❌ Backend Web Service - **MISSING**
- ❌ PostgreSQL Database - **MISSING** (free tier limit reached)

### What Needs to be Created:
1. PostgreSQL Database (Paid Starter or use existing)
2. Web Service for Backend API
3. Environment variables configuration
4. Database schema setup

---

**Generated**: October 16, 2025  
**For Service**: `srv-d3nnamje5dus73ef4rm0`  
**Project**: Shared Wealth International

