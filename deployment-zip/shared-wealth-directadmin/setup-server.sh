#!/bin/bash

echo "🔧 Setting up Shared Wealth International Server"

# Install Node.js 20.x if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PNPM
echo "Installing PNPM..."
npm install -g pnpm

# Install PM2
echo "Installing PM2..."
npm install -g pm2

# Install production dependencies
echo "Installing production dependencies..."
pnpm install --production

# Create logs directory
mkdir -p logs

# Set permissions
chmod +x setup-server.sh
chmod 755 logs/

echo "✅ Server setup complete!"
echo "Next steps:"
echo "1. Configure .env file with your database credentials"
echo "2. Start the application with: pm2 start ecosystem.config.js"
echo "3. Save PM2 configuration: pm2 save"
echo "4. Setup PM2 startup: pm2 startup"
