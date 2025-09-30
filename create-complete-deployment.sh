#!/bin/bash

# Complete DirectAdmin Deployment Package Creator
# Creates a properly structured deployment package with frontend and backend

set -e

echo "🚀 Creating Complete DirectAdmin Deployment Package"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ZIP_NAME="shared-wealth-complete-$(date +%Y%m%d-%H%M%S).zip"
DEPLOYMENT_DIR="./complete-deployment"
PACKAGE_DIR="${DEPLOYMENT_DIR}/shared-wealth-app"

echo -e "${BLUE}📦 Creating clean deployment directory...${NC}"
rm -rf ${DEPLOYMENT_DIR}
mkdir -p ${PACKAGE_DIR}

echo -e "${BLUE}🔨 Building production assets...${NC}"
# Build frontend for production
pnpm run build:prod

# Build server for production
pnpm run server:build

echo -e "${BLUE}📁 Copying files with correct structure...${NC}"

# Copy package.json and lock files to root
cp package.json ${PACKAGE_DIR}/
cp pnpm-lock.yaml ${PACKAGE_DIR}/

# Copy production environment template
cp .env.production.template ${PACKAGE_DIR}/.env.production

# Copy PM2 ecosystem file
cp ecosystem.config.js ${PACKAGE_DIR}/

# Copy server build to root (not in public_html)
cp -r dist/server ${PACKAGE_DIR}/

