#!/bin/bash

# Quick Admin Setup Script for Shared Wealth International
# This script helps you get started with the admin system setup

echo "🚀 Shared Wealth International - Quick Admin Setup"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the wealth-pioneers-network directory"
    exit 1
fi

echo "✅ Project directory found"
echo "🔗 Using cloud Supabase: https://ewqwjduvjkddknpqpmfr.supabase.co"
echo ""

echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. 🗄️  Apply the admin migration to your cloud database:"
echo "   - Go to your Supabase dashboard: https://supabase.com/dashboard"
echo "   - Select your project: ewqwjduvjkddknpqpmfr"
echo "   - Navigate to SQL Editor"
echo "   - Copy the content from: supabase/migrations/20250717_admin_system.sql"
echo "   - Run the SQL commands"
echo ""
echo "2. 👑 Create your superadmin account:"
echo "   node scripts/setup-admin.js"
echo ""
echo "3. 🔐 Access the admin dashboard:"
echo "   - Sign in to the platform"
echo "   - Navigate to /admin"
echo ""
echo "4. 📚 Read the full setup guide:"
echo "   cat ADMIN_SETUP.md"
echo ""
echo "🎯 Ready to proceed? Follow the steps above to get started!"
echo ""
echo "💡 Tip: Make sure you have a user account created first through the platform"
echo "   before running the admin setup script."
echo ""
echo "🔒 Security Note: Your Supabase credentials are already configured in the project."
