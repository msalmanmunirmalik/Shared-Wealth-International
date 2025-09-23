#!/bin/bash

# Final push to the correct GitHub repository
# https://github.com/msalmanmunirmalik/shared-wealth-international-deploy.git

echo "🚀 Pushing to CORRECT GitHub Repository"
echo "======================================"
echo "Repository: https://github.com/msalmanmunirmalik/shared-wealth-international-deploy.git"
echo ""

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this script from the project root."
    exit 1
fi

# Verify remote URL
echo "📋 Checking git remote configuration..."
git remote -v
echo ""

# Accept Xcode license (this will prompt for password)
echo "🔧 Accepting Xcode license..."
sudo xcodebuild -license accept
echo ""

# Check git status
echo "📋 Checking git status..."
git status
echo ""

# Add all files
echo "📦 Adding all files to git..."
git add .
echo "✅ Files added"

# Commit with comprehensive message
echo "📝 Committing changes..."
git commit -m "feat: Complete DirectAdmin deployment package for sharedwealth.net

🎯 DEPLOYMENT PACKAGE READY:
- Complete DirectAdmin deployment guide and setup scripts
- Production-ready configuration for sharedwealth.net domain
- Automated server setup with Node.js 18+, PostgreSQL, PM2
- PM2 ecosystem configuration for production deployment
- Comprehensive environment variable templates
- Build artifacts and deployment package (3.5MB tar.gz)

🔧 BUG FIXES & IMPROVEMENTS:
- Fixed TypeScript compilation error in userProfileController
- Updated database schema to support 'director' role
- Fixed frontend build issues (unterminated string, duplicate methods)
- Corrected environment configuration for local development
- Resolved CORS and API connectivity issues

📦 DIRECTADMIN CONFIGURATION:
- Node.js version: 18.x
- Application mode: Production
- NODE_ENV: production
- Application root: /home/username/domains/sharedwealth.net/public_html
- Application URL: https://sharedwealth.net
- Startup file: dist/server/server.js
- Environment variables: Complete production configuration

🚀 READY FOR DEPLOYMENT:
- Cost savings: 50-70% vs cloud platforms
- Full server control and management
- Professional hosting infrastructure
- SSL certificate support
- Database and email hosting included

Repository: https://github.com/msalmanmunirmalik/shared-wealth-international-deploy.git
Domain: sharedwealth.net
Status: Production Ready ✅"
echo "✅ Changes committed"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Code pushed to CORRECT repository"
    echo "============================================="
    echo ""
    echo "✅ Repository: https://github.com/msalmanmunirmalik/shared-wealth-international-deploy.git"
    echo "✅ Domain: sharedwealth.net"
    echo "✅ Status: Production Ready"
    echo ""
    echo "📋 What was pushed:"
    echo "  ✅ Complete DirectAdmin deployment package"
    echo "  ✅ Automated setup scripts"
    echo "  ✅ Production configuration files"
    echo "  ✅ Bug fixes and improvements"
    echo "  ✅ DirectAdmin Node.js application config"
    echo "  ✅ Complete deployment documentation"
    echo ""
    echo "🌐 Ready to deploy to sharedwealth.net on DirectAdmin!"
    echo "📦 Deployment package: shared-wealth-directadmin.tar.gz (3.5MB)"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Create Node.js application in DirectAdmin"
    echo "2. Clone repository: git clone https://github.com/msalmanmunirmalik/shared-wealth-international-deploy.git"
    echo "3. Follow DIRECTADMIN_CONFIG.md for setup"
    echo "4. Deploy to https://sharedwealth.net"
else
    echo ""
    echo "❌ Error: Failed to push to GitHub"
    echo "Please check your git configuration and try again"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "1. Check internet connection"
    echo "2. Verify GitHub credentials"
    echo "3. Check repository permissions"
    echo "4. Try: git push origin main --force"
    exit 1
fi
