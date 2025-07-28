#!/bin/bash

echo "🧹 Cleaning up..."
# Kill any running vite processes
pkill -f "vite" 2>/dev/null
pkill -f "node.*8080" 2>/dev/null
pkill -f "node.*8081" 2>/dev/null

# Clear all caches
echo "🗑️  Clearing caches..."
rm -rf node_modules/.vite 2>/dev/null
rm -rf .vite 2>/dev/null
rm -rf dist 2>/dev/null

# Clear npm cache
npm cache clean --force

echo "🚀 Starting development server..."
npm run dev 