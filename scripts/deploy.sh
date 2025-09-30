#!/bin/bash

# Render Deployment Script
# Handles deployment to Render with proper error handling

set -e

echo "🚀 Deploying Shared Wealth International to Render"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$RENDER_API_KEY" ]; then
    echo -e "${RED}❌ Error: RENDER_API_KEY environment variable is not set.${NC}"
    echo "Please set it with: export RENDER_API_KEY=your_api_key"
    exit 1
fi

if [ -z "$RENDER_SERVICE_ID" ]; then
    echo -e "${RED}❌ Error: RENDER_SERVICE_ID environment variable is not set.${NC}"
    echo "Please set it with: export RENDER_SERVICE_ID=your_service_id"
    exit 1
fi

echo -e "${BLUE}📋 Pre-deployment checks...${NC}"

# Check Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ Error: pnpm is not installed.${NC}"
    echo "Please install pnpm: npm install -g pnpm"
    exit 1
fi
echo "✅ pnpm is installed"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

# Run type checking
echo -e "${BLUE}🔍 Running type checking...${NC}"
pnpm run type-check

# Run linting
echo -e "${BLUE}🧹 Running linting...${NC}"
pnpm run lint

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
pnpm run test

# Build frontend
echo -e "${BLUE}🏗️  Building frontend...${NC}"
pnpm run build:prod

# Build backend
echo -e "${BLUE}🏗️  Building backend...${NC}"
pnpm run server:build

echo -e "${GREEN}✅ All pre-deployment checks passed!${NC}"

# Deploy to Render
echo -e "${BLUE}🚀 Deploying to Render...${NC}"

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo -e "${YELLOW}⚠️  Render CLI not found. Installing...${NC}"
    npm install -g @render/cli
fi

# Deploy using Render CLI
render deploy --service $RENDER_SERVICE_ID

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo "✅ Frontend built successfully"
echo "✅ Backend built successfully"
echo "✅ Tests passed"
echo "✅ Deployed to Render"
echo ""
echo -e "${YELLOW}🌐 Your application is now live at:${NC}"
echo "https://shared-wealth-international.onrender.com"
echo ""
echo -e "${BLUE}📊 Next steps:${NC}"
echo "1. Check the Render dashboard for deployment status"
echo "2. Verify the application is working correctly"
echo "3. Check logs for any issues"
echo "4. Test all functionality"
echo ""
echo -e "${GREEN}🎯 Deployment complete! Your Shared Wealth International platform is now live!${NC}"
