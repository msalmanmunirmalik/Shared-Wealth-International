#!/bin/bash

# Repository Cleanup Script for Shared Wealth International
# This script cleans up duplicate files and resolves conflicts

echo "🧹 Repository Cleanup - Shared Wealth International"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this script from the project root."
    exit 1
fi

echo "📋 Current git status:"
git status --short

echo ""
echo "🔍 Identifying duplicate files..."

# Create a list of duplicate files to remove from root
DUPLICATE_FILES=(
    "AUTHENTICATION.md"
    "TESTING_STRATEGY.md"
    "TESTING_STRATEGY_COMPLETE.md"
    "database/DATABASE_DESIGN.md"
    "PHASE2_COMPLETE_SUMMARY.md"
    "PRODUCTION_READINESS_UPDATE.md"
    "POSTGRESQL_MIGRATION.md"
    "MIGRATION_SUMMARY.md"
    "DEVELOPMENT_SETUP.md"
    "TESTING_SETUP_COMPLETE.md"
    "PRODUCTION_READINESS_ASSESSMENT.md"
    "MIGRATION_COMPLETE.md"
    "PRODUCTION_READINESS_TABLE.md"
    "SECURITY_IMPLEMENTATION.md"
    "verify-changes.md"
    "PLATFORM_DOCUMENTATION.md"
    "PHASE2_SOCIAL_FEATURES_COMPLETE.md"
    "SOCIAL_INTEGRATION_COMPLETE.md"
    "verify-dashboard.md"
    "INTEGRATION_ANALYSIS.md"
    "PROJECT_INTRODUCTION.md"
    "SECURITY_GUIDE.md"
    "DEVELOPMENT_RULEBOOK.md"
    "FINAL_PRODUCTION_READINESS_SUMMARY.md"
    "COLLABORATION_HUB_README.md"
    "test-results"
    "PLATFORM_FEATURES.md"
    "check-implementation.md"
    "README.md"
)

echo ""
echo "🗑️  Removing duplicate files from root directory..."

for file in "${DUPLICATE_FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "  Removing: $file"
        rm -rf "$file"
    fi
done

echo ""
echo "📦 Keeping essential root files:"
KEEP_FILES=(
    ".git"
    ".gitignore"
    "package.json"
    "pnpm-lock.yaml"
    "DIRECTADMIN_CONFIG.md"
    "GITHUB_PUSH_SUMMARY.md"
    "MANUAL_GIT_PUSH.md"
    "push-to-github.sh"
    "cleanup-repository.sh"
    "wealth-pioneers-network"
    ".github"
    "scripts"
    "tests"
    "server"
    "database"
    "node_modules"
)

echo "✅ Essential files preserved"

echo ""
echo "🧹 Cleaning up node_modules conflicts..."
if [ -d "node_modules" ]; then
    echo "  Removing root node_modules (keeping wealth-pioneers-network/node_modules)"
    rm -rf node_modules
fi

echo ""
echo "📋 Updated git status:"
git status --short

echo ""
echo "✅ Repository cleanup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Review the changes: git status"
echo "2. Add the cleaned files: git add ."
echo "3. Commit the cleanup: git commit -m 'chore: Clean up duplicate files and resolve conflicts'"
echo "4. Push to repository: git push origin main --force-with-lease"
echo ""
echo "🎯 Repository structure is now clean and ready for deployment!"
