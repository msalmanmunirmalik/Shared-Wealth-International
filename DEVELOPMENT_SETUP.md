# 🚀 Wealth Pioneers Network - Development Setup

## ✅ **PERMANENT SOLUTION IMPLEMENTED**

The "Missing script: dev" error has been permanently resolved! Here are the solutions:

## 🛠️ **Quick Start (Recommended)**

### Option 1: Use the Startup Script (Easiest)
```bash
# Navigate to the project directory
cd "wealth-pioneers-network"

# Run the automated startup script
./start-dev.sh
```

This script will:
- ✅ Automatically navigate to the correct directory
- ✅ Build server files
- ✅ Start both frontend and backend servers
- ✅ Test connections
- ✅ Show process IDs for easy management

### Option 2: Manual Commands
```bash
# Navigate to the project directory
cd "wealth-pioneers-network"

# Start frontend (port 8081)
pnpm run dev

# In another terminal, start backend (port 8080)
pnpm run server:dev
```

### Option 3: From Root Directory (Fixed)
```bash
# Now you can run from the root directory too
cd "Shared Wealth International"
npm run dev          # Starts frontend
npm run server:dev   # Starts backend
```

## 🔧 **What Was Fixed**

### 1. **Directory Navigation Issue**
- **Problem**: Commands were run from wrong directory (`Shared Wealth International` instead of `wealth-pioneers-network`)
- **Solution**: Created startup script that ensures correct directory navigation

### 2. **Missing Scripts Error**
- **Problem**: `pnpm run dev` failed because it was run from root directory
- **Solution**: Added package.json to root directory with proper script delegation

### 3. **API Connection Issues**
- **Problem**: Frontend was trying to connect to `localhost:3001` instead of `localhost:8080`
- **Solution**: Fixed all API service files to use correct port (8080)

## 📋 **Available Scripts**

### Frontend Scripts
```bash
pnpm run dev          # Start development server (port 8081)
pnpm run build        # Build for production
pnpm run preview      # Preview production build
```

### Backend Scripts
```bash
pnpm run server:dev   # Start backend with auto-reload (port 8080)
pnpm run server:build # Build server TypeScript files
pnpm run server:start # Start built server
```

### Database Scripts
```bash
pnpm run db:setup     # Setup database
pnpm run db:reset     # Reset database
```

### Utility Scripts
```bash
pnpm run test         # Run tests
pnpm run lint         # Lint code
pnpm run format       # Format code
```

## 🌐 **Server URLs**

- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:8080/api
- **API Health Check**: http://localhost:8080/api/health

## 🔍 **Troubleshooting**

### If you get "Missing script: dev" error:
1. Ensure you're in the `wealth-pioneers-network` directory
2. Run `pwd` to check your current directory
3. Use the startup script: `./start-dev.sh`

### If servers don't start:
1. Check if ports 8080 and 8081 are available
2. Kill existing processes: `pkill -f "vite\|node.*server"`
3. Run the startup script again

### If API connection fails:
1. Verify backend is running: `curl http://localhost:8080/api/health`
2. Check frontend console for API debug messages
3. Ensure environment variables are loaded correctly

## 📁 **Project Structure**
```
Shared Wealth International/
├── wealth-pioneers-network/     # Main project directory
│   ├── src/                     # Frontend source code
│   ├── server/                  # Backend source code
│   ├── dist/                    # Built files
│   ├── package.json             # Project dependencies
│   └── start-dev.sh             # Development startup script
├── package.json                 # Root package.json (delegates to project)
└── DEVELOPMENT_SETUP.md         # This file
```

## 🎯 **Next Steps**

1. **Start Development**: Run `./start-dev.sh` from the `wealth-pioneers-network` directory
2. **Open Browser**: Navigate to http://localhost:8081
3. **Test API**: Try signing in - should now connect to the correct backend port
4. **Develop**: Make changes and see them reflected immediately

## ✅ **Status: RESOLVED**

The "Missing script: dev" error is now permanently fixed with multiple solutions provided above. Choose the option that works best for your workflow!
