import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.VITE_API_URL || 'https://sharedwealth.net/api';
const TEST_EMAIL = 'admin@sharedwealth.com';
const TEST_PASSWORD = 'admin123';

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

async function testApiEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');
  console.log(`🌐 Testing: ${API_BASE_URL}`);

  try {
    // Test 1: Health Check
    console.log('\n🔍 Test 1: Health Check');
    const healthResult = await callApi('/health');
    if (healthResult.success) {
      console.log('✅ Health check passed:', healthResult.data);
    } else {
      console.log('❌ Health check failed:', healthResult.error || healthResult.data);
    }

    // Test 2: Login
    console.log('\n🔐 Test 2: User Authentication');
    const loginResult = await callApi('/auth/signin', 'POST', {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    let token = null;
    if (loginResult.success && loginResult.data.session && loginResult.data.session.access_token) {
      token = loginResult.data.session.access_token;
      console.log('✅ Login successful');
    } else {
      console.log('❌ Login failed:', loginResult.error || loginResult.data);
      return;
    }

    // Test 3: Get User Companies (My Companies)
    console.log('\n🏢 Test 3: My Companies (User-owned companies)');
    const userCompaniesResult = await callApi('/companies/user', 'GET', null, token);
    if (userCompaniesResult.success) {
      console.log(`✅ User companies: ${userCompaniesResult.data.length} companies found`);
      userCompaniesResult.data.slice(0, 3).forEach((company, index) => {
        console.log(`  ${index + 1}. ${company.name} (${company.sector || 'N/A'})`);
      });
    } else {
      console.log('❌ Failed to get user companies:', userCompaniesResult.error || userCompaniesResult.data);
    }

    // Test 4: Get User Network
    console.log('\n🌐 Test 4: User Network Companies');
    const networkResult = await callApi('/networks/user', 'GET', null, token);
    if (networkResult.success) {
      console.log(`✅ Network companies: ${networkResult.data.length} companies found`);
      networkResult.data.slice(0, 3).forEach((company, index) => {
        console.log(`  ${index + 1}. ${company.name} (${company.connection_type || 'N/A'})`);
      });
    } else {
      console.log('❌ Failed to get network companies:', networkResult.error || networkResult.data);
    }

    // Test 5: Get Available Companies
    console.log('\n📋 Test 5: Available Companies to Add');
    const availableResult = await callApi('/networks/available', 'GET', null, token);
    if (availableResult.success) {
      console.log(`✅ Available companies: ${availableResult.data.length} companies`);
      availableResult.data.slice(0, 3).forEach((company, index) => {
        console.log(`  ${index + 1}. ${company.name} (${company.sector || 'N/A'})`);
      });
    } else {
      console.log('❌ Failed to get available companies:', availableResult.error || availableResult.data);
    }

    // Test 6: Try to add a company to network (if available)
    if (availableResult.success && availableResult.data.length > 0) {
      console.log('\n➕ Test 6: Add Company to Network');
      const companyToAdd = availableResult.data[0];
      console.log(`Adding ${companyToAdd.name} to network...`);
      
      const addResult = await callApi('/networks/add', 'POST', {
        company_id: companyToAdd.id,
        connection_type: 'partner',
        notes: 'Test connection from API test'
      }, token);

      if (addResult.success) {
        console.log('✅ Company added to network successfully');
        
        // Test 7: Verify it was added
        console.log('\n🔍 Test 7: Verify Network Update');
        const updatedNetworkResult = await callApi('/networks/user', 'GET', null, token);
        if (updatedNetworkResult.success) {
          const addedCompany = updatedNetworkResult.data.find(c => c.id === companyToAdd.id);
          if (addedCompany) {
            console.log(`✅ Found added company: ${addedCompany.name} (${addedCompany.connection_type})`);
          } else {
            console.log('❌ Added company not found in updated network');
          }
        }

        // Test 8: Remove it
        console.log('\n➖ Test 8: Remove Company from Network');
        const removeResult = await callApi('/networks/remove', 'DELETE', {
          company_id: companyToAdd.id
        }, token);

        if (removeResult.success) {
          console.log('✅ Company removed from network successfully');
        } else {
          console.log('❌ Failed to remove company:', removeResult.error || removeResult.data);
        }
      } else {
        console.log('❌ Failed to add company:', addResult.error || addResult.data);
      }
    } else {
      console.log('⚠️ No available companies to test network operations');
    }

    console.log('\n🎉 API Endpoint Testing Complete!');
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`- Health Check: ${healthResult.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`- Authentication: ${token ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`- My Companies: ${userCompaniesResult.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`- Network Companies: ${networkResult.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`- Available Companies: ${availableResult.success ? '✅ PASS' : '❌ FAIL'}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testApiEndpoints().catch(console.error);
