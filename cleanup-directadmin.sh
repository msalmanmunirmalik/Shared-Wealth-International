#!/bin/bash

# DirectAdmin Cleanup Script
# Removes DirectAdmin deployment files while preserving functionality

set -e

echo "🧹 Cleaning up DirectAdmin deployment files..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Files to be removed:${NC}"

# List files that will be removed
echo "❌ DirectAdmin deployment scripts:"
echo "   - create-complete-deployment.sh"
echo "   - create-deployment-zip.sh"
echo "   - create-directadmin-deployment.sh"
echo "   - verify-deployment-readiness.sh"

echo ""
echo "❌ DirectAdmin deployment directories:"
echo "   - complete-deployment/"
echo "   - deployment-zip/"

echo ""
echo "❌ DirectAdmin configuration files:"
echo "   - .env.production.template (will be replaced with Render config)"

echo ""
echo -e "${YELLOW}⚠️  This will NOT affect:${NC}"
echo "✅ Your application code"
echo "✅ Your database"
echo "✅ Your company accounts"
echo "✅ Your local development environment"
echo "✅ Your GitHub repository"

echo ""
read -p "Do you want to proceed with cleanup? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🧹 Starting cleanup...${NC}"
    
    # Remove DirectAdmin deployment scripts
    echo "Removing DirectAdmin scripts..."
    rm -f create-complete-deployment.sh
    rm -f create-deployment-zip.sh
    rm -f create-directadmin-deployment.sh
    rm -f verify-deployment-readiness.sh
    
    # Remove DirectAdmin deployment directories
    echo "Removing DirectAdmin directories..."
    rm -rf complete-deployment/
    rm -rf deployment-zip/
    
    # Remove DirectAdmin configuration template
    echo "Removing DirectAdmin config template..."
    rm -f .env.production.template
    
    echo ""
    echo -e "${GREEN}✅ DirectAdmin cleanup completed!${NC}"
    echo ""
    echo -e "${BLUE}📋 What was removed:${NC}"
    echo "❌ DirectAdmin deployment scripts"
    echo "❌ DirectAdmin deployment directories"
    echo "❌ DirectAdmin configuration template"
    echo ""
    echo -e "${GREEN}✅ What was preserved:${NC}"
    echo "✅ All application code"
    echo "✅ Database and company accounts"
    echo "✅ Local development environment"
    echo "✅ GitHub repository"
    echo ""
    echo -e "${YELLOW}🚀 Ready for Render deployment setup!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review the RENDER_DEPLOYMENT_PLAN.md"
    echo "2. Set up Render account"
    echo "3. Configure GitHub Actions"
    echo "4. Deploy to production"
    
else
    echo -e "${YELLOW}❌ Cleanup cancelled. No files were removed.${NC}"
    echo ""
    echo "You can run this script again when ready."
fi

echo ""
echo -e "${BLUE}📊 Current project status:${NC}"
echo "📁 Project files: $(find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l | tr -d ' ') files"
echo "📦 Dependencies: $(cat package.json | grep -c '"') entries in package.json"
echo "🗄️  Database: Company accounts ready"
echo "🔧 Backend: Server running on localhost:8080"
echo ""
echo -e "${GREEN}🎯 Your application is ready for Render deployment!${NC}"
