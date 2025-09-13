#!/bin/bash

# Wealth Pioneers Network Development Startup Script
# This script ensures you're in the correct directory and starts both servers

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the project directory
cd "$SCRIPT_DIR"

echo "🚀 Starting Wealth Pioneers Network Development Environment"
echo "📁 Working directory: $(pwd)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Build server files
echo "🔨 Building server files..."
pnpm run server:build

# Start frontend in background
echo "🌐 Starting frontend development server (port 8081)..."
pnpm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Start backend in background
echo "⚙️ Starting backend development server (port 8080)..."
pnpm run server:dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 5

# Test connections
echo ""
echo "🧪 Testing server connections..."

# Test frontend
if curl -s http://localhost:8081 > /dev/null; then
    echo "✅ Frontend server is running on http://localhost:8081"
else
    echo "❌ Frontend server failed to start"
fi

# Test backend
if curl -s http://localhost:8080/api/health > /dev/null; then
    echo "✅ Backend server is running on http://localhost:8080"
else
    echo "❌ Backend server failed to start"
fi

echo ""
echo "🎉 Development environment started!"
echo "🌐 Frontend: http://localhost:8081"
echo "⚙️ Backend API: http://localhost:8080/api"
echo ""
echo "📝 Process IDs:"
echo "   Frontend PID: $FRONTEND_PID"
echo "   Backend PID: $BACKEND_PID"
echo ""
echo "🛑 To stop servers: kill $FRONTEND_PID $BACKEND_PID"
echo "   Or use Ctrl+C in this terminal"
echo ""

# Keep script running and show logs
echo "📋 Server logs (Ctrl+C to stop all servers):"
echo "=============================================="

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
