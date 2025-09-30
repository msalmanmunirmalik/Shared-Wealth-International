#!/bin/bash

# DirectAdmin Deployment Package Creator
# Creates a complete deployment package for DirectAdmin web control panel

set -e

echo "🚀 Creating DirectAdmin Deployment Package for Shared Wealth International"
echo "=================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PACKAGE_NAME="shared-wealth-directadmin"
DEPLOYMENT_DIR="./deployment"
PACKAGE_DIR="${DEPLOYMENT_DIR}/${PACKAGE_NAME}"

echo -e "${BLUE}📦 Creating deployment directory structure...${NC}"
rm -rf ${DEPLOYMENT_DIR}
mkdir -p ${PACKAGE_DIR}
mkdir -p ${PACKAGE_DIR}/public_html
mkdir -p ${PACKAGE_DIR}/logs
mkdir -p ${PACKAGE_DIR}/config

echo -e "${BLUE}🔨 Building production assets...${NC}"
# Build frontend for production
pnpm run build:prod

# Build server for production
pnpm run server:build

echo -e "${BLUE}📁 Copying production files...${NC}"

# Copy frontend build
cp -r dist/* ${PACKAGE_DIR}/public_html/

# Copy server build
cp -r dist/server ${PACKAGE_DIR}/

# Copy package.json and lock files
cp package.json ${PACKAGE_DIR}/
cp pnpm-lock.yaml ${PACKAGE_DIR}/ 2>/dev/null || echo "No pnpm-lock.yaml found"

# Copy production environment template
cp .env.production.template ${PACKAGE_DIR}/.env.production

# Copy PM2 ecosystem file
cp ecosystem.config.js ${PACKAGE_DIR}/ 2>/dev/null || echo "Creating ecosystem.config.js..."

# Create PM2 ecosystem file if it doesn't exist
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
# Shared Wealth International - DirectAdmin Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Upload Files
- Upload all files from this package to your domain's public_html directory
- Ensure all files maintain their directory structure

### 2. Install Dependencies
```bash
cd /home/yourusername/public_html
npm install -g pnpm
pnpm install --production
```

### 3. Configure Environment
- Copy `.env.production` to `.env`
- Update database credentials and domain settings
- Update JWT secrets and session secrets

### 4. Database Setup
- Create PostgreSQL database: `sharedwealth`
- Create user: `sharedwealth`
- Import database schema (if needed)

### 5. Install PM2
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Configure Nginx (if needed)
- Set up reverse proxy to port 8080
- Configure SSL certificates

## 📋 DirectAdmin Node.js Application Settings

### Node.js Version
- **Version**: Node.js 18.x or higher
- **Recommended**: Node.js 20.x LTS

### Application Configuration
- **Application Mode**: Production
- **NODE_ENV**: production
- **Application Root**: /home/yourusername/public_html
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
Shared Wealth International - DirectAdmin Deployment Package
==========================================================

Package Version: 1.0.0
Created: $(date)
Domain: sharedwealth.net

Contents:
- Frontend build (React + Vite)
- Backend build (Node.js + Express)
- Database schema
- PM2 configuration
- Deployment scripts
- Environment templates

Total Size: $(du -sh ${PACKAGE_DIR} | cut -f1)

Files:
- public_html/ (Frontend build)
- server/ (Backend build)
- ecosystem.config.js (PM2 config)
- .env.production (Environment template)
- setup-server.sh (Server setup script)
- setup-database.sql (Database schema)
- DEPLOYMENT_GUIDE.md (Complete deployment guide)

Next Steps:
1. Upload to DirectAdmin
2. Run setup-server.sh
3. Configure .env file
4. Setup database
5. Start with PM2

Support: Check DEPLOYMENT_GUIDE.md for detailed instructions
EOF

echo -e "${BLUE}📦 Creating deployment archive...${NC}"
cd ${DEPLOYMENT_DIR}
tar -czf "${PACKAGE_NAME}-$(date +%Y%m%d-%H%M%S).tar.gz" ${PACKAGE_NAME}

echo -e "${GREEN}✅ Deployment package created successfully!${NC}"
echo -e "${YELLOW}📁 Package location: ${DEPLOYMENT_DIR}/${PACKAGE_NAME}${NC}"
echo -e "${YELLOW}📦 Archive location: ${DEPLOYMENT_DIR}/${PACKAGE_NAME}-$(date +%Y%m%d-%H%M%S).tar.gz${NC}"
echo ""
echo -e "${BLUE}📋 Package Contents:${NC}"
ls -la ${PACKAGE_NAME}/
echo ""
echo -e "${GREEN}🚀 Ready for DirectAdmin deployment!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Upload the .tar.gz file to your DirectAdmin server"
echo "2. Extract it in your domain's public_html directory"
echo "3. Follow the DEPLOYMENT_GUIDE.md instructions"
echo ""
echo -e "${BLUE}📖 See DEPLOYMENT_GUIDE.md for complete deployment instructions${NC}"
