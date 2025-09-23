# 🚀 DIRECTADMIN NODE.JS APPLICATION CONFIGURATION

## 📋 **DIRECTADMIN SETTINGS FOR SHARED WEALTH INTERNATIONAL**

### **Node.js Version**
```
18.x (or latest stable)
```

### **Application Mode**
```
Production
```

### **NODE_ENV Variable**
```
NODE_ENV=production
```

### **Application Root**
```
/home/your-username/domains/sharedwealth.net/public_html
```
*Replace `your-username` with your actual DirectAdmin username*

### **GitHub Repository**
```
https://github.com/msalmanmunirmalik/shared-wealth-international-deploy.git
```

### **Application URL**
```
https://sharedwealth.net
```

### **Application Startup File**
```
dist/server/server.js
```

---

## 🔧 **ENVIRONMENT VARIABLES**

Add these environment variables in your DirectAdmin Node.js application settings:

### **Core Configuration**
```env
NODE_ENV=production
PORT=8080
```

### **Database Configuration**
```env
DB_HOST=localhost
DB_USER=sharedwealth
DB_PASSWORD=your_secure_password_here
DB_NAME=sharedwealth
DB_PORT=5432
```

### **JWT Configuration**
```env
JWT_SECRET=sharedwealth-jwt-secret-key-2024-production-must-be-32-chars-minimum
JWT_EXPIRES_IN=7d
```

### **Session Configuration**
```env
SESSION_SECRET=sharedwealth-session-secret-2024-production-key
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_HTTP_ONLY=true
SESSION_COOKIE_SAME_SITE=strict
```

### **CSRF Configuration**
```env
CSRF_SECRET=sharedwealth-csrf-secret-2024-production-key
```

### **Security Configuration**
```env
ALLOWED_ORIGINS=https://sharedwealth.net,https://www.sharedwealth.net
```

### **Rate Limiting Configuration**
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
```

### **Request Limits**
```env
MAX_REQUEST_SIZE=10mb
```

### **Database Connection Limits**
```env
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT_MS=30000
DB_CONNECTION_TIMEOUT_MS=2000
```

---

## 📦 **DEPLOYMENT STEPS FOR DIRECTADMIN**

### **Step 1: Create Node.js Application**
1. Login to DirectAdmin
2. Go to "Node.js Selector"
3. Click "Create Node.js App"
4. Fill in the settings above

### **Step 2: Clone Repository**
```bash
cd /home/your-username/domains/sharedwealth.net/public_html
git clone https://github.com/msalmanmunirmalik/shared-wealth-international-deploy.git .
cd wealth-pioneers-network
```

### **Step 3: Install Dependencies**
```bash
pnpm install
```

### **Step 4: Build Application**
```bash
pnpm run build
pnpm run server:build
```

### **Step 5: Setup Database**
```bash
# Install PostgreSQL if not already installed
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE sharedwealth;"
sudo -u postgres psql -c "CREATE USER sharedwealth WITH ENCRYPTED PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE sharedwealth TO sharedwealth;"

# Run schema
psql -h localhost -U sharedwealth -d sharedwealth -f database/schema.sql
```

### **Step 6: Start Application**
```bash
# Using DirectAdmin Node.js selector
# Or manually with PM2
npm install -g pm2
pm2 start dist/server/server.js --name "shared-wealth"
pm2 save
pm2 startup
```

---

## 🌐 **DOMAIN CONFIGURATION**

### **Main Domain**
- **Domain:** `sharedwealth.net`
- **Subdomain:** `www.sharedwealth.net` (optional)
- **SSL:** Enable Let's Encrypt SSL certificate

### **Application Structure**
```
https://sharedwealth.net/          → Frontend (React)
https://sharedwealth.net/api/      → Backend API (Node.js)
```

---

## 🔒 **SECURITY SETTINGS**

### **SSL Configuration**
- Enable SSL certificate in DirectAdmin
- Force HTTPS redirect
- Use Let's Encrypt for free SSL

### **Firewall Settings**
- Open port 8080 for Node.js application
- Configure CORS for your domain
- Set up rate limiting

---

## 📊 **MONITORING & MAINTENANCE**

### **Log Files**
- Application logs: `/home/your-username/domains/sharedwealth.net/logs/`
- Error logs: Check DirectAdmin error logs
- Access logs: Check DirectAdmin access logs

### **Health Checks**
```bash
# Test API endpoint
curl https://sharedwealth.net/api/health

# Test frontend
curl https://sharedwealth.net
```

---

## 🎯 **QUICK SETUP SUMMARY**

1. **Node.js Version:** 18.x
2. **Application Mode:** Production
3. **NODE_ENV:** production
4. **Application Root:** `/home/your-username/domains/sharedwealth.net/public_html`
5. **GitHub Repo:** `https://github.com/msalmanmunirmalik/shared-wealth-international-deploy.git`
6. **Application URL:** `https://sharedwealth.net`
7. **Startup File:** `dist/server/server.js`
8. **Environment Variables:** See list above

---

## 🚀 **READY FOR DEPLOYMENT!**

Your DirectAdmin configuration is complete. The application will be accessible at `https://sharedwealth.net` with full frontend and API functionality.
