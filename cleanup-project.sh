#!/bin/bash

# Project Cleanup Script
# Removes unnecessary files while preserving functionality

set -e

echo "🧹 SHARED WEALTH INTERNATIONAL - PROJECT CLEANUP"
echo "==============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
FILES_REMOVED=0
DIRS_REMOVED=0

remove_safe() {
    local path="$1"
    local description="$2"
    
    if [ -e "$path" ]; then
        echo -e "${YELLOW}🗑️  Removing: $description${NC}"
        if [ -d "$path" ]; then
            rm -rf "$path"
            DIRS_REMOVED=$((DIRS_REMOVED + 1))
        else
            rm -f "$path"
            FILES_REMOVED=$((FILES_REMOVED + 1))
        fi
    fi
}

echo -e "${BLUE}📋 ANALYZING PROJECT STRUCTURE${NC}"
echo ""

# Change to wealth-pioneers-network directory
cd "/Users/m.salmanmalik/Development Projects/Shared Wealth International/wealth-pioneers-network"

echo -e "${BLUE}🧹 CLEANING UP UNNECESSARY FILES${NC}"
echo ""

# 1. Remove log files
echo -e "${YELLOW}📝 Removing log files...${NC}"
remove_safe "*.log" "Log files"
remove_safe "logs/" "Logs directory"
remove_safe "backend.log" "Backend log"
remove_safe "frontend.log" "Frontend log"
remove_safe "server.log" "Server log"
remove_safe "dev-*.log" "Development log files"
remove_safe "preview-*.log" "Preview log files"

# 2. Remove temporary and test files
echo -e "${YELLOW}🧪 Removing test and temporary files...${NC}"
remove_safe "*-test.html" "Test HTML files"
remove_safe "test*.html" "Test HTML files"
remove_safe "debug-*.html" "Debug HTML files"
remove_safe "admin-*.html" "Admin test HTML files"
remove_safe "temp/" "Temporary directory"
remove_safe "_temp_disabled/" "Disabled temporary directory"
remove_safe "test-results/" "Test results directory"
remove_safe "coverage/" "Test coverage directory"

# 3. Remove development and deployment artifacts
echo -e "${YELLOW}🔧 Removing development artifacts...${NC}"
remove_safe "dist/" "Build directory (will be regenerated)"
remove_safe "node_modules/" "Node modules (will be reinstalled)"
remove_safe ".DS_Store" "macOS system file"
remove_safe "vite" "Vite temporary file"
remove_safe "vite_react_shadcn_ts@0.0.0" "Vite temporary directory"

# 4. Remove old deployment files
echo -e "${YELLOW}📦 Removing old deployment files...${NC}"
remove_safe "shared-wealth-directadmin.tar.gz" "Old deployment archive"
remove_safe "deploy.sh" "Old deployment script"
remove_safe "quick-deploy.sh" "Quick deployment script"
remove_safe "directadmin-*.sh" "Old DirectAdmin scripts"

# 5. Remove duplicate and backup files
echo -e "${YELLOW}📄 Removing backup and duplicate files...${NC}"
remove_safe ".env.backup" "Environment backup"
remove_safe "package.json.bak" "Package.json backup"
remove_safe "bun.lockb" "Bun lock file (using pnpm)"

# 6. Remove old documentation files (keep only essential ones)
echo -e "${YELLOW}📚 Cleaning up documentation...${NC}"
remove_safe "AUTHENTICATION.md" "Old authentication docs"
remove_safe "COLLABORATION_HUB_README.md" "Old collaboration docs"
remove_safe "DEPLOYMENT_COMPLETE.md" "Old deployment docs"
remove_safe "DEPLOYMENT_READY.md" "Old deployment docs"
remove_safe "DEPLOYMENT_GUIDE.md" "Old deployment guide"
remove_safe "DEPLOYMENT_*.md" "Old deployment documentation"
remove_safe "DEVELOPMENT_RULEBOOK.md" "Old development docs"
remove_safe "INTEGRATION_ANALYSIS.md" "Old integration docs"
remove_safe "MIGRATION_*.md" "Old migration docs"
remove_safe "PHASE2_*.md" "Old phase documentation"
remove_safe "PLATFORM_DOCUMENTATION.md" "Old platform docs"
remove_safe "PLATFORM_FEATURES.md" "Old platform features"
remove_safe "POSTGRESQL_MIGRATION.md" "Old PostgreSQL docs"
remove_safe "PRODUCTION_READINESS_*.md" "Old production docs"
remove_safe "SECURITY_GUIDE.md" "Old security guide"
remove_safe "SECURITY_IMPLEMENTATION.md" "Old security docs"
remove_safe "SOCIAL_INTEGRATION_*.md" "Old social integration docs"
remove_safe "TESTING_STRATEGY_*.md" "Old testing docs"
remove_safe "check-implementation.md" "Old implementation check"
remove_safe "verify-changes.md" "Old verification docs"
remove_safe "verify-dashboard.md" "Old dashboard verification"

