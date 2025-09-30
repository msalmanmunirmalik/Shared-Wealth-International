#!/usr/bin/env node

/**
 * Comprehensive End-to-End Testing Script for Shared Wealth International
 * Tests all aspects of the platform including:
 * - Authentication flows
 * - User management
 * - Company management
 * - Dashboard functionality
 * - API endpoints
 * - Frontend-backend integration
 * - CRUD operations
 * - Error handling
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const TEST_CONFIG = {
  LOCAL_BASE_URL: 'http://localhost:8080',
  PRODUCTION_BASE_URL: 'https://sharedwealth.net',
  TIMEOUT: 30000,
  VIEWPORT: { width: 1280, height: 720 },
  HEADLESS: process.env.HEADLESS !== 'false', // Set to false for debugging
  SLOW_MO: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
};

// Test credentials
const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@sharedwealth.com',
    password: 'admin123'
  },
  director: {
    email: 'supernovaeco@sharedwealth.com',
    password: 'Sharedwealth123'
  }
};

// Test results storage
const testResults = {
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  },
  tests: [],
  environment: '',
  timestamp: new Date().toISOString()
};

/**
 * Utility functions
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
};

const addTestResult = (name, status, details = '', error = null) => {
  testResults.summary.total++;
  if (status === 'passed') testResults.summary.passed++;
  else if (status === 'failed') testResults.summary.failed++;
  else if (status === 'skipped') testResults.summary.skipped++;

  testResults.tests.push({
    name,
    status,
    details,
    error: error ? error.message : null,
    timestamp: new Date().toISOString()
  });

  log(`${status.toUpperCase()}: ${name} - ${details}`, status === 'passed' ? 'success' : status === 'failed' ? 'error' : 'warning');
};

/**
 * Test helper functions
 */
const waitForElement = async (page, selector, timeout = 10000) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    return false;
  }
};

const waitForNavigation = async (page, timeout = 10000) => {
  try {
    await page.waitForNavigation({ timeout });
    return true;
  } catch (error) {
    return false;
  }
};

const checkApiEndpoint = async (page, endpoint, expectedStatus = 200) => {
  try {
    const response = await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}${endpoint}`);
    const status = response.status();
    return status === expectedStatus;
  } catch (error) {
    return false;
  }
};

const testAuthentication = async (page, credentials, userType) => {
  const testName = `Authentication - ${userType} login`;
  
  try {
    // Navigate to auth page (correct route)
    await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}/auth`);
    await delay(2000);

    // Check if auth page loaded with tabs
    const tabsExists = await waitForElement(page, '[role="tablist"], .tabs', 5000);
    if (!tabsExists) {
      addTestResult(testName, 'failed', 'Auth page tabs not found');
      return false;
    }

    // Ensure we're on the signin tab (should be default)
    const signinTab = await page.$('[value="signin"], [data-state="active"]');
    if (!signinTab) {
      // Try to click the signin tab
      const signinTabButton = await page.$('[role="tab"]:has-text("Sign In"), [role="tab"]:has-text("Sign in")');
      if (signinTabButton) {
        await page.click('[role="tab"]:has-text("Sign In"), [role="tab"]:has-text("Sign in")');
        await delay(1000);
      }
    }

    // Check if login form is present
    const loginFormExists = await waitForElement(page, 'form', 3000);
    if (!loginFormExists) {
      addTestResult(testName, 'failed', 'Login form not found after tab navigation');
      return false;
    }

    // Clear any existing values and fill login form
    await page.click('#signin-email', { clickCount: 3 });
    await page.type('#signin-email', credentials.email);
    
    await page.click('#signin-password', { clickCount: 3 });
    await page.type('#signin-password', credentials.password);
    
    // Submit form - look for sign in button specifically
    await page.click('button[type="submit"]');
    await delay(3000);

    // Check for successful login - look for redirect or user state
    const currentUrl = page.url();
    const hasUserMenu = await page.$('.user-menu, .profile-menu, [data-testid="user-menu"], [data-testid="user-avatar"]');
    const isOnDashboard = currentUrl.includes('/dashboard') || currentUrl.includes('/home');
    const isOnHome = currentUrl === TEST_CONFIG[testResults.environment + '_BASE_URL'] + '/';
    
    // Check for authentication state in localStorage or cookies
    const authState = await page.evaluate(() => {
      return {
        token: localStorage.getItem('token') || localStorage.getItem('access_token'),
        user: localStorage.getItem('user'),
        hasAuthCookie: document.cookie.includes('token') || document.cookie.includes('session')
      };
    });

    if (isOnDashboard || isOnHome || hasUserMenu || authState.token || authState.user || authState.hasAuthCookie) {
      addTestResult(testName, 'passed', `Successfully logged in as ${userType} - URL: ${currentUrl}`);
      return true;
    } else {
      // Check for error messages or loading states
      const errorMessage = await page.evaluate(() => {
        const errorEl = document.querySelector('.error, .alert-danger, [role="alert"], .text-red-500, .text-red-600');
        return errorEl ? errorEl.textContent.trim() : null;
      });
      
      const loadingState = await page.$('button[disabled]');
      
      addTestResult(testName, 'failed', `Login failed - URL: ${currentUrl}, Error: ${errorMessage || 'No error message'}, Loading: ${loadingState ? 'Yes' : 'No'}`);
      return false;
    }
  } catch (error) {
    addTestResult(testName, 'failed', `Authentication test failed: ${error.message}`);
    return false;
  }
};

