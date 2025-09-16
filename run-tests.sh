#!/bin/bash

# Comprehensive Test Runner for Wealth Pioneers Network
# This script runs all test suites and generates comprehensive reports

set -e

echo "🧪 Starting Comprehensive Test Suite for Wealth Pioneers Network"
echo "================================================================"

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the wealth-pioneers-network directory"
    exit 1
fi

# Create test results directory
mkdir -p test-results
mkdir -p coverage

print_status "Installing dependencies..."
pnpm install

print_status "Building the application..."
pnpm run server:build

# Start the development server in background
print_status "Starting development server..."
pnpm run server:dev &
SERVER_PID=$!

# Wait for server to start
print_status "Waiting for server to start..."
sleep 10

# Check if server is running
if ! curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    print_error "Server failed to start properly"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

print_success "Server is running on http://localhost:8080"

# Function to run tests and capture results
run_test_suite() {
    local test_name="$1"
    local test_command="$2"
    local output_file="$3"
    
    print_status "Running $test_name..."
    
    if eval "$test_command" > "$output_file" 2>&1; then
        print_success "$test_name completed successfully"
        return 0
    else
        print_error "$test_name failed"
        return 1
    fi
}

# Initialize test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Run Unit Tests
if run_test_suite "Unit Tests" "pnpm test --coverage --watchAll=false" "test-results/unit-tests.log"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Run Backend Tests
if run_test_suite "Backend Tests" "pnpm test:backend --coverage" "test-results/backend-tests.log"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Run Integration Tests
if run_test_suite "Integration Tests" "pnpm test --testPathPattern=integration" "test-results/integration-tests.log"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Run Playwright E2E Tests
if run_test_suite "Playwright E2E Tests" "pnpm test:playwright" "test-results/playwright-tests.log"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Run Cypress E2E Tests
if run_test_suite "Cypress E2E Tests" "pnpm test:e2e" "test-results/cypress-tests.log"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Run Performance Tests
if run_test_suite "Performance Tests" "pnpm test:playwright --grep='Performance'" "test-results/performance-tests.log"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Run Accessibility Tests
if run_test_suite "Accessibility Tests" "pnpm test:playwright --grep='Accessibility'" "test-results/accessibility-tests.log"; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Generate test report
print_status "Generating comprehensive test report..."

cat > test-results/test-summary.md << EOF
# Test Suite Summary

**Date**: $(date)
**Environment**: Development
**Server**: http://localhost:8080

## Test Results Overview

| Test Suite | Status | Details |
|------------|--------|---------|
| Unit Tests | $([ $PASSED_TESTS -gt 0 ] && echo "✅ PASSED" || echo "❌ FAILED") | Frontend and backend unit tests |
| Backend Tests | $([ $PASSED_TESTS -gt 1 ] && echo "✅ PASSED" || echo "❌ FAILED") | API endpoints and services |
| Integration Tests | $([ $PASSED_TESTS -gt 2 ] && echo "✅ PASSED" || echo "❌ FAILED") | Database and service integration |
| Playwright E2E Tests | $([ $PASSED_TESTS -gt 3 ] && echo "✅ PASSED" || echo "❌ FAILED") | End-to-end user workflows |
| Cypress E2E Tests | $([ $PASSED_TESTS -gt 4 ] && echo "✅ PASSED" || echo "❌ FAILED") | Alternative E2E testing |
| Performance Tests | $([ $PASSED_TESTS -gt 5 ] && echo "✅ PASSED" || echo "❌ FAILED") | Load and performance testing |
| Accessibility Tests | $([ $PASSED_TESTS -gt 6 ] && echo "✅ PASSED" || echo "❌ FAILED") | Accessibility compliance |

## Summary

- **Total Test Suites**: $TOTAL_TESTS
- **Passed**: $PASSED_TESTS
- **Failed**: $FAILED_TESTS
- **Success Rate**: $(( (PASSED_TESTS * 100) / TOTAL_TESTS ))%

## Coverage Reports

- Unit Test Coverage: See \`coverage/lcov-report/index.html\`
- Playwright Report: See \`test-results/playwright-report/index.html\`
- Cypress Report: See \`cypress/reports/\`

## Detailed Logs

- Unit Tests: \`test-results/unit-tests.log\`
- Backend Tests: \`test-results/backend-tests.log\`
- Integration Tests: \`test-results/integration-tests.log\`
- Playwright Tests: \`test-results/playwright-tests.log\`
- Cypress Tests: \`test-results/cypress-tests.log\`
- Performance Tests: \`test-results/performance-tests.log\`
- Accessibility Tests: \`test-results/accessibility-tests.log\`

## Next Steps

$([ $FAILED_TESTS -eq 0 ] && echo "🎉 All tests passed! The application is ready for production deployment." || echo "⚠️  Some tests failed. Please review the logs and fix the issues before deploying to production.")

EOF

# Stop the development server
print_status "Stopping development server..."
kill $SERVER_PID 2>/dev/null || true

# Display final results
echo ""
echo "================================================================"
echo "🧪 Test Suite Complete"
echo "================================================================"
echo -e "Total Test Suites: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo -e "Success Rate: ${YELLOW}$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))%${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    print_success "🎉 All tests passed! The application is ready for production deployment."
    echo ""
    echo "📊 View detailed reports:"
    echo "  - Test Summary: test-results/test-summary.md"
    echo "  - Coverage Report: coverage/lcov-report/index.html"
    echo "  - Playwright Report: test-results/playwright-report/index.html"
    exit 0
else
    print_error "⚠️  Some tests failed. Please review the logs and fix the issues."
    echo ""
    echo "📋 Failed test logs:"
    echo "  - Unit Tests: test-results/unit-tests.log"
    echo "  - Backend Tests: test-results/backend-tests.log"
    echo "  - Integration Tests: test-results/integration-tests.log"
    echo "  - Playwright Tests: test-results/playwright-tests.log"
    echo "  - Cypress Tests: test-results/cypress-tests.log"
    echo "  - Performance Tests: test-results/performance-tests.log"
    echo "  - Accessibility Tests: test-results/accessibility-tests.log"
    exit 1
fi
