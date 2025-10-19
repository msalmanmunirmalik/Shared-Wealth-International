import dotenv from 'dotenv';
dotenv.config();

// Test credentials
const TEST_USER = {
  email: 'luis@ktalise.com',
  password: 'Sharedwealth123'
};

async function callApi(baseUrl, endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    
    const data = await response.json();
    return { 
      success: response.ok, 
      status: response.status,
      data 
    };
  } catch (error) {
    return { 
      success: false, 
      status: 0,
      error: error.message 
    };
  }
}

async function testEnvironment(name, baseUrl) {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`   🧪 Testing ${name}`);
  console.log(`   URL: ${baseUrl}`);
  console.log(`${'═'.repeat(70)}\n`);

  const results = {
    environment: name,
    baseUrl,
    tests: []
  };

  // Test 1: Health Check
  console.log('1️⃣  Health Check...');
  const healthResult = await callApi(baseUrl.replace('/api', ''), '/health');
  results.tests.push({
    name: 'Health Check',
    success: healthResult.success,
    status: healthResult.status,
    result: healthResult.success ? '✅ PASS' : `❌ FAIL (${healthResult.error || healthResult.status})`
  });
  console.log(`   ${results.tests[0].result}`);

  // Test 2: API Status
  console.log('\n2️⃣  API Status Check...');
  const statusResult = await callApi(baseUrl, '/auth/signin', 'OPTIONS');
  results.tests.push({
    name: 'API Accessible',
    success: statusResult.status !== 0,
    status: statusResult.status,
    result: statusResult.status !== 0 ? '✅ PASS' : `❌ FAIL (Connection refused)`
  });
  console.log(`   ${results.tests[1].result}`);

  if (!statusResult.success && statusResult.status === 0) {
    console.log('\n   ⚠️  Backend server is not accessible!');
    console.log(`   Cannot reach: ${baseUrl}`);
    return results;
  }

  // Test 3: Authentication
  console.log('\n3️⃣  Authentication...');
  const loginResult = await callApi(baseUrl, '/auth/signin', 'POST', TEST_USER);
  results.tests.push({
    name: 'User Login',
    success: loginResult.success && loginResult.data?.session?.access_token,
    status: loginResult.status,
    result: loginResult.success ? '✅ PASS' : `❌ FAIL (${loginResult.data?.message || 'No token'})`
  });
  console.log(`   ${results.tests[2].result}`);

  if (!loginResult.success || !loginResult.data?.session?.access_token) {
    console.log(`\n   ⚠️  Cannot proceed - authentication failed`);
    return results;
  }

  const token = loginResult.data.session.access_token;
  console.log(`   User: ${loginResult.data.session.user.email}`);
  console.log(`   Role: ${loginResult.data.session.user.role}`);

  // Test 4: Get Companies
  console.log('\n4️⃣  Get Companies...');
  const companiesResult = await callApi(baseUrl, '/companies', 'GET', null, token);
  results.tests.push({
    name: 'Get Companies',
    success: companiesResult.success,
    status: companiesResult.status,
    count: companiesResult.data?.data?.length || companiesResult.data?.length || 0,
    result: companiesResult.success ? 
      `✅ PASS (${companiesResult.data?.data?.length || companiesResult.data?.length || 0} companies)` : 
      `❌ FAIL (${companiesResult.status})`
  });
  console.log(`   ${results.tests[3].result}`);

  // Test 5: Get User Companies
  console.log('\n5️⃣  Get User Companies...');
  const userCompaniesResult = await callApi(baseUrl, '/companies/user', 'GET', null, token);
  results.tests.push({
    name: 'Get User Companies',
    success: userCompaniesResult.success,
    status: userCompaniesResult.status,
    count: userCompaniesResult.data?.data?.length || userCompaniesResult.data?.length || 0,
    result: userCompaniesResult.success ? 
      `✅ PASS (${userCompaniesResult.data?.data?.length || userCompaniesResult.data?.length || 0} companies)` : 
      `❌ FAIL (${userCompaniesResult.status})`
  });
  console.log(`   ${results.tests[4].result}`);

  // Test 6: Get User Network
  console.log('\n6️⃣  Get User Network...');
  const networkResult = await callApi(baseUrl, '/networks/user', 'GET', null, token);
  results.tests.push({
    name: 'Get User Network',
    success: networkResult.success,
    status: networkResult.status,
    count: networkResult.data?.data?.length || networkResult.data?.length || 0,
    result: networkResult.success ? 
      `✅ PASS (${networkResult.data?.data?.length || networkResult.data?.length || 0} connections)` : 
      `❌ FAIL (${networkResult.status})`
  });
  console.log(`   ${results.tests[5].result}`);

  // Test 7: Get Content
  console.log('\n7️⃣  Get Content...');
  const contentResult = await callApi(baseUrl, '/content', 'GET', null, token);
  results.tests.push({
    name: 'Get Content',
    success: contentResult.success,
    status: contentResult.status,
    count: contentResult.data?.data?.length || contentResult.data?.length || 0,
    result: contentResult.success ? 
      `✅ PASS (${contentResult.data?.data?.length || contentResult.data?.length || 0} posts)` : 
      `❌ FAIL (${contentResult.status})`
  });
  console.log(`   ${results.tests[6].result}`);

  return results;
}

