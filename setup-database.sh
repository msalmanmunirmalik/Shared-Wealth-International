#!/bin/bash

# =====================================================
# Shared Wealth International - Database Setup Script
# =====================================================
# This script sets up the comprehensive database schema
# and migrates your existing local data to production
# =====================================================

set -e  # Exit on any error

echo "🚀 Shared Wealth International - Database Setup"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the wealth-pioneers-network directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if pg is installed
if ! npm list pg &> /dev/null; then
    echo "📦 Installing required dependencies..."
    npm install pg
fi

echo ""
echo "📋 What would you like to do?"
echo "1. Set up comprehensive database schema in production"
echo "2. Migrate local data to production"
echo "3. Both (recommended)"
echo "4. Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🏗️  Setting up comprehensive database schema..."
        node scripts/setup-comprehensive-database.js
        ;;
    2)
        echo ""
        echo "📦 Migrating local data to production..."
        node scripts/migrate-local-data.js
        ;;
    3)
        echo ""
        echo "🏗️  Setting up comprehensive database schema..."
        node scripts/setup-comprehensive-database.js
        
        echo ""
        echo "📦 Migrating local data to production..."
        node scripts/migrate-local-data.js
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Database setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Test your application at https://sharedwealth.onrender.com"
echo "2. Log in with your existing credentials:"
echo "   Email: msalmanmunirmalik@outlook.com"
echo "   Company: Letstern"
echo "3. Verify all features are working correctly"
echo ""
echo "🔗 Your data is now live in production! 🚀"