# Copy frontend build to public_html
mkdir -p ${PACKAGE_DIR}/public_html
cp -r dist/* ${PACKAGE_DIR}/public_html/

# Remove server files from public_html (they should be in root)
rm -rf ${PACKAGE_DIR}/public_html/server

# Create logs directory
mkdir -p ${PACKAGE_DIR}/logs

echo -e "${BLUE}🔧 Creating MIME type configuration files...${NC}"

# Create .htaccess for Apache (fixes MIME types)
cat > ${PACKAGE_DIR}/public_html/.htaccess << 'EOF'
# Shared Wealth International - Apache Configuration
# Fixes MIME type issues for JavaScript modules

# Enable rewrite engine
RewriteEngine On

# Force correct MIME types for JavaScript modules
<FilesMatch "\.(js|mjs)$">
    Header set Content-Type "text/javascript; charset=utf-8"
    ForceType text/javascript
</FilesMatch>

# Force correct MIME type for CSS
<FilesMatch "\.css$">
    Header set Content-Type "text/css; charset=utf-8"
    ForceType text/css
</FilesMatch>

# Force correct MIME type for HTML
<FilesMatch "\.html$">
    Header set Content-Type "text/html; charset=utf-8"
    ForceType text/html
</FilesMatch>

# Force correct MIME type for JSON
<FilesMatch "\.json$">
    Header set Content-Type "application/json; charset=utf-8"
    ForceType application/json
</FilesMatch>

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache control for static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
    Header set Cache-Control "public, max-age=2592000"
</FilesMatch>

# Cache control for HTML
<FilesMatch "\.html$">
    ExpiresActive On
    ExpiresDefault "access plus 1 hour"
    Header set Cache-Control "public, max-age=3600"
</FilesMatch>

# Fallback for React Router (SPA)
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Handle Angular and React Router
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /index.html [QSA,L]
    
    # Redirect API calls to backend
    RewriteRule ^api/(.*)$ http://localhost:8080/api/$1 [P,L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>
EOF

# Create nginx configuration
cat > ${PACKAGE_DIR}/nginx.conf << 'EOF'
# Shared Wealth International - Nginx Configuration
# Fixes MIME type issues for JavaScript modules

server {
    listen 80;
    server_name sharedwealth.net www.sharedwealth.net;
    root /home/yourusername/public_html;
    index index.html;

    # MIME type configuration
    location ~* \.(js|mjs)$ {
        add_header Content-Type "text/javascript; charset=utf-8";
        expires 1M;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.css$ {
        add_header Content-Type "text/css; charset=utf-8";
        expires 1M;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.html$ {
        add_header Content-Type "text/html; charset=utf-8";
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    location ~* \.json$ {
        add_header Content-Type "application/json; charset=utf-8";
        expires 1h;
    }

    # Security headers
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location / {
        try_files $uri $uri/ /index.html;
        
        # Enable gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_proxied expired no-cache no-store private must-revalidate auth;
        gzip_types
            text/plain
            text/css
            text/xml
            text/javascript
            application/javascript
            application/xml+rss
            application/json;
    }

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1M;
        access_log off;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Create web.config for IIS
cat > ${PACKAGE_DIR}/web.config << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <!-- MIME type configuration -->
        <staticContent>
            <mimeMap fileExtension=".js" mimeType="text/javascript" />
            <mimeMap fileExtension=".mjs" mimeType="text/javascript" />
            <mimeMap fileExtension=".css" mimeType="text/css" />
            <mimeMap fileExtension=".json" mimeType="application/json" />
        </staticContent>
        
        <!-- URL Rewrite for React Router -->
        <rewrite>
            <rules>
                <rule name="React Router" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/" />
                </rule>
            </rules>
        </rewrite>
        
        <!-- Security headers -->
        <httpProtocol>
            <customHeaders>
                <add name="X-Content-Type-Options" value="nosniff" />
                <add name="X-Frame-Options" value="DENY" />
                <add name="X-XSS-Protection" value="1; mode=block" />
                <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
            </customHeaders>
        </httpProtocol>
        
        <!-- Compression -->
        <urlCompression doStaticCompression="true" doDynamicCompression="true" />
    </system.webServer>
</configuration>
EOF

# Update PM2 ecosystem file for correct structure
cat > ${PACKAGE_DIR}/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'shared-wealth-api',
      script: 'server/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
      error_file: 'logs/api-error.log',
      out_file: 'logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
EOF

echo -e "${BLUE}📋 Creating deployment documentation...${NC}"

# Create comprehensive deployment guide
cat > ${PACKAGE_DIR}/DEPLOYMENT_GUIDE.md << 'EOF'
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
EOF

# Create server setup script
cat > ${PACKAGE_DIR}/setup-server.sh << 'EOF'
#!/bin/bash

echo "🔧 Setting up Shared Wealth International Server"

# Install Node.js 20.x if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PNPM
echo "Installing PNPM..."
npm install -g pnpm

# Install PM2
echo "Installing PM2..."
npm install -g pm2

# Install production dependencies
echo "Installing production dependencies..."
pnpm install --production

# Create logs directory
mkdir -p logs

# Set permissions
chmod +x setup-server.sh
chmod 755 logs/

echo "✅ Server setup complete!"
echo "Next steps:"
echo "1. Configure .env file with your database credentials"
echo "2. Start the application with: pm2 start ecosystem.config.js"
echo "3. Save PM2 configuration: pm2 save"
echo "4. Setup PM2 startup: pm2 startup"
EOF

chmod +x ${PACKAGE_DIR}/setup-server.sh

# Create database setup script
cat > ${PACKAGE_DIR}/setup-database.sql << 'EOF'
-- Shared Wealth International Database Setup
-- Run this script in your PostgreSQL database

-- Create database (run as postgres user)
-- CREATE DATABASE sharedwealth;

-- Create user (run as postgres user)
-- CREATE USER sharedwealth WITH PASSWORD 'your-secure-password';
-- GRANT ALL PRIVILEGES ON DATABASE sharedwealth TO sharedwealth;

-- Connect to sharedwealth database and run the following:

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin', 'director')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    company_name VARCHAR(255),
    position VARCHAR(100),
    location VARCHAR(255),
    linkedin VARCHAR(255),
    twitter VARCHAR(255),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    location VARCHAR(255),
    website VARCHAR(255),
    countries TEXT[],
    status VARCHAR(50) DEFAULT 'pending',
    applicant_user_id UUID REFERENCES users(id),
    created_by_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_companies relationship table
CREATE TABLE IF NOT EXISTS user_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    role VARCHAR(100),
    position VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, company_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);

-- Insert default admin user (password: Admin123!)
INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified) 
VALUES ('admin@sharedwealth.net', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4Y/7yQxK2S', 'superadmin', 'Admin', 'User', true, true)
ON CONFLICT (email) DO NOTHING;

COMMIT;
EOF

# Create package info file
cat > ${PACKAGE_DIR}/PACKAGE_INFO.txt << EOF
Shared Wealth International - Complete Deployment Package
======================================================

Package Version: 3.0.0 (Complete Frontend + Backend)
Created: $(date)
Domain: sharedwealth.net

Contents:
- Complete frontend build (React + Vite) with MIME type fixes
- Complete backend build (Node.js + Express)
- Database schema
- PM2 configuration
- Deployment scripts
- Environment templates
- Web server configurations (.htaccess, nginx.conf, web.config)

MIME Type Fixes Included:
- .htaccess (Apache)
- nginx.conf (Nginx)
- web.config (IIS)

Total Size: $(du -sh ${PACKAGE_DIR} | cut -f1)

Files:
- package.json (Node.js dependencies)
- pnpm-lock.yaml (Lock file)
- server/ (Complete backend build)
- public_html/ (Complete frontend build with MIME type fixes)
- ecosystem.config.js (PM2 config)
- .env.production (Environment template)
- setup-server.sh (Server setup script)
- setup-database.sql (Database schema)
- DEPLOYMENT_GUIDE.md (Complete deployment guide)
- .htaccess (Apache MIME type fixes)
- nginx.conf (Nginx configuration)
- web.config (IIS configuration)

Next Steps:
1. Upload to DirectAdmin
2. Run setup-server.sh
3. Configure .env file
4. Setup database
5. Start with PM2

Support: Check DEPLOYMENT_GUIDE.md for detailed instructions
EOF

echo -e "${BLUE}📦 Creating deployment ZIP archive...${NC}"
cd ${DEPLOYMENT_DIR}
zip -r "${ZIP_NAME}" shared-wealth-app

echo -e "${GREEN}✅ Complete deployment ZIP created successfully!${NC}"
echo -e "${YELLOW}📁 Package location: ${DEPLOYMENT_DIR}/shared-wealth-app${NC}"
echo -e "${YELLOW}📦 ZIP Archive location: ${DEPLOYMENT_DIR}/${ZIP_NAME}${NC}"
echo ""
echo -e "${BLUE}📋 Package Contents:${NC}"
ls -la shared-wealth-app/
echo ""
echo -e "${BLUE}📋 Server Files:${NC}"
ls -la shared-wealth-app/server/
echo ""
echo -e "${BLUE}📋 Frontend Files:${NC}"
ls -la shared-wealth-app/public_html/ | head -10
echo ""
echo -e "${GREEN}🚀 Ready for DirectAdmin deployment with complete frontend and backend!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Upload the ZIP file to DirectAdmin"
echo "2. Extract it in your domain's root directory"
echo "3. Follow the DEPLOYMENT_GUIDE.md instructions"
echo ""
echo -e "${BLUE}🔧 MIME Type Fixes Included:${NC}"
echo "✅ .htaccess (Apache - automatically applied)"
echo "✅ nginx.conf (Nginx configuration)"
echo "✅ web.config (IIS configuration)"
echo ""
echo -e "${GREEN}This package includes complete frontend AND backend with MIME type fixes!${NC}"
