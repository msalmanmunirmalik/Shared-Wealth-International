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

async function testRoleFix() {
  console.log('🧪 Testing Role Fix...\n');

  try {
    // Test with valid role value
    console.log('✅ Test: Signup with valid role "user"');
    const validRoleData = {
      email: `valid-role-${Date.now()}@example.com`,
      password: 'Test123!',
      firstName: 'Valid',
      lastName: 'User',
      phone: '+1234567890',
      role: 'user' // Valid role value
    };
    
    const validRoleResult = await callApi('/auth/signup', 'POST', validRoleData);
    console.log(`Status: ${validRoleResult.status}`);
    console.log(`Success: ${validRoleResult.success}`);
    if (!validRoleResult.success) {
      console.log('Error:', validRoleResult.data);
    }

    // Test with company selection
    console.log('\n🏢 Test: Signup with company selection');
    const companiesResult = await callApi('/companies');
    if (companiesResult.success && companiesResult.data.length > 0) {
      const companyId = companiesResult.data[0].id;
      
      const companySignupData = {
        email: `company-signup-${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Company',
        lastName: 'User',
        phone: '+1234567890',
        role: 'user',
        position: 'Manager',
        selectedCompanyId: companyId
      };
      
      const companySignupResult = await callApi('/auth/signup', 'POST', companySignupData);
      console.log(`Status: ${companySignupResult.status}`);
      console.log(`Success: ${companySignupResult.success}`);
      if (!companySignupResult.success) {
        console.log('Error:', companySignupResult.data);
      } else {
        console.log('✅ Company signup successful!');
        
        // Test login
        const loginResult = await callApi('/auth/signin', 'POST', {
          email: companySignupData.email,
          password: companySignupData.password
        });
        
        if (loginResult.success) {
          console.log('✅ Login successful');
          const token = loginResult.data.session.access_token;
          
          // Test user companies
          const userCompaniesResult = await callApi('/companies/user', 'GET', null, token);
          console.log(`User Companies Status: ${userCompaniesResult.status}`);
          if (userCompaniesResult.success) {
            console.log(`✅ User has ${userCompaniesResult.data.length} companies`);
            if (userCompaniesResult.data.length > 0) {
              console.log(`Company: ${userCompaniesResult.data[0].name}`);
            }
          }
        }
      }
    }

    console.log('\n🎯 Role Fix Test Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRoleFix().catch(console.error);
