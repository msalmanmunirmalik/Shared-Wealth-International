#!/bin/bash

echo "🚀 Shared Wealth International - Quick Start Script"
echo "=================================================="

# Check if PNPM is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ PNPM is not installed. Installing PNPM..."
    npm install -g pnpm
else
    echo "✅ PNPM is already installed"
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Installing Supabase CLI..."
    npm install -g supabase
else
    echo "✅ Supabase CLI is already installed"
fi

# Install dependencies
echo "📦 Installing project dependencies..."
pnpm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local file not found. Creating template..."
    cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development Configuration
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:8080

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
EOF
    echo "📝 Please update .env.local with your actual Supabase credentials"
else
    echo "✅ .env.local file exists"
fi

# Start Supabase (if not already running)
echo "🗄️  Starting Supabase..."
if ! supabase status &> /dev/null; then
    supabase start
else
    echo "✅ Supabase is already running"
fi

# Apply database migrations
echo "🔄 Applying database migrations..."
supabase db reset

# Generate TypeScript types
echo "🔧 Generating TypeScript types..."
supabase gen types typescript --local > src/integrations/supabase/types.ts

# Run type check
echo "🔍 Running TypeScript type check..."
pnpm type-check

# Run linting
echo "🧹 Running ESLint..."
pnpm lint

echo ""
echo "🎉 Setup complete! You can now:"
echo "   • Start development server: pnpm dev"
echo "   • Run tests: pnpm test"
echo "   • Run E2E tests: pnpm test:e2e"
echo "   • Build for production: pnpm build"
echo ""
echo "📚 For more information, see:"
echo "   • DEVELOPMENT_RULEBOOK.md"
echo "   • DEVELOPMENT_SETUP.md"
echo ""
echo "🚀 Happy coding!"
