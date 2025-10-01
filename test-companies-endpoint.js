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

async function testCompaniesEndpoint() {
  console.log('🔍 Testing Companies Endpoint...\n');

  try {
    // Test the working /api/companies endpoint
    console.log('📋 Testing /api/companies endpoint');
    const companiesResult = await callApi('/companies', 'GET');
    console.log(`Status: ${companiesResult.status} ${companiesResult.statusText}`);
    
    if (companiesResult.success) {
      console.log(`✅ Companies endpoint works: ${companiesResult.data.length} companies`);
      if (companiesResult.data.length > 0) {
        console.log('\nFirst 3 companies:');
        companiesResult.data.slice(0, 3).forEach((company, index) => {
          console.log(`  ${index + 1}. ${company.name} (ID: ${company.id}, Active: ${company.is_active})`);
        });
      }
    } else {
      console.log(`❌ Companies endpoint error: ${companiesResult.error || JSON.stringify(companiesResult.data)}`);
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

    // Test network endpoints again
    console.log('\n🌐 Testing network endpoints with auth');
    const availableResult = await callApi('/networks/available', 'GET', null, token);
    console.log(`Available Status: ${availableResult.status}`);
    console.log('Available Response:', JSON.stringify(availableResult.data, null, 2));

    const userNetworkResult = await callApi('/networks/user', 'GET', null, token);
    console.log(`User Network Status: ${userNetworkResult.status}`);
    console.log('User Network Response:', JSON.stringify(userNetworkResult.data, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCompaniesEndpoint().catch(console.error);
