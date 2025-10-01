import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.VITE_API_URL || 'https://sharedwealth.net/api';

async function callApi(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { 
      success: response.ok, 
      data, 
      status: response.status,
      statusText: response.statusText 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testRouteRegistration() {
  console.log('🔍 Testing Route Registration...\n');

  try {
    // Test if network routes are accessible at all
    console.log('🌐 Testing /api/networks/user (without auth)');
    const noAuthResult = await callApi('/networks/user', 'GET');
    console.log(`Status: ${noAuthResult.status} ${noAuthResult.statusText}`);
    if (noAuthResult.status === 401) {
      console.log('✅ Route exists (401 Unauthorized is expected)');
    } else if (noAuthResult.status === 404) {
      console.log('❌ Route does not exist (404 Not Found)');
    } else {
      console.log(`⚠️ Unexpected status: ${noAuthResult.status}`);
    }

    // Test with authentication
    console.log('\n🔐 Testing with authentication');
    const loginResult = await callApi('/auth/signin', 'POST', {
      email: 'luis@ktalise.com',
      password: 'Sharedwealth123'
    });

    if (!loginResult.success || !loginResult.data.session?.access_token) {
      console.log('❌ Login failed');
      return;
    }

    const token = loginResult.data.session.access_token;
    console.log('✅ Login successful');

    // Test network endpoint with auth
    console.log('\n🌐 Testing /api/networks/user (with auth)');
    const authResult = await callApi('/networks/user', 'GET', null, token);
    console.log(`Status: ${authResult.status} ${authResult.statusText}`);
    console.log('Response:', JSON.stringify(authResult.data, null, 2));

    // Test if the issue is with the DatabaseService
    console.log('\n💾 Testing if DatabaseService is the issue');
    console.log('Testing a simple companies endpoint for comparison...');
    const companiesResult = await callApi('/companies', 'GET');
    console.log(`Companies Status: ${companiesResult.status}`);
    if (companiesResult.success) {
      console.log(`✅ Companies endpoint works: ${companiesResult.data.length} companies`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRouteRegistration().catch(console.error);
