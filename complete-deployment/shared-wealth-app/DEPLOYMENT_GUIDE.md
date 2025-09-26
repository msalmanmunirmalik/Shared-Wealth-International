# Shared Wealth International - Complete Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Upload Files
- Upload all files from this package to your domain's root directory
- Ensure all files maintain their directory structure

### 2. Directory Structure
```
your-domain-root/
├── package.json              # Node.js dependencies
├── pnpm-lock.yaml           # Lock file
├── .env.production          # Environment variables
├── ecosystem.config.js      # PM2 configuration
├── server/                  # Backend server files
│   └── server.js           # Main server file
├── public_html/             # Frontend files
│   ├── .htaccess           # Apache configuration
│   ├── index.html          # Main HTML file
│   └── assets/             # CSS, JS, images
├── logs/                    # Application logs
├── nginx.conf              # Nginx configuration
└── web.config              # IIS configuration
```

### 3. Configure Web Server
Choose the appropriate configuration file for your server:

**For Apache (.htaccess included):**
- The .htaccess file is already in public_html/
- It will automatically fix MIME type issues
- No additional configuration needed

**For Nginx:**
- Copy nginx.conf to your nginx configuration
- Update the server_name and root path
- Restart nginx

**For IIS:**
- Copy web.config to your public_html directory
- IIS will automatically use it

### 4. Install Dependencies
```bash
cd /home/yourusername/public_html
npm install -g pnpm
pnpm install --production
```

### 5. Configure Environment
- Copy `.env.production` to `.env`
- Update database credentials and domain settings
- Update JWT secrets and session secrets

### 6. Database Setup
- Create PostgreSQL database: `sharedwealth`
- Create user: `sharedwealth`
- Import database schema (if needed)

### 7. Install PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 8. Configure SSL
- Enable SSL certificate for sharedwealth.net
- Force HTTPS redirect

## 🔧 MIME Type Fixes Included

This deployment package includes fixes for the common MIME type error:
"Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of 'application/octet-stream'"

### Included Configuration Files:
- `.htaccess` - Apache configuration (automatically applied)
- `nginx.conf` - Nginx configuration
- `web.config` - IIS configuration

These files ensure JavaScript modules are served with the correct `text/javascript` MIME type.

## 📋 DirectAdmin Node.js Application Settings

### Node.js Version
- **Version**: Node.js 18.x or higher
- **Recommended**: Node.js 20.x LTS

### Application Configuration
- **Application Mode**: Production
- **NODE_ENV**: production
- **Application Root**: /home/yourusername/public_html (or your domain root)
- **Application URL**: https://sharedwealth.net
- **Application Startup File**: server/server.js
- **Port**: 8080

### Environment Variables (Required)
```
NODE_ENV=production
PORT=8080
DB_HOST=localhost
DB_USER=sharedwealth
DB_PASSWORD=your-db-password
DB_NAME=sharedwealth
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key-here-must-be-at-least-32-characters
JWT_EXPIRES_IN=7d
SESSION_SECRET=wealth-pioneers-session-secret-2024-production
CSRF_SECRET=wealth-pioneers-csrf-secret-2024-production
ALLOWED_ORIGINS=https://sharedwealth.net,https://www.sharedwealth.net
```

## 🔧 Post-Deployment Checklist

- [ ] Database connection working
- [ ] User authentication working
- [ ] Company accounts accessible
- [ ] SSL certificate installed
- [ ] PM2 process running
- [ ] Logs being written
- [ ] Backup system configured
- [ ] MIME types working correctly (no JavaScript errors)

## 📞 Support
For deployment issues, check the logs in the `logs/` directory.
