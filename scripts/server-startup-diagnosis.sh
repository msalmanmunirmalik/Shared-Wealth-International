#!/bin/bash

# 🔧 SERVER STARTUP DIAGNOSIS & FIX
# Shared Wealth International Platform
# 
# This script diagnoses and fixes server startup issues

echo "🔧 ==============================================="
echo "🔧 SERVER STARTUP DIAGNOSIS & FIX"
echo "🔧 Shared Wealth International Platform"
echo "🔧 ==============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Diagnosing Server Startup Issues...${NC}"
echo "================================================"
echo ""

# Check if dist/server/server.js exists
echo -e "${CYAN}1. Checking compiled server file:${NC}"
if [ -f "dist/server/server.js" ]; then
    echo -e "${GREEN}✅ dist/server/server.js exists${NC}"
else
    echo -e "${RED}❌ dist/server/server.js missing${NC}"
    echo "Building server..."
    pnpm run server:build
fi
echo ""

# Check if node_modules exists
echo -e "${CYAN}2. Checking dependencies:${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules exists${NC}"
else
    echo -e "${RED}❌ node_modules missing${NC}"
    echo "Installing dependencies..."
    pnpm install
fi
echo ""

# Check environment variables
echo -e "${CYAN}3. Checking environment configuration:${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"
    echo "Environment variables:"
    grep -E "^(PORT|NODE_ENV|DATABASE)" .env | head -5
else
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating basic .env file..."
    cat > .env << EOF
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/wealth_pioneers
EOF
fi
echo ""

# Check database connection
echo -e "${CYAN}4. Checking database connection:${NC}"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL client available${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL client not found${NC}"
fi
echo ""

# Try to start server with error handling
echo -e "${CYAN}5. Attempting to start server:${NC}"
echo "Starting server on port 3001..."

# Kill any existing server processes
pkill -f "node.*server" 2>/dev/null || true
sleep 2

# Start server with timeout
timeout 10s node dist/server/server.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server is running
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server started successfully (PID: $SERVER_PID)${NC}"
    
    # Test server response
    echo "Testing server response..."
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/api/health" | grep -q "200"; then
        echo -e "${GREEN}✅ Server responding on port 3001${NC}"
    else
        echo -e "${YELLOW}⚠️  Server running but not responding on expected port${NC}"
        echo "Checking alternative ports..."
        for port in 8080 3000 5000; do
            if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port/api/health" | grep -q "200"; then
                echo -e "${GREEN}✅ Server responding on port $port${NC}"
                break
            fi
        done
    fi
else
    echo -e "${RED}❌ Server failed to start${NC}"
    echo "Checking for common issues..."
    
    # Check for port conflicts
    echo "Checking for port conflicts..."
    if lsof -i :3001 > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Port 3001 is in use${NC}"
        lsof -i :3001
    fi
    
    # Check for missing dependencies
    echo "Checking for missing dependencies..."
    if ! node -e "require('./dist/server/server.js')" 2>&1 | grep -q "Cannot find module"; then
        echo -e "${GREEN}✅ No missing module errors${NC}"
    else
        echo -e "${RED}❌ Missing module errors detected${NC}"
        node -e "require('./dist/server/server.js')" 2>&1 | head -5
    fi
fi
echo ""

echo -e "${YELLOW}🎯 Server Status Summary:${NC}"
echo "================================================"
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server is running successfully${NC}"
    echo -e "${CYAN}📱 Access URLs:${NC}"
    echo "• Frontend: http://localhost:3001"
    echo "• API Health: http://localhost:3001/api/health"
    echo "• User Dashboard: http://localhost:3001/user-dashboard"
    echo "• Company Management: http://localhost:3001/company/d943f30e-a4ad-4c0c-96af-f38aca40c4c3"
else
    echo -e "${RED}❌ Server failed to start${NC}"
    echo -e "${CYAN}🔧 Troubleshooting Steps:${NC}"
    echo "1. Check database connection"
    echo "2. Verify environment variables"
    echo "3. Check for port conflicts"
    echo "4. Review server logs for errors"
    echo "5. Try: pnpm run server:dev (for development mode)"
fi
echo ""

echo -e "${PURPLE}💡 Next Steps:${NC}"
echo "================================================"
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "1. Test the company management page"
    echo "2. Verify API responses are working"
    echo "3. Check that the routing fix is applied"
    echo "4. Test all functionality"
else
    echo "1. Review error messages above"
    echo "2. Check database connection"
    echo "3. Verify all dependencies are installed"
    echo "4. Try starting with: pnpm run server:dev"
fi
echo ""

echo -e "${GREEN}🔧 Server diagnosis complete!${NC}"