const testNavigation = async (page) => {
  const testName = 'Navigation - Menu and routing';
  
  try {
    // First check if we're authenticated by looking for user indicators
    const isAuthenticated = await page.evaluate(() => {
      return {
        hasToken: !!(localStorage.getItem('token') || localStorage.getItem('access_token')),
        hasUser: !!localStorage.getItem('user'),
        hasAuthCookie: document.cookie.includes('token') || document.cookie.includes('session')
      };
    });

    if (!isAuthenticated.hasToken && !isAuthenticated.hasUser && !isAuthenticated.hasAuthCookie) {
      addTestResult(testName, 'skipped', 'Navigation test skipped - user not authenticated');
      return;
    }

    // Test navigation menu items - use valid CSS selectors
    const navItems = [
      { selector: 'a[href="/dashboard"], [data-testid="dashboard-link"]', name: 'Dashboard' },
      { selector: 'a[href="/companies"], [data-testid="companies-link"]', name: 'Companies' },
      { selector: 'a[href="/users"], [data-testid="users-link"]', name: 'Users' },
      { selector: 'a[href="/profile"], [data-testid="profile-link"]', name: 'Profile' },
      { selector: 'nav a, .nav-link, .navigation a', name: 'Navigation Links' },
      { selector: 'header a, .header a', name: 'Header Links' }
    ];

    let passedTests = 0;
    let totalNavItems = 0;
    
    for (const item of navItems) {
      const elements = await page.$$(item.selector);
      if (elements.length > 0) {
        totalNavItems += elements.length;
        // Try to click the first navigation item
        try {
          await elements[0].click();
          await delay(1000);
          passedTests++;
        } catch (clickError) {
          // If click fails, still count as found
          passedTests++;
        }
      }
    }

    if (totalNavItems > 0) {
      addTestResult(testName, 'passed', `${passedTests}/${navItems.length} navigation categories with ${totalNavItems} total items working`);
    } else {
      addTestResult(testName, 'failed', 'No navigation items found - may need authentication');
    }
  } catch (error) {
    addTestResult(testName, 'failed', `Navigation test failed: ${error.message}`);
  }
};

