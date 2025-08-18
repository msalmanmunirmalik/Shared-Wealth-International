#!/bin/bash

echo "🚀 Shared Wealth International - PostgreSQL Setup"
echo "=================================================="

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL status..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running or not accessible"
    echo "   Please start PostgreSQL and ensure it's accessible on localhost:5432"
    echo "   You can start it with: brew services start postgresql (macOS)"
    echo "   Or: sudo systemctl start postgresql (Linux)"
    exit 1
else
    echo "✅ PostgreSQL is running"
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ .env file created from env.example"
        echo "   Please update .env with your actual database credentials"
    else
        echo "❌ env.example not found. Please create .env manually"
        exit 1
    fi
else
    echo "✅ .env file exists"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
else
    echo "✅ Dependencies already installed"
fi

# Setup database
echo "🗄️  Setting up database..."
pnpm run db:setup

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start the backend server: pnpm run server:dev"
    echo "2. Start the frontend: pnpm run dev"
    echo "3. Access the admin panel with: admin@sharedwealth.com / admin123"
    echo ""
    echo "⚠️  IMPORTANT: Change the default admin password in production!"
else
    echo "❌ Database setup failed. Please check the error messages above."
    exit 1
fi
