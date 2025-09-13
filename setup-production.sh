#!/bin/bash

echo "🚀 Setting up production environment for Render deployment"
echo ""

# Get the Render app name from user
read -p "Enter your Render app name (e.g., wealth-pioneers-api): " RENDER_APP_NAME

if [ -z "$RENDER_APP_NAME" ]; then
    echo "❌ Render app name is required!"
    exit 1
fi

# Create production environment file
cat > env.production << EOF
# Production Environment Variables
VITE_API_URL=https://${RENDER_APP_NAME}.onrender.com/api

# PostgreSQL Database Configuration (set these in Render environment variables)
DB_USER=your_username
DB_HOST=your_host
DB_NAME=your_database
DB_PASSWORD=your_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-must-be-at-least-32-characters

# Server Configuration
PORT=8080
NODE_ENV=production

# Security Configuration
ALLOWED_ORIGINS=https://${RENDER_APP_NAME}.onrender.com,https://your-frontend-domain.com

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Request Limits
MAX_REQUEST_SIZE=10mb

# Database Connection Limits
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT_MS=30000
DB_CONNECTION_TIMEOUT_MS=2000
EOF

echo "✅ Created env.production with Render API URL: https://${RENDER_APP_NAME}.onrender.com/api"
echo ""
echo "📝 Next steps:"
echo "1. Update env.production with your actual database credentials"
echo "2. Set the same environment variables in your Render dashboard"
echo "3. Run: pnpm run build:prod"
echo "4. Deploy the dist/ folder to Render"
echo ""
echo "🔧 For immediate testing, you can also:"
echo "1. Copy env.production to .env"
echo "2. Update the API URL in .env to your actual Render URL"
echo "3. Restart your development server"
