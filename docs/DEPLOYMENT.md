# 🚀 Shared Wealth International - Deployment Guide

## 📋 **Overview**

This guide covers the complete deployment process for Shared Wealth International using Render, GitHub Actions, and automated CI/CD.

---

## 🎯 **Deployment Architecture**

### **Services:**
- **Frontend**: React + Vite (built and served by Node.js)
- **Backend**: Node.js + Express API
- **Database**: PostgreSQL on Render
- **Hosting**: Render Web Service
- **CI/CD**: GitHub Actions

### **Environment:**
- **Production**: `https://shared-wealth-international.onrender.com`
- **Staging**: `https://shared-wealth-international-staging.onrender.com`
- **Development**: Local development with `pnpm run dev`

---

## 🛠️ **Prerequisites**

### **Required Accounts:**
- ✅ **GitHub Account** - For code repository and CI/CD
- ✅ **Render Account** - For hosting and database
- ✅ **Domain Name** - `sharedwealth.net` (optional)

### **Required Tools:**
- ✅ **Node.js 18+** - For local development
- ✅ **pnpm** - Package manager
- ✅ **Git** - Version control

---

## 🚀 **Quick Start Deployment**

### **Step 1: Clean Up DirectAdmin Files**
```bash
# Remove DirectAdmin deployment files
./cleanup-directadmin.sh
```

### **Step 2: Set Up Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your repository: `shared-wealth-international-deploy`

### **Step 3: Create Database**
1. In Render dashboard, click "New +"
2. Select "PostgreSQL"
3. Configure:
   - **Name**: `shared-wealth-db`
   - **Plan**: Starter (1GB RAM, 1GB storage)
   - **Region**: Oregon (US West)
   - **Database**: `sharedwealth`
   - **User**: `sharedwealth`

### **Step 4: Create Web Service**
1. In Render dashboard, click "New +"
2. Select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `shared-wealth-international`
   - **Runtime**: Node.js 18
   - **Build Command**: `pnpm install && pnpm run build:prod && pnpm run server:build`
   - **Start Command**: `pnpm run server:start`
   - **Plan**: Starter (512MB RAM)

### **Step 5: Set Environment Variables**
In your Render web service, add these environment variables:

```bash
# Application
NODE_ENV=production
PORT=10000

# Database (from your PostgreSQL service)
DB_HOST=<your-postgres-host>
DB_USER=sharedwealth
DB_PASSWORD=<your-postgres-password>
DB_NAME=sharedwealth
DB_PORT=5432

# Security
JWT_SECRET=<generate-secure-secret>
SESSION_SECRET=<generate-secure-secret>
CSRF_SECRET=<generate-secure-secret>

# CORS
ALLOWED_ORIGINS=https://shared-wealth-international.onrender.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Request Limits
MAX_REQUEST_SIZE=10mb

# Database Connection
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT_MS=30000
DB_CONNECTION_TIMEOUT_MS=2000
```

### **Step 6: Deploy**
1. Click "Deploy" in Render dashboard
2. Wait for build to complete (5-10 minutes)
3. Your app will be available at: `https://shared-wealth-international.onrender.com`

---

## 🔄 **Automated CI/CD Setup**

### **GitHub Actions Configuration**

#### **1. Set Up Secrets**
In your GitHub repository, go to Settings → Secrets and add:
- `RENDER_API_KEY` - Your Render API key
- `RENDER_SERVICE_ID` - Your Render service ID

#### **2. Workflow Files**
The following workflow files are already configured:
- `.github/workflows/deploy.yml` - Automatic deployment
- `.github/workflows/test.yml` - Testing pipeline

#### **3. Deployment Triggers**
- **Push to `main`** → Production deployment
- **Push to `develop`** → Staging deployment
- **Pull Request** → Preview deployment

---

## 🗄️ **Database Management**

### **Initial Setup**
```bash
# Run database migrations
./scripts/migrate.sh
```

### **Database Operations**
```bash
# Check migration status
pnpm run migrations:status

# Run new migrations
pnpm run migrations:migrate

# Rollback migrations
pnpm run migrations:rollback

# Reset database
pnpm run migrations:reset
```

### **Backup Strategy**
- **Automatic**: Render provides daily backups
- **Manual**: Use Render dashboard to create backups
- **Export**: Use `pnpm run backup:create` for manual exports

---

## 🔧 **Environment Management**

### **Development Environment**
```bash
# Local development
pnpm run dev          # Start frontend dev server
pnpm run server:dev   # Start backend dev server
```

### **Production Environment**
```bash
# Production build
pnpm run build:prod   # Build frontend for production
pnpm run server:build # Build backend for production
pnpm run server:start # Start production server
```