# 7. Remove old scripts and utilities
echo -e "${YELLOW}🔧 Removing old scripts...${NC}"
remove_safe "scripts/" "Old scripts directory"
remove_safe "setup-*.sh" "Old setup scripts"
remove_safe "start-*.sh" "Old start scripts"
remove_safe "restart-*.sh" "Old restart scripts"
remove_safe "quick-start.sh" "Old quick start script"
remove_safe "run-tests.sh" "Old test runner"
remove_safe "simple-server.js" "Simple server file"
remove_safe "remove_social_metrics.js" "Old social metrics script"

# 8. Remove old database files (keep only essential ones)
echo -e "${YELLOW}🗄️  Cleaning up database files...${NC}"
remove_safe "complete_database_setup.sql" "Old complete setup"
remove_safe "fix_activity_feed.sql" "Old activity feed fix"
remove_safe "manual-setup.sql" "Old manual setup"
remove_safe "setup-production-db.js" "Old production setup"

# 9. Remove old configuration files
echo -e "${YELLOW}⚙️  Cleaning up configuration files...${NC}"
remove_safe "cypress/" "Cypress testing directory"
remove_safe "cypress.config.ts" "Cypress config"
remove_safe "playwright.config.ts" "Playwright config"
remove_safe "jest.config.js" "Jest config"
remove_safe "nodemon.json" "Nodemon config"

# 10. Remove old environment files
echo -e "${YELLOW}🌍 Cleaning up environment files...${NC}"
remove_safe "env.development" "Old development env"
remove_safe "env.example" "Old example env"
remove_safe "env.production" "Old production env"

# 11. Remove old deployment directories
echo -e "${YELLOW}📁 Removing old deployment directories...${NC}"
remove_safe "deployment/" "Old deployment directory"

# 12. Remove old uploads and temporary directories
echo -e "${YELLOW}📤 Cleaning up uploads...${NC}"
remove_safe "uploads/" "Old uploads directory"

echo ""
echo -e "${BLUE}🧹 CLEANING UP ROOT DIRECTORY${NC}"
echo ""

# Change to root directory
cd "/Users/m.salmanmalik/Development Projects/Shared Wealth International"

# Remove unnecessary files from root
echo -e "${YELLOW}🗑️  Removing root directory clutter...${NC}"
remove_safe ".DS_Store" "macOS system file"
remove_safe "*.md" "Old documentation files"
remove_safe "*.sh" "Old shell scripts"
remove_safe "*.js" "Old JavaScript files"
remove_safe "*.log" "Log files"
remove_safe "package*.json" "Old package files"
remove_safe "pnpm-lock.yaml" "Old lock file"
remove_safe "playwright.config.ts" "Playwright config"
remove_safe "project.zip" "Old project zip"
remove_safe "scripts/" "Old scripts directory"
remove_safe "server/" "Old server directory"
remove_safe "tests/" "Old tests directory"
remove_safe "vite" "Vite temporary file"
remove_safe "vite_react_shadcn_ts@0.0.0" "Vite temporary directory"

echo ""
echo -e "${GREEN}✅ CLEANUP COMPLETED!${NC}"
echo "=========================="
echo -e "${GREEN}📁 Directories removed: $DIRS_REMOVED${NC}"
echo -e "${GREEN}📄 Files removed: $FILES_REMOVED${NC}"
echo -e "${GREEN}📊 Total items cleaned: $((FILES_REMOVED + DIRS_REMOVED))${NC}"

echo ""
echo -e "${BLUE}📋 ESSENTIAL FILES PRESERVED:${NC}"
echo "✅ wealth-pioneers-network/ (main project directory)"
echo "✅ .git/ (version control)"
echo "✅ .github/ (GitHub workflows)"
echo "✅ package.json (dependencies)"
echo "✅ pnpm-lock.yaml (lock file)"
echo "✅ tsconfig.*.json (TypeScript configs)"
echo "✅ vite.config.ts (Vite config)"
echo "✅ tailwind.config.ts (Tailwind config)"
echo "✅ components.json (UI components config)"
echo "✅ eslint.config.js (ESLint config)"
echo "✅ postcss.config.js (PostCSS config)"
echo "✅ index.html (main HTML file)"
echo "✅ public/ (public assets)"
echo "✅ src/ (source code)"
echo "✅ server/ (backend code)"
echo "✅ database/ (database files)"
echo "✅ .env (environment variables)"
echo "✅ .env.production.template (production env template)"
echo "✅ ecosystem.config.js (PM2 config)"
echo "✅ create-directadmin-deployment.sh (deployment script)"
echo "✅ create-company-accounts.js (company setup script)"
echo "✅ verify-company-accounts.js (verification script)"
echo "✅ verify-deployment-readiness.sh (deployment verification)"
echo "✅ DIRECTADMIN_DEPLOYMENT_STEPS.md (deployment guide)"
echo "✅ COMPANY_ACCOUNTS_SUMMARY.md (company accounts info)"
echo "✅ README.md (main documentation)"

echo ""
echo -e "${YELLOW}🚀 NEXT STEPS:${NC}"
echo "1. Run 'pnpm install' to reinstall dependencies"
echo "2. Run 'pnpm run build' to rebuild the application"
echo "3. Run 'pnpm run server:build' to rebuild the server"
echo "4. Test the application to ensure everything works"

echo ""
echo -e "${GREEN}🎉 PROJECT CLEANED UP SUCCESSFULLY!${NC}"
echo -e "${BLUE}Your project is now organized and ready for deployment.${NC}"
