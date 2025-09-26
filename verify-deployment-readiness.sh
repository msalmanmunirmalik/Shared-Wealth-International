#!/bin/bash

# Deployment Readiness Verification Script
# Verifies that everything is ready for DirectAdmin deployment

set -e

echo "🔍 SHARED WEALTH INTERNATIONAL - DEPLOYMENT READINESS CHECK"
echo "=========================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check counters
CHECKS_PASSED=0
CHECKS_FAILED=0
TOTAL_CHECKS=0

check_item() {
    local description="$1"
    local command="$2"
    local expected="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    echo -n "🔍 $description... "
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        CHECKS_FAILED=$((CHECKS_FAILED + 1))
        return 1
    fi
}

echo -e "${BLUE}📋 PRE-DEPLOYMENT VERIFICATION${NC}"
echo ""

# 1. Check if frontend build exists
check_item "Frontend build exists" "test -d dist && test -f dist/index.html"

# 2. Check if server build exists
check_item "Server build exists" "test -d dist/server && test -f dist/server/server.js"

# 3. Check if package.json exists
check_item "Package.json exists" "test -f package.json"

# 4. Check if production env template exists
check_item "Production env template exists" "test -f .env.production.template"

# 5. Check if deployment package exists
check_item "Deployment package created" "test -d deployment/shared-wealth-directadmin"

# 6. Check if deployment archive exists
check_item "Deployment archive exists" "ls deployment/*.tar.gz 2>/dev/null"

# 7. Check if PM2 ecosystem file exists
check_item "PM2 ecosystem file exists" "test -f deployment/shared-wealth-directadmin/ecosystem.config.js"

# 8. Check if setup scripts exist
check_item "Setup scripts exist" "test -f deployment/shared-wealth-directadmin/setup-server.sh"

# 9. Check if database schema exists
check_item "Database schema exists" "test -f deployment/shared-wealth-directadmin/setup-database.sql"

# 10. Check if deployment guide exists
check_item "Deployment guide exists" "test -f deployment/shared-wealth-directadmin/DEPLOYMENT_GUIDE.md"

echo ""
echo -e "${BLUE}📊 VERIFICATION SUMMARY${NC}"
echo "=========================="
echo -e "${GREEN}✅ Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}❌ Failed: $CHECKS_FAILED${NC}"
echo -e "${BLUE}📋 Total: $TOTAL_CHECKS${NC}"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}✅ Your application is ready for DirectAdmin deployment!${NC}"
    echo ""
    echo -e "${YELLOW}📦 Deployment Package:${NC}"
    echo "   Location: $(ls -la deployment/*.tar.gz | awk '{print $9, $5}')"
    echo ""
    echo -e "${YELLOW}🚀 Next Steps:${NC}"
    echo "   1. Upload the .tar.gz file to DirectAdmin"
    echo "   2. Follow the DEPLOYMENT_GUIDE.md instructions"
    echo "   3. Configure your database and environment variables"
    echo "   4. Start your Node.js application"
    echo ""
    echo -e "${BLUE}📖 See DIRECTADMIN_DEPLOYMENT_STEPS.md for detailed instructions${NC}"
else
    echo ""
    echo -e "${RED}⚠️  SOME CHECKS FAILED!${NC}"
    echo -e "${YELLOW}Please fix the failed items before deploying.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📋 DEPLOYMENT PACKAGE CONTENTS:${NC}"
if [ -d "deployment/shared-wealth-directadmin" ]; then
    echo ""
    ls -la deployment/shared-wealth-directadmin/
    echo ""
    echo -e "${BLUE}📦 Archive Information:${NC}"
    ls -lh deployment/*.tar.gz 2>/dev/null || echo "No archive found"
fi

echo ""
echo -e "${GREEN}🚀 Ready for DirectAdmin deployment!${NC}"
