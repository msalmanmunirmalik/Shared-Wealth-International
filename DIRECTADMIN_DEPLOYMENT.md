# 🚀 **DIRECTADMIN DEPLOYMENT GUIDE**
## Shared Wealth International - Wealth Pioneers Network

---

## **✅ DIRECTADMIN SERVER SETUP**

Your PHP 8.2 DirectAdmin server is perfect for hosting this Node.js application! DirectAdmin provides excellent control and flexibility for deploying modern applications.

---

## **📋 PRE-DEPLOYMENT CHECKLIST**

### **Server Requirements:**
- ✅ **Operating System:** Linux (CentOS/RHEL/Ubuntu)
- ✅ **PHP:** 8.2 (already installed)
- ✅ **DirectAdmin:** Installed and configured
- ⚠️ **Node.js:** Need to install (we'll guide you)
- ⚠️ **PostgreSQL:** Need to install (we'll guide you)
- ⚠️ **PM2:** Need to install for process management

---

## **🔧 STEP 1: SERVER PREPARATION**

### **1.1 Access Your Server**
```bash
# SSH into your DirectAdmin server
ssh root@your-server-ip
# or
ssh username@your-server-ip
```

### **1.2 Update System**
```bash
# For CentOS/RHEL
sudo yum update -y

# For Ubuntu/Debian
sudo apt update && sudo apt upgrade -y
```

---

## **📦 STEP 2: INSTALL NODE.JS 18+**

### **2.1 Install Node.js via NodeSource**
```bash
# Download and install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# For CentOS/RHEL
sudo yum install -y nodejs

# For Ubuntu/Debian
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x or higher
npm --version
```

### **2.2 Install PNPM (Package Manager)**
```bash
# Install PNPM globally
sudo npm install -g pnpm

# Verify installation
pnpm --version
```

### **2.3 Install PM2 (Process Manager)**
```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version

# Setup PM2 startup script
pm2 startup
# Follow the instructions provided by PM2
```

---

## **🗄️ STEP 3: INSTALL POSTGRESQL**

### **3.1 Install PostgreSQL**
```bash
# For CentOS/RHEL
sudo yum install -y postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql

# For Ubuntu/Debian
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### **3.2 Configure PostgreSQL**
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE sharedwealth;
CREATE USER sharedwealth WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE sharedwealth TO sharedwealth;
\q
```

### **3.3 Configure PostgreSQL for Remote Access**
```bash
# Edit postgresql.conf
sudo nano /var/lib/pgsql/data/postgresql.conf
# or for Ubuntu/Debian
sudo nano /etc/postgresql/*/main/postgresql.conf

# Find and uncomment:
listen_addresses = 'localhost'

# Edit pg_hba.conf
sudo nano /var/lib/pgsql/data/pg_hba.conf
# or for Ubuntu/Debian
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Add this line:
local   all             sharedwealth                              md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## **📁 STEP 4: DEPLOY APPLICATION**

### **4.1 Create Application Directory**
```bash
# Create application directory in your DirectAdmin user space
cd /home/your-username/domains/your-domain.com/public_html
# or create a subdomain
mkdir -p /home/your-username/domains/api.your-domain.com/public_html
cd /home/your-username/domains/api.your-domain.com/public_html
```

### **4.2 Upload Application Files**
```bash
# Method 1: Git clone (if you have Git installed)
git clone https://github.com/yourusername/shared-wealth-international.git .
cd shared-wealth-international

# Method 2: Upload via DirectAdmin File Manager
# Upload the shared-wealth-international folder contents to your domain directory
```

### **4.3 Install Dependencies**
```bash
# Install project dependencies
pnpm install

# Build the application
pnpm run build
pnpm run server:build
```

---

## **⚙️ STEP 5: CONFIGURE ENVIRONMENT**

### **5.1 Create Production Environment File**
```bash
# Create .env file
nano .env
```

### **5.2 Add Environment Variables**
```env
# Production Environment Variables
NODE_ENV=production
PORT=8080

# Database Configuration
DB_HOST=localhost
DB_USER=sharedwealth
DB_PASSWORD=your_secure_password
DB_NAME=sharedwealth
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-must-be-at-least-32-characters
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=wealth-pioneers-session-secret-2024-production
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_HTTP_ONLY=true
SESSION_COOKIE_SAME_SITE=strict

# CSRF Configuration
CSRF_SECRET=wealth-pioneers-csrf-secret-2024-production

# Security Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://api.yourdomain.com

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Request Limits
MAX_REQUEST_SIZE=10mb

# Database Connection Limits
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT_MS=30000
DB_CONNECTION_TIMEOUT_MS=2000
```

---

## **🗄️ STEP 6: DATABASE SETUP**

### **6.1 Run Database Migrations**
```bash
# Connect to database and run schema
psql -h localhost -U sharedwealth -d sharedwealth -f database/schema.sql

# Create admin user
psql -h localhost -U sharedwealth -d sharedwealth -c "
INSERT INTO users (email, password_hash, role, first_name, last_name) 
VALUES ('admin@sharedwealth.com', '\$2a\$12\$hash', 'superadmin', 'Admin', 'User');
"
```

### **6.2 Verify Database Connection**
```bash
# Test database connection
psql -h localhost -U sharedwealth -d sharedwealth -c "SELECT COUNT(*) FROM users;"
```

---

## **🚀 STEP 7: START APPLICATION WITH PM2**

### **7.1 Create PM2 Ecosystem File**
```bash
# Create PM2 configuration
nano ecosystem.config.js
```

### **7.2 Add PM2 Configuration**
```javascript
module.exports = {
  apps: [{
    name: 'shared-wealth-backend',
    script: 'dist/server/server.js',
    cwd: '/home/your-username/domains/api.your-domain.com/public_html',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

### **7.3 Start Application**
```bash
# Create logs directory
mkdir logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs
```

---

## **🌐 STEP 8: CONFIGURE NGINX/APACHE**

### **8.1 For Nginx (if using Nginx)**
```bash
# Create Nginx configuration
sudo nano /etc/nginx/conf.d/sharedwealth.conf
```

### **8.2 Nginx Configuration**
```nginx
# Backend API (Node.js)
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
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
}

# Frontend (Static files)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /home/your-username/domains/your-domain.com/public_html/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
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
}
```

### **8.3 For Apache (DirectAdmin default)**
```bash
# Create .htaccess file for frontend
nano /home/your-username/domains/your-domain.com/public_html/.htaccess
```

### **8.4 Apache .htaccess Configuration**
```apache
RewriteEngine On

# Handle Angular/React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Proxy API requests to Node.js
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ http://localhost:8080/api/$1 [P,L]
```

---

## **🔒 STEP 9: SSL CERTIFICATE SETUP**

### **9.1 Using DirectAdmin SSL**
1. Login to DirectAdmin
2. Go to "SSL Certificates"
3. Generate Let's Encrypt certificate
4. Enable SSL for your domain

### **9.2 Manual SSL with Certbot**
```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx
# or for Ubuntu/Debian
sudo apt install -y certbot python3-certbot-apache

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
# or for Apache
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

---

## **📊 STEP 10: MONITORING & MAINTENANCE**

### **10.1 PM2 Monitoring**
```bash
# Monitor application
pm2 monit

# View logs
pm2 logs shared-wealth-backend

# Restart application
pm2 restart shared-wealth-backend

# Stop application
pm2 stop shared-wealth-backend
```

### **10.2 Health Checks**
```bash
# Test API endpoints
curl http://localhost:8080/api/health
curl https://api.yourdomain.com/api/health

# Test frontend
curl https://yourdomain.com
```

### **10.3 Database Backup**
```bash
# Create backup script
nano backup.sh
```

### **10.4 Backup Script**
```bash
#!/bin/bash
# Database backup
pg_dump -h localhost -U sharedwealth sharedwealth > /home/your-username/backups/sharedwealth_$(date +%Y%m%d_%H%M%S).sql

# File backup
tar -czf /home/your-username/backups/uploads_$(date +%Y%m%d_%H%M%S).tar.gz uploads/

# Keep only last 7 days of backups
find /home/your-username/backups/ -name "*.sql" -mtime +7 -delete
find /home/your-username/backups/ -name "*.tar.gz" -mtime +7 -delete
```

---

## **🧪 STEP 11: TESTING DEPLOYMENT**

### **11.1 Test Checklist**
- [ ] Frontend loads at `https://yourdomain.com`
- [ ] API responds at `https://api.yourdomain.com/api/health`
- [ ] User registration works
- [ ] User login works
- [ ] Database operations work
- [ ] File uploads work
- [ ] SSL certificate is valid
- [ ] PM2 process is running

### **11.2 Performance Testing**
```bash
# Load testing
ab -n 1000 -c 10 https://yourdomain.com/api/health

# Check server resources
htop
df -h
free -m
```

---

## **🔧 TROUBLESHOOTING**

### **Common Issues:**

1. **Node.js not found:**
   ```bash
   # Check Node.js installation
   which node
   node --version
   ```

2. **PM2 not starting:**
   ```bash
   # Check PM2 logs
   pm2 logs
   # Check application logs
   cat logs/err.log
   ```

3. **Database connection failed:**
   ```bash
   # Test database connection
   psql -h localhost -U sharedwealth -d sharedwealth
   # Check PostgreSQL status
   sudo systemctl status postgresql
   ```

4. **Port 8080 not accessible:**
   ```bash
   # Check if port is open
   netstat -tlnp | grep 8080
   # Check firewall
   sudo firewall-cmd --list-ports
   ```

---

## **💰 COST OPTIMIZATION**

### **DirectAdmin Hosting Benefits:**
- ✅ **Cost-effective:** Much cheaper than cloud platforms
- ✅ **Full control:** Complete server access
- ✅ **Multiple domains:** Host multiple projects
- ✅ **Email hosting:** Built-in email server
- ✅ **Database hosting:** PostgreSQL/MySQL included

### **Estimated Costs:**
- **DirectAdmin License:** $2-10/month
- **Server/VPS:** $5-20/month
- **Domain:** $10-15/year
- **Total:** $7-30/month (vs $25-50/month on cloud platforms)

---

## **🎉 SUCCESS!**

Your Shared Wealth International platform is now deployed on your DirectAdmin server!

### **Access URLs:**
- **Frontend:** `https://yourdomain.com`
- **API:** `https://api.yourdomain.com`
- **Admin:** `admin@sharedwealth.com` / `admin123`

### **Management Commands:**
```bash
# Start application
pm2 start ecosystem.config.js

# Stop application
pm2 stop shared-wealth-backend

# Restart application
pm2 restart shared-wealth-backend

# View logs
pm2 logs shared-wealth-backend

# Monitor resources
pm2 monit
```

**🚀 Your platform is live and ready for users!**
