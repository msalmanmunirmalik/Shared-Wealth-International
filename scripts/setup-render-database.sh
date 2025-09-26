#!/bin/bash

# Setup Render Database - Complete Deployment Script
# This script deploys the database schema and populates it with sample data

set -e

echo "🚀 Starting Render Database Setup..."

# Check if RENDER_DB_PASSWORD is set
if [ -z "$RENDER_DB_PASSWORD" ]; then
    echo "❌ Error: RENDER_DB_PASSWORD environment variable is not set"
    echo "Please set it with: export RENDER_DB_PASSWORD='your_password_here'"
    echo "You can find the password in your Render dashboard under the database service."
    exit 1
fi

echo "✅ RENDER_DB_PASSWORD is set"

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install pg bcryptjs uuid

# Deploy schema
echo "🏗️  Deploying database schema..."
node scripts/deploy-schema-to-render.js

# Populate database
echo "👥 Populating database with companies and users..."
node scripts/populate-render-db.js

echo "🎉 Render database setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Test the production API endpoints"
echo "2. Verify authentication works"
echo "3. Check that all 30 companies are accessible"
echo ""
echo "🔑 Default login credentials:"
echo "Email: supernovaeco@sharedwealth.com"
echo "Password: Sharedwealth123"
