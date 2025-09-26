# 🚀 Shared Wealth International - DirectAdmin Deployment Guide

## 📋 **PRE-DEPLOYMENT CHECKLIST**

✅ **Project Status**: Ready for deployment  
✅ **Frontend Build**: Production-ready  
✅ **Backend Build**: Compiled and optimized  
✅ **Database**: Schema ready with 30+ company accounts  
✅ **Environment**: Production configuration prepared  
✅ **Package**: Created and ready for upload  

---

## 📦 **DEPLOYMENT PACKAGE CREATED**

**Package Location**: `./deployment/shared-wealth-directadmin-20250925-001230.tar.gz`  
**Size**: ~500MB (includes all dependencies)  
**Contents**: Complete application with setup scripts and documentation  

---

## 🎯 **STEP-BY-STEP DIRECTADMIN DEPLOYMENT**

### **STEP 1: Upload Package to DirectAdmin**

1. **Access DirectAdmin Control Panel**
   - Login to your DirectAdmin account
   - Navigate to `File Manager`

2. **Upload the Package**
   - Go to your domain's `public_html` directory
   - Upload `shared-wealth-directadmin-20250925-001230.tar.gz`
   - Extract the archive:
     ```bash
     tar -xzf shared-wealth-directadmin-20250925-001230.tar.gz
     ```

3. **Move Files to Root**
   - Move all contents from `shared-wealth-directadmin/` to `public_html/`
   - Ensure directory structure is maintained

### **STEP 2: Configure DirectAdmin Node.js Application**

1. **Access Node.js Apps**
   - In DirectAdmin, go to `Advanced Features` → `Node.js`
   - Click `Create Node.js App`

2. **Application Configuration**
   ```
   Node.js Version: 20.x (or latest available)
   Application Mode: Production
   NODE_ENV: production
   Application Root: /home/yourusername/public_html
   Application URL: https://sharedwealth.net
   Application Startup File: server/server.js
   Port: 8080 (or auto-assigned)
   ```

3. **Environment Variables** (Add these in DirectAdmin)
   ```
   NODE_ENV=production
   PORT=8080
   DB_HOST=localhost
   DB_USER=sharedwealth
   DB_PASSWORD=your-secure-db-password
   DB_NAME=sharedwealth
   DB_PORT=5432
   JWT_SECRET=your-super-secret-jwt-key-here-must-be-at-least-32-characters
   JWT_EXPIRES_IN=7d
   SESSION_SECRET=wealth-pioneers-session-secret-2024-production
   CSRF_SECRET=wealth-pioneers-csrf-secret-2024-production
   ALLOWED_ORIGINS=https://sharedwealth.net,https://www.sharedwealth.net
   SESSION_COOKIE_SECURE=true
   SESSION_COOKIE_HTTP_ONLY=true
   SESSION_COOKIE_SAME_SITE=strict
   ```

### **STEP 3: Install Dependencies**

1. **Via DirectAdmin Terminal** (if available)
   ```bash
   cd /home/yourusername/public_html
   npm install -g pnpm
   pnpm install --production
   ```

2. **Or via SSH** (if you have SSH access)
   ```bash
   ssh yourusername@sharedwealth.net
   cd public_html
   npm install -g pnpm
   pnpm install --production
   npm install -g pm2
   ```

### **STEP 4: Database Setup**

1. **Create PostgreSQL Database**
   - In DirectAdmin: `Database Management` → `PostgreSQL`
   - Create database: `sharedwealth`
   - Create user: `sharedwealth`
   - Set secure password
   - Grant all privileges

2. **Import Database Schema**
   - Run the SQL script from `setup-database.sql`
   - Or execute via phpPgAdmin if available

### **STEP 5: Configure Environment**

1. **Update Environment File**
   ```bash
   cp .env.production .env
   nano .env  # Edit with your actual values
   ```

2. **Update Database Credentials**
   - Set your actual database password
   - Update JWT and session secrets
   - Set your domain in ALLOWED_ORIGINS

### **STEP 6: Start Application**

1. **Via DirectAdmin Node.js Interface**
   - Click `Start` on your Node.js application
   - Check logs for any errors

2. **Or via PM2** (if installed)
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### **STEP 7: SSL Configuration**

1. **Enable SSL Certificate**
   - In DirectAdmin: `SSL Certificates`
   - Enable SSL for sharedwealth.net
   - Force HTTPS redirect

2. **Update Nginx Configuration** (if needed)
   - Ensure reverse proxy to port 8080
   - Configure proper headers for API

---

## 🔧 **POST-DEPLOYMENT VERIFICATION**

### **Test Application Endpoints**

1. **Health Check**
   ```bash
   curl https://sharedwealth.net/api/monitoring/health
   ```

2. **Authentication**
   - Test login with company accounts
   - Verify JWT tokens are working

3. **Company Dashboard**
   - Login with: `thesoundsenseproject@gmail.com` / `Sharedwealth123`
   - Verify only 1 company shows in "My Companies"
   - Verify all 30 companies show in "Network" tab

### **Database Verification**

1. **Check User Count**
   ```sql
   SELECT COUNT(*) FROM users;
   -- Should return 31 (30 companies + 1 admin)
   ```

2. **Check Company Count**
   ```sql
   SELECT COUNT(*) FROM companies;
   -- Should return 30
   ```

3. **Verify Company-User Links**
   ```sql
   SELECT COUNT(*) FROM user_companies;
   -- Should return 30
   ```

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

1. **Application Won't Start**
   - Check Node.js version (should be 18+)
   - Verify all environment variables are set
   - Check logs in DirectAdmin

2. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check database credentials in .env
   - Ensure database user has proper permissions

3. **Frontend Not Loading**
   - Check if static files are served correctly
   - Verify API URL in frontend build
   - Check CORS settings

4. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check session configuration
   - Ensure HTTPS is properly configured

### **Log Locations**

- **Application Logs**: DirectAdmin Node.js interface
- **PM2 Logs**: `logs/api-error.log` and `logs/api-out.log`
- **Nginx Logs**: `/var/log/nginx/error.log`
- **Database Logs**: PostgreSQL log files

---

## 📊 **DEPLOYMENT SUMMARY**

| Component | Status | Location |
|-----------|--------|----------|
| Frontend | ✅ Ready | `public_html/` |
| Backend | ✅ Ready | `server/` |
| Database | ✅ Schema Ready | PostgreSQL |
| Environment | ✅ Configured | `.env` |
| SSL | 🔄 Configure | DirectAdmin |
| PM2 | 🔄 Setup | Optional |

---

## 🎯 **FINAL STEPS**

1. **Test All Features**
   - User registration/login
   - Company dashboard
   - Network view
   - Admin functions

2. **Performance Optimization**
   - Enable gzip compression
   - Setup CDN if needed
   - Configure caching

3. **Monitoring Setup**
   - Setup log monitoring
   - Configure backups
   - Setup uptime monitoring

4. **Security Hardening**
   - Review firewall settings
   - Update secrets regularly
   - Monitor for vulnerabilities

---

## 📞 **SUPPORT INFORMATION**

- **Package**: `shared-wealth-directadmin-20250925-001230.tar.gz`
- **Documentation**: `DEPLOYMENT_GUIDE.md` (included in package)
- **Setup Script**: `setup-server.sh` (included in package)
- **Database Schema**: `setup-database.sql` (included in package)

**Your Shared Wealth International application is now ready for production deployment! 🚀**
