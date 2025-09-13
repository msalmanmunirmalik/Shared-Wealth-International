#!/bin/bash

# 🔧 SERVER STARTUP FIX SCRIPT
# This script fixes common server startup issues

echo "🔧 FIXING SERVER STARTUP ISSUES"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Step 1: Check if we're in the right directory
print_step "Checking directory structure..."
if [ -f "package.json" ] && [ -d "server" ] && [ -d "src" ]; then
    print_success "Correct project directory"
else
    print_error "Not in the correct project directory"
    exit 1
fi

# Step 2: Check if server is built
print_step "Checking server build..."
if [ -f "dist/server/server.js" ]; then
    print_success "Server is built"
else
    print_warning "Server not built, building now..."
    pnpm run server:build
    if [ $? -eq 0 ]; then
        print_success "Server built successfully"
    else
        print_error "Failed to build server"
        exit 1
    fi
fi

# Step 3: Check environment variables
print_step "Checking environment variables..."
if [ -f ".env" ]; then
    print_success "Environment file exists"
    
    # Check for required variables
    if grep -q "DATABASE_URL" .env; then
        print_success "DATABASE_URL found"
    else
        print_warning "DATABASE_URL not found in .env"
    fi
    
    if grep -q "JWT_SECRET" .env; then
        print_success "JWT_SECRET found"
    else
        print_warning "JWT_SECRET not found in .env"
    fi
    
    if grep -q "PORT" .env; then
        print_success "PORT found"
    else
        print_warning "PORT not found in .env, will use default 8080"
    fi
else
    print_warning "No .env file found, using defaults"
fi

# Step 4: Check PostgreSQL connection
print_step "Checking PostgreSQL connection..."
if command -v pg_isready > /dev/null 2>&1; then
    if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
        print_success "PostgreSQL is running"
    else
        print_warning "PostgreSQL is not running"
        print_warning "Please start PostgreSQL: brew services start postgresql"
    fi
else
    print_warning "pg_isready not found, cannot check PostgreSQL status"
fi

# Step 5: Check if port is available
print_step "Checking port availability..."
PORT=${PORT:-8080}
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port $PORT is already in use"
    print_warning "Killing existing processes on port $PORT..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Step 6: Try to start the server
print_step "Starting server..."
echo ""

# Method 1: Direct node execution
print_step "Method 1: Direct node execution"
if node ./dist/server/server.js; then
    print_success "Server started successfully with Method 1"
else
    print_warning "Method 1 failed, trying Method 2..."
    
    # Method 2: Using npm script
    print_step "Method 2: Using npm script"
    if pnpm run server:start; then
        print_success "Server started successfully with Method 2"
    else
        print_warning "Method 2 failed, trying Method 3..."
        
        # Method 3: Using nodemon for development
        print_step "Method 3: Using nodemon for development"
        if pnpm run server:dev; then
            print_success "Server started successfully with Method 3"
        else
            print_error "All startup methods failed"
            echo ""
            echo "Troubleshooting steps:"
            echo "1. Check if all dependencies are installed: pnpm install"
            echo "2. Check if PostgreSQL is running"
            echo "3. Check if .env file has correct configuration"
            echo "4. Check server logs for specific errors"
            echo "5. Try running: node ./dist/server/server.js 2>&1 | head -20"
            exit 1
        fi
    fi
fi
