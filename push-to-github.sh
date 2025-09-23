#!/bin/bash

# Push latest commits to GitHub
# This script handles all the DirectAdmin deployment changes

echo "🚀 Pushing Shared Wealth International to GitHub"
echo "==============================================="

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this script from the project root."
    exit 1
fi

echo "📋 Checking git status..."

# Check git status
git status

echo ""
echo "📦 Adding new DirectAdmin deployment files..."

# Add new DirectAdmin deployment files
git add wealth-pioneers-network/DIRECTADMIN_DEPLOYMENT.md
git add wealth-pioneers-network/DIRECTADMIN_UPLOAD_INSTRUCTIONS.md
git add wealth-pioneers-network/directadmin-setup.sh
git add wealth-pioneers-network/directadmin-deploy.sh
git add wealth-pioneers-network/ecosystem.config.js
git add wealth-pioneers-network/.env.production.template

# Add other deployment files
git add wealth-pioneers-network/DEPLOYMENT_GUIDE.md
git add wealth-pioneers-network/DEPLOYMENT_READY.md
git add wealth-pioneers-network/deploy.sh
git add wealth-pioneers-network/quick-deploy.sh

# Add modified files (if any)
git add wealth-pioneers-network/src/services/api.ts
git add wealth-pioneers-network/src/pages/AboutUs.tsx
git add wealth-pioneers-network/server/controllers/userProfileController.ts
git add wealth-pioneers-network/database/schema.sql
git add wealth-pioneers-network/database/comprehensive_schema.sql
git add wealth-pioneers-network/env.development

echo "✅ Files added to git"

echo ""
echo "📝 Committing changes..."

# Commit with descriptive message
git commit -m "feat: Complete DirectAdmin deployment package and setup

- Add comprehensive DirectAdmin deployment guide
- Create automated setup scripts for DirectAdmin server
- Add PM2 ecosystem configuration for production
- Create deployment package with build artifacts
- Fix TypeScript compilation errors in userProfileController
- Update database schema to support 'director' role
- Fix frontend build issues (unterminated string, duplicate methods)
- Add production environment template
- Create upload instructions for DirectAdmin
- Prepare complete deployment package (3.5MB tar.gz)

Ready for DirectAdmin deployment with 50-70% cost savings vs cloud platforms."

echo "✅ Changes committed"

echo ""
echo "🚀 Pushing to GitHub..."

# Push to GitHub
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Code pushed to GitHub"
    echo "================================"
    echo ""
    echo "📋 What was pushed:"
    echo "  ✅ DirectAdmin deployment package"
    echo "  ✅ Automated setup scripts"
    echo "  ✅ Production configuration files"
    echo "  ✅ Bug fixes and improvements"
    echo "  ✅ Complete deployment documentation"
    echo ""
    echo "🌐 Your repository is now updated with all DirectAdmin deployment files!"
    echo "📦 Ready to deploy to your DirectAdmin server"
else
    echo ""
    echo "❌ Error: Failed to push to GitHub"
    echo "Please check your git configuration and try again"
    exit 1
fi
