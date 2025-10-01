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

async function testNetworkEndpoints() {
  console.log('🌐 Testing Network Endpoints Deployment...\n');

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

    // Test network endpoints
    console.log('\n🌐 Step 2: Testing Network Endpoints');
    
    // Test /api/networks/user
    console.log('\n📋 Testing /api/networks/user');
    const userNetworkResult = await callApi('/networks/user', 'GET', null, token);
    console.log(`Status: ${userNetworkResult.status} ${userNetworkResult.statusText}`);
    if (userNetworkResult.success) {
      console.log(`✅ User Network: ${userNetworkResult.data.length || 0} companies`);
    } else {
      console.log(`❌ User Network Error: ${userNetworkResult.error || JSON.stringify(userNetworkResult.data)}`);
    }

    // Test /api/networks/available
    console.log('\n📋 Testing /api/networks/available');
    const availableResult = await callApi('/networks/available', 'GET', null, token);
    console.log(`Status: ${availableResult.status} ${availableResult.statusText}`);
    if (availableResult.success) {
      console.log(`✅ Available Companies: ${availableResult.data.length || 0} companies`);
      if (availableResult.data.length > 0) {
        console.log('First 3 available companies:');
        availableResult.data.slice(0, 3).forEach((company, index) => {
          console.log(`  ${index + 1}. ${company.name} (${company.sector || 'N/A'})`);
        });
      }
    } else {
      console.log(`❌ Available Companies Error: ${availableResult.error || JSON.stringify(availableResult.data)}`);
    }

    // Test adding a company to network (if available)
    if (availableResult.success && availableResult.data.length > 0) {
      console.log('\n➕ Step 3: Testing Add to Network');
      const companyToAdd = availableResult.data[0];
      console.log(`Adding ${companyToAdd.name} to network...`);
      
      const addResult = await callApi('/networks/add', 'POST', {
        company_id: companyToAdd.id,
        connection_type: 'partner',
        notes: 'Test network connection'
      }, token);
      
      console.log(`Add Status: ${addResult.status} ${addResult.statusText}`);
      if (addResult.success) {
        console.log('✅ Company added to network successfully');
        
        // Test removing it
        console.log('\n➖ Step 4: Testing Remove from Network');
        const removeResult = await callApi('/networks/remove', 'DELETE', {
          company_id: companyToAdd.id
        }, token);
        
        console.log(`Remove Status: ${removeResult.status} ${removeResult.statusText}`);
        if (removeResult.success) {
          console.log('✅ Company removed from network successfully');
        } else {
          console.log(`❌ Remove Error: ${removeResult.error || JSON.stringify(removeResult.data)}`);
        }
      } else {
        console.log(`❌ Add Error: ${addResult.error || JSON.stringify(addResult.data)}`);
      }
    } else {
      console.log('⚠️ No available companies to test network operations');
    }

    console.log('\n🎉 Network Endpoints Test Complete!');
    
    // Summary
    console.log('\n📊 Network Endpoints Status:');
    console.log(`- /api/networks/user: ${userNetworkResult.success ? '✅ WORKING' : '❌ NOT AVAILABLE'}`);
    console.log(`- /api/networks/available: ${availableResult.success ? '✅ WORKING' : '❌ NOT AVAILABLE'}`);
    console.log(`- /api/networks/add: ${availableResult.success ? '✅ READY TO TEST' : '❌ CANNOT TEST'}`);
    console.log(`- /api/networks/remove: ${availableResult.success ? '✅ READY TO TEST' : '❌ CANNOT TEST'}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testNetworkEndpoints().catch(console.error);
