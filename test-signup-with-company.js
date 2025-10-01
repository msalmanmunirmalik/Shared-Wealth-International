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

async function testSignupWithCompany() {
  console.log('🧪 Testing Signup with Company Selection...\n');

  try {
    // First, get available companies
    console.log('📋 Step 1: Get Available Companies');
    const companiesResult = await callApi('/companies');
    if (!companiesResult.success) {
      console.log('❌ Failed to get companies:', companiesResult.error);
      return;
    }

    const companies = companiesResult.data;
    console.log(`✅ Found ${companies.length} available companies`);
    
    if (companies.length === 0) {
      console.log('⚠️ No companies available for testing');
      return;
    }

    // Select a random company for testing
    const testCompany = companies[0];
    console.log(`Selected company: ${testCompany.name} (${testCompany.id})`);

    // Test signup with existing company
    console.log('\n👤 Step 2: Test Signup with Existing Company');
    const testEmail = `test-user-${Date.now()}@example.com`;
    const signupData = {
      email: testEmail,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      position: 'Software Engineer',
      selectedCompanyId: testCompany.id,
      role: 'member'
    };

    const signupResult = await callApi('/auth/signup', 'POST', signupData);
    console.log(`Signup Status: ${signupResult.status} ${signupResult.statusText}`);
    
    if (signupResult.success) {
      console.log('✅ User signup successful');
      console.log('Response:', JSON.stringify(signupResult.data, null, 2));

      // Test login with the new user
      console.log('\n🔐 Step 3: Test Login with New User');
      const loginResult = await callApi('/auth/signin', 'POST', {
        email: testEmail,
        password: 'TestPassword123!'
      });

      if (loginResult.success) {
        console.log('✅ Login successful');
        const token = loginResult.data.session.access_token;
        
        // Test getting user companies to verify the relationship was created
        console.log('\n🏢 Step 4: Verify User-Company Relationship');
        const userCompaniesResult = await callApi('/companies/user', 'GET', null, token);
        
        if (userCompaniesResult.success) {
          console.log('✅ User companies endpoint accessible');
          console.log(`User companies: ${userCompaniesResult.data.length}`);
          
          if (userCompaniesResult.data.length > 0) {
            const userCompany = userCompaniesResult.data[0];
            console.log(`✅ Company relationship found: ${userCompany.name}`);
            console.log(`Role: ${userCompany.role || 'N/A'}`);
            console.log(`Position: ${userCompany.position || 'N/A'}`);
          } else {
            console.log('⚠️ No companies found for user (relationship may not be created)');
          }
        } else {
          console.log(`❌ Failed to get user companies: ${userCompaniesResult.error}`);
        }
      } else {
        console.log(`❌ Login failed: ${loginResult.error}`);
      }
    } else {
      console.log(`❌ Signup failed: ${signupResult.error}`);
      console.log('Response:', JSON.stringify(signupResult.data, null, 2));
    }

    console.log('\n🎉 Signup with Company Selection Test Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSignupWithCompany().catch(console.error);
