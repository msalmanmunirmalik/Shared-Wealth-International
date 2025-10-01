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

async function debug500Error() {
  console.log('🔍 Debugging 500 Error on /api/companies/user...\n');

  try {
    // Login first
    console.log('🔐 Step 1: Authentication');
    const loginResult = await callApi('/auth/signin', 'POST', {
      email: 'luis@ktalise.com',
      password: 'Sharedwealth123'
    });

    if (!loginResult.success || !loginResult.data.session?.access_token) {
      console.log('❌ Login failed:', loginResult.error || loginResult.data);
      return;
    }

    const token = loginResult.data.session.access_token;
    console.log('✅ Login successful');

    // Test the problematic endpoint
    console.log('\n🏢 Step 2: Testing /api/companies/user endpoint');
    const userCompaniesResult = await callApi('/companies/user', 'GET', null, token);
    
    console.log(`Status: ${userCompaniesResult.status} ${userCompaniesResult.statusText}`);
    console.log('Response:', JSON.stringify(userCompaniesResult.data, null, 2));
    
    if (!userCompaniesResult.success) {
      console.log('\n❌ 500 Error Details:');
      console.log('Full response:', userCompaniesResult);
    } else {
      console.log('\n✅ Endpoint working correctly');
    }

    // Test other endpoints for comparison
    console.log('\n🌐 Step 3: Testing other endpoints for comparison');
    
    const allCompaniesResult = await callApi('/companies', 'GET');
    console.log(`All Companies Status: ${allCompaniesResult.status}`);
    
    const dashboardResult = await callApi('/dashboard/activities', 'GET', null, token);
    console.log(`Dashboard Activities Status: ${dashboardResult.status}`);
    
    const applicationsResult = await callApi('/companies/applications', 'GET', null, token);
    console.log(`Applications Status: ${applicationsResult.status}`);

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debug500Error().catch(console.error);