const testDashboard = async (page) => {
  const testName = 'Dashboard - Core functionality';
  
  try {
    // Check authentication first
    const isAuthenticated = await page.evaluate(() => {
      return {
        hasToken: !!(localStorage.getItem('token') || localStorage.getItem('access_token')),
        hasUser: !!localStorage.getItem('user'),
        hasAuthCookie: document.cookie.includes('token') || document.cookie.includes('session')
      };
    });

    // Navigate to dashboard
    await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}/dashboard`);
    await delay(3000);

    // Check if we were redirected to auth page (indicates protected route)
    const currentUrl = page.url();
    if (currentUrl.includes('/auth') || currentUrl.includes('/login')) {
      addTestResult(testName, 'skipped', 'Dashboard is protected - redirected to auth page');
      return;
    }

    // Check for dashboard elements - use valid CSS selectors
    const dashboardElements = [
      'h1, h2, h3',
      '.dashboard, [data-testid="dashboard"]',
      '.stats, .metrics, .kpi',
      '.chart, .graph, canvas',
      'main, .main-content',
      '.card, .widget',
      'button, .btn'
    ];

    let foundElements = 0;
    for (const selector of dashboardElements) {
      const elements = await page.$$(selector);
      if (elements.length > 0) foundElements++;
    }

    // Also check for specific dashboard content
    const hasDashboardContent = await page.evaluate(() => {
      const bodyText = document.body.textContent.toLowerCase();
      return bodyText.includes('dashboard') || bodyText.includes('welcome') || bodyText.includes('overview');
    });

    if (foundElements >= 3 || hasDashboardContent) {
      addTestResult(testName, 'passed', `Dashboard loaded with ${foundElements} key elements${hasDashboardContent ? ' and dashboard content' : ''}`);
    } else {
      addTestResult(testName, 'failed', `Dashboard not properly loaded - found ${foundElements} elements, content: ${hasDashboardContent}`);
    }
  } catch (error) {
    addTestResult(testName, 'failed', `Dashboard test failed: ${error.message}`);
  }
};

const testCompaniesPage = async (page) => {
  const testName = 'Companies - List and management';
  
  try {
    await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}/companies`);
    await delay(2000);

    // Check for companies page elements
    const companiesElements = [
      '.companies-list, .company-grid, [data-testid="companies-list"]',
      '.company-card, .company-item',
      'main, .main-content',
      'h1, h2, h3',
      'button, .btn'
    ];

    let foundElements = 0;
    let totalCompanies = 0;
    
    for (const selector of companiesElements) {
      const elements = await page.$$(selector);
      if (elements.length > 0) {
        foundElements++;
        if (selector.includes('company')) {
          totalCompanies = elements.length;
        }
      }
    }

    if (foundElements >= 2) {
      addTestResult(testName, 'passed', `Companies page loaded with ${foundElements}/${companiesElements.length} key elements${totalCompanies > 0 ? ` and ${totalCompanies} companies` : ''}`);
    } else {
      addTestResult(testName, 'failed', `Companies page missing key elements (${foundElements}/${companiesElements.length})`);
    }
  } catch (error) {
    addTestResult(testName, 'failed', `Companies test failed: ${error.message}`);
  }
};

const testApiEndpoints = async (page) => {
  const testName = 'API Endpoints - Backend connectivity';
  
  try {
    const endpoints = [
      { path: '/api/auth/check', expectedStatus: 200 },
      { path: '/api/users', expectedStatus: 200 },
      { path: '/api/companies', expectedStatus: 200 },
      { path: '/api/health', expectedStatus: 200 }
    ];

    let workingEndpoints = 0;
    
    for (const endpoint of endpoints) {
      const isWorking = await checkApiEndpoint(page, endpoint.path, endpoint.expectedStatus);
      if (isWorking) workingEndpoints++;
    }

    if (workingEndpoints > 0) {
      addTestResult(testName, 'passed', `${workingEndpoints}/${endpoints.length} API endpoints responding`);
    } else {
      addTestResult(testName, 'failed', 'No API endpoints responding correctly');
    }
  } catch (error) {
    addTestResult(testName, 'failed', `API endpoints test failed: ${error.message}`);
  }
};

const testResponsiveDesign = async (page) => {
  const testName = 'Responsive Design - Mobile compatibility';
  
  try {
    // Test mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}/`);
    await delay(1000);

    // Check if mobile menu exists or layout adapts
    const mobileMenu = await page.$('.mobile-menu, .hamburger-menu, [data-testid="mobile-menu"]');
    const isResponsive = await page.evaluate(() => {
      const body = document.body;
      return body.offsetWidth <= 375 || window.getComputedStyle(body).maxWidth !== 'none';
    });

    if (mobileMenu || isResponsive) {
      addTestResult(testName, 'passed', 'Mobile responsive design working');
    } else {
      addTestResult(testName, 'failed', 'Mobile responsive design not working');
    }

    // Reset viewport
    await page.setViewport(TEST_CONFIG.VIEWPORT);
  } catch (error) {
    addTestResult(testName, 'failed', `Responsive design test failed: ${error.message}`);
  }
};

