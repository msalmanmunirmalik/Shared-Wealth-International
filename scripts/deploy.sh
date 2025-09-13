#!/bin/bash

# Shared Wealth International - Deployment Script
# This script sets up the complete deployment environment

set -e  # Exit on any error

echo "🚀 Starting Shared Wealth International Deployment Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required commands exist
check_requirements() {
    print_status "Checking system requirements..."
    
    local missing_deps=()
    
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    if ! command -v pnpm &> /dev/null; then
        missing_deps+=("pnpm")
    fi
    
    if ! command -v psql &> /dev/null; then
        missing_deps+=("postgresql")
    fi
    
    if ! command -v redis-server &> /dev/null; then
        missing_deps+=("redis")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing required dependencies: ${missing_deps[*]}"
        print_status "Please install the missing dependencies and run this script again."
        exit 1
    fi
    
    print_success "All required dependencies are installed"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        if [ -f env.example ]; then
            cp env.example .env
            print_success "Created .env file from template"
            print_warning "Please update .env file with your actual configuration values"
        else
            print_error ".env file not found and no template available"
            exit 1
        fi
    else
        print_status ".env file already exists"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    pnpm install
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if PostgreSQL is running
    if ! pg_isready -q; then
        print_error "PostgreSQL is not running. Please start PostgreSQL and try again."
        exit 1
    fi
    
    # Run database setup
    pnpm run db:setup
    
    if [ $? -eq 0 ]; then
        print_success "Database setup completed"
    else
        print_error "Database setup failed"
        exit 1
    fi
}

# Setup Redis
setup_redis() {
    print_status "Setting up Redis..."
    
    # Check if Redis is running
    if ! redis-cli ping &> /dev/null; then
        print_warning "Redis is not running. Starting Redis..."
        
        # Try to start Redis (this might fail if Redis is not installed as a service)
        if command -v redis-server &> /dev/null; then
            redis-server --daemonize yes
            sleep 2
            
            if redis-cli ping &> /dev/null; then
                print_success "Redis started successfully"
            else
                print_warning "Could not start Redis automatically. Please start Redis manually."
            fi
        else
            print_warning "Redis server not found. Please install and start Redis manually."
        fi
    else
        print_success "Redis is running"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    local dirs=("uploads" "uploads/logos" "uploads/documents" "uploads/images" "uploads/temp" "logs" "dist")
    
    for dir in "${dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            print_success "Created directory: $dir"
        else
            print_status "Directory already exists: $dir"
        fi
    done
}

# Build the application
build_application() {
    print_status "Building application..."
    
    # Build frontend
    print_status "Building frontend..."
    pnpm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend build completed"
    else
        print_error "Frontend build failed"
        exit 1
    fi
    
    # Build backend
    print_status "Building backend..."
    pnpm run server:build
    
    if [ $? -eq 0 ]; then
        print_success "Backend build completed"
    else
        print_error "Backend build failed"
        exit 1
    fi
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Run backend tests
    print_status "Running backend tests..."
    pnpm run test:backend
    
    if [ $? -eq 0 ]; then
        print_success "Backend tests passed"
    else
        print_warning "Some backend tests failed"
    fi
    
    # Run frontend tests
    print_status "Running frontend tests..."
    pnpm run test
    
    if [ $? -eq 0 ]; then
        print_success "Frontend tests passed"
    else
        print_warning "Some frontend tests failed"
    fi
}

# Start services
start_services() {
    print_status "Starting services..."
    
    # Check if services are already running
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null; then
        print_warning "Port 3001 is already in use. Please stop the existing service or change the port."
        return
    fi
    
    print_status "Starting backend server..."
    print_status "Backend will be available at: http://localhost:3001"
    print_status "API documentation will be available at: http://localhost:3001/api-docs"
    print_status "Health check endpoint: http://localhost:3001/api/health"
    
    # Start the server in background
    pnpm run server:start &
    SERVER_PID=$!
    
    # Wait a moment for server to start
    sleep 3
    
    # Check if server started successfully
    if kill -0 $SERVER_PID 2>/dev/null; then
        print_success "Backend server started successfully (PID: $SERVER_PID)"
        print_status "To stop the server, run: kill $SERVER_PID"
    else
        print_error "Failed to start backend server"
        exit 1
    fi
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for server to be ready
    sleep 5
    
    # Check health endpoint
    if curl -f http://localhost:3001/api/health >/dev/null 2>&1; then
        print_success "Health check passed - Server is responding"
    else
        print_warning "Health check failed - Server might not be ready yet"
    fi
}

# Main deployment function
main() {
    echo "🎯 Shared Wealth International Deployment Setup"
    echo "================================================"
    
    check_requirements
    setup_environment
    install_dependencies
    create_directories
    setup_database
    setup_redis
    build_application
    run_tests
    start_services
    health_check
    
    echo ""
    echo "🎉 Deployment setup completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Update .env file with your production configuration"
    echo "2. Configure your domain and SSL certificates"
    echo "3. Set up monitoring and logging services"
    echo "4. Configure backup strategies"
    echo ""
    echo "🌐 Access Points:"
    echo "- Application: http://localhost:3001"
    echo "- API Documentation: http://localhost:3001/api-docs"
    echo "- Health Check: http://localhost:3001/api/health"
    echo ""
    echo "📚 Documentation:"
    echo "- Check the README.md for detailed setup instructions"
    echo "- Review the API documentation at /api-docs"
    echo ""
    echo "🔧 Management Commands:"
    echo "- Stop server: kill $SERVER_PID"
    echo "- View logs: tail -f logs/combined.log"
    echo "- Database reset: pnpm run db:reset"
    echo "- Run tests: pnpm run test"
    echo ""
}

# Run main function
main "$@"