### **Environment Variables**
- **Development**: `.env` file (not committed to Git)
- **Production**: Set in Render dashboard
- **Staging**: Set in Render dashboard

---

## 📊 **Monitoring & Logging**

### **Render Dashboard**
- **Service Health**: Monitor uptime and performance
- **Logs**: View application logs in real-time
- **Metrics**: CPU, memory, and request metrics
- **Alerts**: Set up alerts for downtime or errors

### **Application Monitoring**
- **Health Check**: `/api/health` endpoint
- **Metrics**: `/api/monitoring/metrics` endpoint
- **Logs**: Winston logging with multiple transports

### **Error Tracking**
- **Sentry**: Automatic error tracking (configured)
- **Render Logs**: Application and system logs
- **GitHub Actions**: Build and deployment logs

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Check build logs in Render dashboard
# Common causes:
# - Missing dependencies
# - TypeScript errors
# - Environment variable issues
```

#### **Database Connection Issues**
```bash
# Verify database credentials
# Check database service status
# Test connection with migrate script
```

#### **Deployment Issues**
```bash
# Check GitHub Actions logs
# Verify Render service status
# Test local build: pnpm run build:prod
```

### **Debug Commands**
```bash
# Local testing
pnpm run test         # Run all tests
pnpm run lint         # Check code quality
pnpm run type-check   # TypeScript validation

# Production testing
curl https://shared-wealth-international.onrender.com/api/health
```

---

## 🔒 **Security**

### **Environment Variables**
- ✅ **Never commit** `.env` files to Git
- ✅ **Use strong secrets** for JWT and session keys
- ✅ **Rotate secrets** regularly
- ✅ **Limit database access** to necessary IPs

### **Application Security**
- ✅ **HTTPS enforced** by Render
- ✅ **CORS configured** for allowed origins
- ✅ **Rate limiting** enabled
- ✅ **Input validation** on all endpoints
- ✅ **SQL injection protection** with parameterized queries

---

## 📈 **Scaling**

### **Render Plans**
- **Starter**: 512MB RAM, 0.1 CPU (Free tier)
- **Standard**: 1GB RAM, 0.5 CPU ($7/month)
- **Pro**: 2GB RAM, 1 CPU ($25/month)

### **Database Scaling**
- **Starter**: 1GB RAM, 1GB storage (Free tier)
- **Standard**: 1GB RAM, 10GB storage ($7/month)
- **Pro**: 2GB RAM, 25GB storage ($25/month)

### **Auto-scaling**
- **Render automatically scales** based on traffic
- **Database connections** are managed automatically
- **CDN** is included for static assets

---

## 🎯 **Best Practices**

### **Development**
- ✅ **Use feature branches** for new development
- ✅ **Write tests** for new features
- ✅ **Run linting** before commits
- ✅ **Use meaningful commit messages**

### **Deployment**
- ✅ **Test locally** before pushing
- ✅ **Monitor deployment** logs
- ✅ **Verify functionality** after deployment
- ✅ **Keep backups** of database

### **Maintenance**
- ✅ **Monitor performance** regularly
- ✅ **Update dependencies** monthly
- ✅ **Review logs** for errors
- ✅ **Test backup restoration** quarterly

---

## 📞 **Support**

### **Documentation**
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **GitHub Actions**: [docs.github.com/actions](https://docs.github.com/actions)
- **Node.js**: [nodejs.org/docs](https://nodejs.org/docs)

### **Community**
- **Render Community**: [community.render.com](https://community.render.com)
- **GitHub Issues**: Use repository issues for bugs
- **Stack Overflow**: Tag questions with `render`, `nodejs`, `react`

### **Emergency Contacts**
- **Render Support**: Available through dashboard
- **GitHub Support**: Available through repository
- **Domain Support**: Contact your domain provider

---

## 🎉 **Success Metrics**

### **Deployment Success**
- ✅ **Build time**: < 10 minutes
- ✅ **Deployment time**: < 5 minutes
- ✅ **Uptime**: > 99.9%
- ✅ **Response time**: < 500ms

### **Application Performance**
- ✅ **Page load time**: < 3 seconds
- ✅ **API response time**: < 200ms
- ✅ **Database queries**: < 100ms
- ✅ **Error rate**: < 0.1%

---

## 🚀 **Next Steps**

1. **Deploy to Render** using this guide
2. **Set up monitoring** and alerts
3. **Configure custom domain** (optional)
4. **Set up staging environment** for testing
5. **Implement backup strategies**
6. **Monitor performance** and optimize

**Your Shared Wealth International platform is now ready for production! 🎉**