async function runDiagnostics() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║   🔬 COMPREHENSIVE DIAGNOSTIC TEST                                ║');
  console.log('║   Shared Wealth International - Frontend & Backend                ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝');

  const environments = [
    {
      name: 'LOCALHOST',
      baseUrl: 'http://localhost:8080/api'
    },
    {
      name: 'PRODUCTION (Render)',
      baseUrl: 'https://sharedwealth.net/api'
    }
  ];

  const allResults = [];

  for (const env of environments) {
    const result = await testEnvironment(env.name, env.baseUrl);
    allResults.push(result);
  }

  // Summary Report
  console.log('\n\n');
  console.log('╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║   📊 SUMMARY REPORT                                               ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  for (const result of allResults) {
    console.log(`\n${result.environment}:`);
    console.log(`${'─'.repeat(70)}`);
    
    const passedTests = result.tests.filter(t => t.success).length;
    const totalTests = result.tests.length;
    const percentage = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    
    console.log(`Tests Passed: ${passedTests}/${totalTests} (${percentage}%)`);
    console.log(`\nTest Results:`);
    
    result.tests.forEach((test, idx) => {
      console.log(`  ${idx + 1}. ${test.name.padEnd(25)} ${test.result}`);
    });

    console.log('');
  }

  // Final Verdict
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║   🎯 DIAGNOSIS                                                    ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  const localhostResult = allResults.find(r => r.environment === 'LOCALHOST');
  const productionResult = allResults.find(r => r.environment === 'PRODUCTION (Render)');

  const localhostPassed = localhostResult?.tests.filter(t => t.success).length || 0;
  const productionPassed = productionResult?.tests.filter(t => t.success).length || 0;

  if (localhostPassed >= 5) {
    console.log('✅ LOCALHOST: Working properly');
    console.log('   - Frontend is accessible');
    console.log('   - Backend API is running');
    console.log('   - Database is connected');
    console.log('   - Authentication works');
  } else {
    console.log('❌ LOCALHOST: Issues detected');
    if (localhostResult?.tests[1]?.success === false) {
      console.log('   - Backend server is not running or not accessible');
      console.log('   - Solution: Run `pnpm run server:dev`');
    }
    if (localhostResult?.tests[2]?.success === false) {
      console.log('   - Authentication failing');
      console.log('   - Check database connection and user data');
    }
  }

  console.log('');

  if (productionPassed >= 5) {
    console.log('✅ PRODUCTION: Working properly');
    console.log('   - Frontend deployed correctly');
    console.log('   - Backend API is accessible');
    console.log('   - Database is connected');
  } else {
    console.log('❌ PRODUCTION: Issues detected');
    if (productionResult?.tests[1]?.success === false) {
      console.log('   - Backend server does not exist');
      console.log('   - Solution: Deploy Node.js web service to Render');
      console.log('   - OR: Update VITE_API_URL to point to existing backend');
    } else if (productionResult?.tests[2]?.success === false) {
      console.log('   - Backend exists but authentication failing');
      console.log('   - Check database connection and migrations');
    }
  }

  console.log('\n');
  console.log('═'.repeat(70));
  console.log('Diagnostic Complete!');
  console.log('═'.repeat(70));
  console.log('');
}

runDiagnostics().catch(console.error);

