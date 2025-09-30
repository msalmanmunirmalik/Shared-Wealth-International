#!/usr/bin/env node

/**
 * E2E Test Runner for Shared Wealth International
 * Runs comprehensive tests on both local and production environments
 */

import { runTests, generateReport } from './e2e-test.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
};

const runAllTests = async () => {
  log('🚀 Starting comprehensive E2E testing for Shared Wealth International...');
  
  const results = {
    local: null,
    production: null,
    summary: {
      totalTests: 0,
      totalPassed: 0,
      totalFailed: 0,
      environments: []
    }
  };

  // Test local environment
  log('📱 Testing LOCAL environment...');
  try {
    await runTests('LOCAL');
    results.local = generateReport();
    results.summary.environments.push('local');
    results.summary.totalTests += results.local.summary.total;
    results.summary.totalPassed += results.local.summary.passed;
    results.summary.totalFailed += results.local.summary.failed;
    log('✅ Local environment testing completed', 'success');
  } catch (error) {
    log(`❌ Local environment testing failed: ${error.message}`, 'error');
  }

  // Wait a bit before testing production
  log('⏳ Waiting 5 seconds before testing production...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Test production environment
  log('🌐 Testing PRODUCTION environment...');
  try {
    await runTests('PRODUCTION');
    results.production = generateReport();
    results.summary.environments.push('production');
    results.summary.totalTests += results.production.summary.total;
    results.summary.totalPassed += results.production.summary.passed;
    results.summary.totalFailed += results.production.summary.failed;
    log('✅ Production environment testing completed', 'success');
  } catch (error) {
    log(`❌ Production environment testing failed: ${error.message}`, 'error');
  }

  // Generate comprehensive report
  const comprehensiveReport = {
    timestamp: new Date().toISOString(),
    summary: results.summary,
    environments: {
      local: results.local,
      production: results.production
    },
    recommendations: generateRecommendations(results)
  };

  const reportPath = path.join(__dirname, `comprehensive-e2e-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(comprehensiveReport, null, 2));

  // Print summary
  log('📊 COMPREHENSIVE TEST RESULTS:', 'success');
  log(`   Total Tests: ${results.summary.totalTests}`);
  log(`   Passed: ${results.summary.totalPassed}`);
  log(`   Failed: ${results.summary.totalFailed}`);
  log(`   Success Rate: ${results.summary.totalTests > 0 ? ((results.summary.totalPassed / results.summary.totalTests) * 100).toFixed(2) : 0}%`);
  log(`   Environments Tested: ${results.summary.environments.join(', ')}`);
  log(`   Report saved to: ${reportPath}`);

  return comprehensiveReport;
};

const generateRecommendations = (results) => {
  const recommendations = [];

  if (results.local && results.local.summary.failed > 0) {
    recommendations.push({
      type: 'local_issues',
      priority: 'high',
      message: 'Local environment has failing tests. Fix these before deploying to production.',
      failingTests: results.local.tests.filter(t => t.status === 'failed').map(t => t.name)
    });
  }

  if (results.production && results.production.summary.failed > 0) {
    recommendations.push({
      type: 'production_issues',
      priority: 'critical',
      message: 'Production environment has failing tests. Immediate attention required.',
      failingTests: results.production.tests.filter(t => t.status === 'failed').map(t => t.name)
    });
  }

  if (results.local && results.production) {
    const localPassRate = (results.local.summary.passed / results.local.summary.total) * 100;
    const productionPassRate = (results.production.summary.passed / results.production.summary.total) * 100;
    
    if (Math.abs(localPassRate - productionPassRate) > 10) {
      recommendations.push({
        type: 'environment_drift',
        priority: 'medium',
        message: 'Significant difference between local and production test results. Investigate environment differences.'
      });
    }
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'success',
      priority: 'low',
      message: 'All tests passing! The application is working correctly in both environments.'
    });
  }

  return recommendations;
};

const main = async () => {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
E2E Test Runner for Shared Wealth International

Usage:
  node run-e2e-tests.js [options]

Options:
  --local-only      Run tests only on local environment
  --production-only Run tests only on production environment
  --help, -h        Show this help message

Examples:
  node run-e2e-tests.js                    # Run tests on both environments
  node run-e2e-tests.js --local-only       # Run tests only locally
  node run-e2e-tests.js --production-only  # Run tests only on production

Environment Variables:
  HEADLESS=false    Run browser in non-headless mode (for debugging)
  SLOW_MO=100       Add 100ms delay between actions (for debugging)
    `);
    return;
  }

  try {
    if (args.includes('--local-only')) {
      log('📱 Running tests on LOCAL environment only...');
      await runTests('LOCAL');
      generateReport();
    } else if (args.includes('--production-only')) {
      log('🌐 Running tests on PRODUCTION environment only...');
      await runTests('PRODUCTION');
      generateReport();
    } else {
      await runAllTests();
    }
    
    log('🎉 E2E testing completed successfully!', 'success');
  } catch (error) {
    log(`💥 E2E testing failed: ${error.message}`, 'error');
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runAllTests, generateRecommendations };