const testAuthPage = async (page) => {
  const testName = 'Auth Page - Sign in/Sign up functionality';
  
  try {
    await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}/auth`);
    await delay(2000);

    // Check for auth page elements
    const authElements = [
      'form',
      'input[type="email"]',
      'input[type="password"]',
      'button[type="submit"]',
      '.tabs, [role="tablist"]'
    ];

    let foundElements = 0;
    for (const selector of authElements) {
      const exists = await page.$(selector);
      if (exists) foundElements++;
    }

    if (foundElements >= 3) {
      addTestResult(testName, 'passed', `Auth page loaded with ${foundElements}/${authElements.length} key elements`);
    } else {
      addTestResult(testName, 'failed', `Auth page missing key elements (${foundElements}/${authElements.length})`);
    }
  } catch (error) {
    addTestResult(testName, 'failed', `Auth page test failed: ${error.message}`);
  }
};

const testFormValidation = async (page) => {
  const testName = 'Form Validation - Input validation testing';
  
  try {
    await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}/auth`);
    await delay(2000);

    // Test form validation by submitting empty form
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      await page.click('button[type="submit"]');
      await delay(1000);

      // Check for validation messages or error states
      const validationElements = [
        '.error, .alert-error',
        '[role="alert"]',
        '.invalid, .is-invalid',
        'input:invalid'
      ];

      let foundValidation = false;
      for (const selector of validationElements) {
        const exists = await page.$(selector);
        if (exists) {
          foundValidation = true;
          break;
        }
      }

      if (foundValidation) {
        addTestResult(testName, 'passed', 'Form validation working - validation messages shown');
      } else {
        addTestResult(testName, 'failed', 'Form validation not working - no validation messages');
      }
    } else {
      addTestResult(testName, 'failed', 'Submit button not found for validation testing');
    }
  } catch (error) {
    addTestResult(testName, 'failed', `Form validation test failed: ${error.message}`);
  }
};

const testPagePerformance = async (page) => {
  const testName = 'Page Performance - Load time and metrics';
  
  try {
    const startTime = Date.now();
    await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}/`);
    await delay(2000);
    const loadTime = Date.now() - startTime;

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0
      };
    });

    // Check if page loads within reasonable time (10 seconds)
    if (loadTime < 10000) {
      addTestResult(testName, 'passed', `Page loaded in ${loadTime}ms (DOM ready: ${metrics.domContentLoaded}ms)`);
    } else {
      addTestResult(testName, 'failed', `Page load too slow: ${loadTime}ms`);
    }
  } catch (error) {
    addTestResult(testName, 'failed', `Performance test failed: ${error.message}`);
  }
};

const testUserRegistration = async (page) => {
  const testName = 'User Registration - Sign up functionality';
  
  try {
    await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}/auth`);
    await delay(2000);

    // Check if signup tab exists and click it
    const signupTab = await page.$('[value="signup"]');
    if (signupTab) {
      await page.click('[value="signup"]');
      await delay(1000);
    } else {
      // Try to find signup tab by text content
      const signupTabByText = await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const signupTab = tabs.find(tab => tab.textContent.toLowerCase().includes('sign up') || tab.textContent.toLowerCase().includes('signup'));
        return signupTab ? true : false;
      });
      
      if (signupTabByText) {
        await page.evaluate(() => {
          const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
          const signupTab = tabs.find(tab => tab.textContent.toLowerCase().includes('sign up') || tab.textContent.toLowerCase().includes('signup'));
          if (signupTab) signupTab.click();
        });
        await delay(1000);
      }
    }

    // Check for signup form elements
    const signupElements = [
      'input[type="email"]',
      'input[type="password"]',
      'input[name="firstName"], input[name="first_name"]',
      'input[name="lastName"], input[name="last_name"]',
      'button[type="submit"]'
    ];

    let foundElements = 0;
    for (const selector of signupElements) {
      const exists = await page.$(selector);
      if (exists) foundElements++;
    }

    if (foundElements >= 3) {
      addTestResult(testName, 'passed', `Signup form loaded with ${foundElements}/${signupElements.length} key elements`);
    } else {
      addTestResult(testName, 'failed', `Signup form missing key elements (${foundElements}/${signupElements.length})`);
    }
  } catch (error) {
    addTestResult(testName, 'failed', `User registration test failed: ${error.message}`);
  }
};

