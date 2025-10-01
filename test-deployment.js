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
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testDeployment() {
  console.log('🚀 Testing Deployment Status...\n');

  try {
    // Test 1: Login with working credentials
    console.log('🔐 Test 1: Authentication');
    const loginResult = await callApi('/auth/signin', 'POST', {
      email: 'luis@ktalise.com',
      password: 'Sharedwealth123'
    });

    let token = null;
    if (loginResult.success && loginResult.data.session && loginResult.data.session.access_token) {
      token = loginResult.data.session.access_token;
      console.log('✅ Login successful');
    } else {
      console.log('❌ Login failed:', loginResult.error || loginResult.data);
      return;
    }

    // Test 2: Check if new network endpoints exist
    console.log('\n🌐 Test 2: Network Endpoints');
    
    const networkUserResult = await callApi('/networks/user', 'GET', null, token);
    console.log(`Network User Endpoint: ${networkUserResult.success ? '✅ Available' : '❌ Not Available'} (Status: ${networkUserResult.status})`);
    if (!networkUserResult.success) {
      console.log(`Error: ${networkUserResult.error || JSON.stringify(networkUserResult.data)}`);
    }

    const availableResult = await callApi('/networks/available', 'GET', null, token);
    console.log(`Available Companies Endpoint: ${availableResult.success ? '✅ Available' : '❌ Not Available'} (Status: ${availableResult.status})`);
    if (!availableResult.success) {
      console.log(`Error: ${availableResult.error || JSON.stringify(availableResult.data)}`);
    }

    // Test 3: Check existing endpoints
    console.log('\n🏢 Test 3: Existing Endpoints');
    
    const userCompaniesResult = await callApi('/companies/user', 'GET', null, token);
    console.log(`User Companies Endpoint: ${userCompaniesResult.success ? '✅ Available' : '❌ Not Available'} (Status: ${userCompaniesResult.status})`);
    if (!userCompaniesResult.success) {
      console.log(`Error: ${userCompaniesResult.error || JSON.stringify(userCompaniesResult.data)}`);
    }

    const allCompaniesResult = await callApi('/companies', 'GET');
    console.log(`All Companies Endpoint: ${allCompaniesResult.success ? '✅ Available' : '❌ Not Available'} (Status: ${allCompaniesResult.status})`);
    if (allCompaniesResult.success) {
      console.log(`  📊 Found ${allCompaniesResult.data.length} companies`);
    }

    // Test 4: Check if network_connections table exists by testing add endpoint
    console.log('\n📊 Test 4: Database Schema');
    if (allCompaniesResult.success && allCompaniesResult.data.length > 0) {
      const testCompany = allCompaniesResult.data[0];
      const addTestResult = await callApi('/networks/add', 'POST', {
        company_id: testCompany.id,
        connection_type: 'member'
      }, token);
      
      if (addTestResult.status === 400 && addTestResult.data?.message?.includes('already in your network')) {
        console.log('✅ Network connections table exists (company already in network)');
      } else if (addTestResult.success) {
        console.log('✅ Network connections table exists (company added successfully)');
        // Remove it immediately
        await callApi('/networks/remove', 'DELETE', { company_id: testCompany.id }, token);
      } else {
        console.log('❌ Network connections table may not exist or endpoint not working');
        console.log(`Error: ${addTestResult.error || JSON.stringify(addTestResult.data)}`);
      }
    }

    console.log('\n🎯 Deployment Status Summary:');
    console.log(`- Authentication: ${loginResult.success ? '✅ Working' : '❌ Failed'}`);
    console.log(`- Network Endpoints: ${networkUserResult.success ? '✅ Deployed' : '❌ Not Deployed'}`);
    console.log(`- User Companies: ${userCompaniesResult.success ? '✅ Working' : '❌ Failed'}`);
    console.log(`- All Companies: ${allCompaniesResult.success ? '✅ Working' : '❌ Failed'}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDeployment().catch(console.error);
