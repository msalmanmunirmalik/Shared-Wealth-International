import dotenv from 'dotenv';

dotenv.config();

const RENDER_API_URL = 'https://shared-wealth-international.onrender.com/api';

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
    const response = await fetch(`${RENDER_API_URL}${endpoint}`, options);
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

async function testRenderDeployment() {
  console.log('🌐 Testing Render Deployment...\n');
  console.log(`API URL: ${RENDER_API_URL}\n`);

  try {
    // Test 1: Health check
    console.log('🏥 Test 1: Health Check');
    const healthResult = await callApi('/health');
    console.log(`Status: ${healthResult.status}`);
    if (healthResult.success) {
      console.log('✅ Health check passed');
    } else {
      console.log('❌ Health check failed:', healthResult.error || healthResult.data);
    }

    // Test 2: Get companies
    console.log('\n🏢 Test 2: Get Companies');
    const companiesResult = await callApi('/companies');
    console.log(`Status: ${companiesResult.status}`);
    if (companiesResult.success) {
      const companies = Array.isArray(companiesResult.data) ? companiesResult.data : companiesResult.data.data;
      console.log(`✅ Companies endpoint works: ${companies?.length || 0} companies`);
    } else {
      console.log('❌ Companies endpoint failed:', healthResult.error || companiesResult.data);
    }

    // Test 3: Test signup
    console.log('\n👤 Test 3: Test Signup');
    const testEmail = `render-test-${Date.now()}@example.com`;
    const signupData = {
      email: testEmail,
      password: 'RenderTest123!',
      firstName: 'Render',
      lastName: 'Test',
      phone: '+1234567890'
    };

    const signupResult = await callApi('/auth/signup', 'POST', signupData);
    console.log(`Signup Status: ${signupResult.status}`);
    if (signupResult.success) {
      console.log('✅ Signup works on Render');
      
      // Test 4: Test login
      console.log('\n🔐 Test 4: Test Login');
      const loginResult = await callApi('/auth/signin', 'POST', {
        email: testEmail,
        password: 'RenderTest123!'
      });

      console.log(`Login Status: ${loginResult.status}`);
      if (loginResult.success) {
        console.log('✅ Login works on Render');
        const token = loginResult.data.session?.access_token;
        
        if (token) {
          // Test 5: Test authenticated endpoint
          console.log('\n🔒 Test 5: Test Authenticated Endpoint');
          const profileResult = await callApi('/users/profile', 'GET', null, token);
          console.log(`Profile Status: ${profileResult.status}`);
          if (profileResult.success) {
            console.log('✅ Authenticated endpoints work');
          }
        }
      } else {
        console.log('❌ Login failed:', loginResult.data);
      }
    } else {
      console.log('❌ Signup failed:', signupResult.data);
    }

    // Test 6: Network endpoints
    console.log('\n🌐 Test 6: Network Endpoints');
    // Need to login first
    const loginForNetwork = await callApi('/auth/signin', 'POST', {
      email: 'luis@ktalise.com',
      password: 'Sharedwealth123'
    });

    if (loginForNetwork.success) {
      const token = loginForNetwork.data.session?.access_token;
      
      const networkResult = await callApi('/networks/user', 'GET', null, token);
      console.log(`Network Status: ${networkResult.status}`);
      if (networkResult.success) {
        console.log('✅ Network endpoints work');
      }

      const availableResult = await callApi('/networks/available', 'GET', null, token);
      console.log(`Available Companies Status: ${availableResult.status}`);
      if (availableResult.success) {
        console.log(`✅ Available companies: ${availableResult.data.data?.length || 0}`);
      }
    }

    console.log('\n🎉 Render Deployment Test Complete!');
    console.log('\n📊 Deployment Status:');
    console.log('Service URL: https://shared-wealth-international.onrender.com');
    console.log('Dashboard: https://dashboard.render.com/web/srv-d3qkcts9c44c73crf3ag');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRenderDeployment().catch(console.error);