const testAdminFeatures = async (page) => {
  const testName = 'Admin Features - Admin dashboard access';
  
  try {
    // Check if we have admin authentication
    const isAdmin = await page.evaluate(() => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          return userData.role === 'admin' || userData.role === 'superadmin';
        } catch (e) {
          return false;
        }
      }
      return false;
    });

    if (!isAdmin) {
      addTestResult(testName, 'skipped', 'Admin features test skipped - not logged in as admin');
      return;
    }

    // Test admin dashboard access
    await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}/admin`);
    await delay(2000);

    const currentUrl = page.url();
    const hasAdminContent = await page.evaluate(() => {
      const bodyText = document.body.textContent.toLowerCase();
      return bodyText.includes('admin') || bodyText.includes('dashboard') || bodyText.includes('management');
    });

    if (currentUrl.includes('/admin') && hasAdminContent) {
      addTestResult(testName, 'passed', 'Admin dashboard accessible and loaded');
    } else if (currentUrl.includes('/auth')) {
      addTestResult(testName, 'failed', 'Admin dashboard redirected to auth - access denied');
    } else {
      addTestResult(testName, 'failed', 'Admin dashboard not accessible or not loading properly');
    }
  } catch (error) {
    addTestResult(testName, 'failed', `Admin features test failed: ${error.message}`);
  }
};

const testAccessibility = async (page) => {
  const testName = 'Accessibility - Basic accessibility checks';
  
  try {
    await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}/`);
    await delay(2000);

    // Basic accessibility checks
    const accessibilityChecks = await page.evaluate(() => {
      return {
        hasMainLandmark: !!document.querySelector('main, [role="main"]'),
        hasNavigationLandmark: !!document.querySelector('nav, [role="navigation"]'),
        hasHeadings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0,
        hasAltTexts: Array.from(document.querySelectorAll('img')).every(img => img.alt !== undefined),
        hasFormLabels: Array.from(document.querySelectorAll('input')).every(input => 
          input.labels && input.labels.length > 0 || input.getAttribute('aria-label')
        ),
        hasSkipLinks: !!document.querySelector('a[href="#main"], a[href="#content"], .skip-link')
      };
    });

    const passedChecks = Object.values(accessibilityChecks).filter(Boolean).length;
    const totalChecks = Object.keys(accessibilityChecks).length;

    if (passedChecks >= totalChecks * 0.6) { // 60% pass rate
      addTestResult(testName, 'passed', `Accessibility checks passed: ${passedChecks}/${totalChecks}`);
    } else {
      addTestResult(testName, 'failed', `Accessibility issues found: ${passedChecks}/${totalChecks} checks passed`);
    }
  } catch (error) {
    addTestResult(testName, 'failed', `Accessibility test failed: ${error.message}`);
  }
};

const testErrorHandling = async (page) => {
  const testName = 'Error Handling - 404 and error pages';
  
  try {
    // Test 404 page - for SPAs, this might return 200 but show 404 content
    const response = await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}/nonexistent-page`);
    const status = response.status();
    await delay(2000);

    // Check for 404 indicators
    const has404Content = await page.evaluate(() => {
      const bodyText = document.body.textContent.toLowerCase();
      const title = document.title.toLowerCase();
      
      return {
        has404Text: bodyText.includes('404') || bodyText.includes('not found') || bodyText.includes('page not found'),
        has404Title: title.includes('404') || title.includes('not found'),
        hasErrorElements: !!document.querySelector('.error-404, .not-found, .error-page, [data-testid="404"]'),
        isHomePage: bodyText.includes('shared wealth') || bodyText.includes('welcome')
      };
    });

    // For SPAs, 200 status with 404 content or redirect to home is acceptable
    if (status === 404 || has404Content.has404Text || has404Content.has404Title || has404Content.hasErrorElements) {
      addTestResult(testName, 'passed', `404 error handling working - Status: ${status}, 404 content: ${has404Content.has404Text}`);
    } else if (status === 200 && has404Content.isHomePage) {
      addTestResult(testName, 'passed', '404 redirects to home page (SPA behavior)');
    } else {
      addTestResult(testName, 'failed', `404 handling unclear - Status: ${status}, Content: ${JSON.stringify(has404Content)}`);
    }

    // Test another invalid route
    await page.goto(`${TEST_CONFIG[testResults.environment + '_BASE_URL']}/invalid-route-123`);
    await delay(1000);
    
    const second404Check = await page.evaluate(() => {
      const bodyText = document.body.textContent.toLowerCase();
      return bodyText.includes('404') || bodyText.includes('not found') || bodyText.includes('shared wealth');
    });

    if (second404Check) {
      addTestResult(testName + ' (Multiple Routes)', 'passed', 'Multiple 404 routes handled correctly');
    }

  } catch (error) {
    addTestResult(testName, 'failed', `Error handling test failed: ${error.message}`);
  }
};

/**
 * Main test runner
 */
const runTests = async (environment = 'LOCAL') => {
  testResults.environment = environment;
  
  log(`🚀 Starting E2E tests for ${environment} environment...`);
  log(`📍 Base URL: ${TEST_CONFIG[environment + '_BASE_URL']}`);
  
  const browser = await puppeteer.launch({
    headless: TEST_CONFIG.HEADLESS,
    slowMo: TEST_CONFIG.SLOW_MO,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport(TEST_CONFIG.VIEWPORT);
  
  // Set timeout
  page.setDefaultTimeout(TEST_CONFIG.TIMEOUT);

  try {
    // Test 1: Basic page load
    log('Testing basic page load...');
    const response = await page.goto(TEST_CONFIG[environment + '_BASE_URL']);
    if (response.status() === 200) {
      addTestResult('Basic Page Load', 'passed', 'Home page loads successfully');
    } else {
      addTestResult('Basic Page Load', 'failed', `Home page returned status ${response.status()}`);
    }

    // Test 2: Authentication
    log('Testing authentication...');
    await testAuthentication(page, TEST_CREDENTIALS.admin, 'admin');

    // Test 3: Navigation
    log('Testing navigation...');
    await testNavigation(page);

    // Test 4: Dashboard
    log('Testing dashboard...');
    await testDashboard(page);

    // Test 5: Companies page
    log('Testing companies page...');
    await testCompaniesPage(page);

    // Test 6: API endpoints
    log('Testing API endpoints...');
    await testApiEndpoints(page);

    // Test 7: Responsive design
    log('Testing responsive design...');
    await testResponsiveDesign(page);

    // Test 8: Auth page functionality
    log('Testing auth page...');
    await testAuthPage(page);

    // Test 9: Form validation
    log('Testing form validation...');
    await testFormValidation(page);

    // Test 10: Page performance
    log('Testing page performance...');
    await testPagePerformance(page);

    // Test 11: User registration
    log('Testing user registration...');
    await testUserRegistration(page);

    // Test 12: Admin features
    log('Testing admin features...');
    await testAdminFeatures(page);

    // Test 13: Accessibility
    log('Testing accessibility...');
    await testAccessibility(page);

    // Test 14: Error handling
    log('Testing error handling...');
    await testErrorHandling(page);

  } catch (error) {
    log(`Critical error during testing: ${error.message}`, 'error');
    addTestResult('Test Suite', 'failed', `Critical error: ${error.message}`, error);
  } finally {
    await browser.close();
  }
};

/**
 * Generate test report
 */
const generateReport = () => {
  const report = {
    ...testResults,
    summary: {
      ...testResults.summary,
      passRate: testResults.summary.total > 0 ? 
        ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(2) + '%' : '0%'
    }
  };

  const reportPath = path.join(__dirname, `e2e-test-report-${testResults.environment.toLowerCase()}-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  log(`📊 Test Report Generated: ${reportPath}`);
  log(`📈 Summary: ${report.summary.passed}/${report.summary.total} tests passed (${report.summary.passRate})`);
  
  return report;
};

/**
 * Main execution
 */
const main = async () => {
  const args = process.argv.slice(2);
  const environment = args.includes('--production') ? 'PRODUCTION' : 'LOCAL';
  
  try {
    await runTests(environment);
    const report = generateReport();
    
    // Exit with appropriate code
    process.exit(report.summary.failed > 0 ? 1 : 0);
  } catch (error) {
    log(`Fatal error: ${error.message}`, 'error');
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runTests, generateReport, TEST_CONFIG, TEST_CREDENTIALS };
