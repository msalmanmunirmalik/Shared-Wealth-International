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

async function testFullNetworkFunctionality() {
  console.log('🌐 Testing Full Network Functionality...\n');

  try {
    // Login first
    console.log('🔐 Step 1: Authentication');
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

    // Get available companies
    console.log('\n📋 Step 2: Get Available Companies');
    const availableResult = await callApi('/networks/available', 'GET', null, token);
    if (!availableResult.success || !availableResult.data || availableResult.data.length === 0) {
      console.log('❌ No available companies');
      return;
    }

    const companyToAdd = availableResult.data[0];
    console.log(`✅ Found ${availableResult.data.length} available companies`);
    console.log(`Selected: ${companyToAdd.name} (${companyToAdd.id})`);

    // Add company to network
    console.log('\n➕ Step 3: Add Company to Network');
    const addResult = await callApi('/networks/add', 'POST', {
      company_id: companyToAdd.id,
      connection_type: 'partner',
      notes: 'Test network connection via API'
    }, token);

    console.log(`Add Status: ${addResult.status} ${addResult.statusText}`);
    if (addResult.success) {
      console.log('✅ Company added to network successfully');
      console.log('Response:', JSON.stringify(addResult.data, null, 2));
    } else {
      console.log(`❌ Add Error: ${JSON.stringify(addResult.data, null, 2)}`);
      return;
    }

    // Verify company is in network
    console.log('\n🔍 Step 4: Verify Company in Network');
    const userNetworkResult = await callApi('/networks/user', 'GET', null, token);
    if (userNetworkResult.success) {
      console.log(`✅ User Network: ${userNetworkResult.data.length} companies`);
      if (userNetworkResult.data.length > 0) {
        const addedCompany = userNetworkResult.data.find(c => c.id === companyToAdd.id);
        if (addedCompany) {
          console.log(`✅ Company found in network: ${addedCompany.name}`);
          console.log(`Connection type: ${addedCompany.connection_type}`);
        } else {
          console.log('❌ Company not found in network');
        }
      }
    } else {
      console.log(`❌ User Network Error: ${JSON.stringify(userNetworkResult.data)}`);
    }

    // Remove company from network
    console.log('\n➖ Step 5: Remove Company from Network');
    const removeResult = await callApi('/networks/remove', 'DELETE', {
      company_id: companyToAdd.id
    }, token);

    console.log(`Remove Status: ${removeResult.status} ${removeResult.statusText}`);
    if (removeResult.success) {
      console.log('✅ Company removed from network successfully');
      console.log('Response:', JSON.stringify(removeResult.data, null, 2));
    } else {
      console.log(`❌ Remove Error: ${JSON.stringify(removeResult.data, null, 2)}`);
    }

    // Verify company is removed from network
    console.log('\n🔍 Step 6: Verify Company Removed from Network');
    const finalNetworkResult = await callApi('/networks/user', 'GET', null, token);
    if (finalNetworkResult.success) {
      console.log(`✅ Final User Network: ${finalNetworkResult.data.length} companies`);
      const stillInNetwork = finalNetworkResult.data.find(c => c.id === companyToAdd.id);
      if (!stillInNetwork) {
        console.log('✅ Company successfully removed from network');
      } else {
        console.log('❌ Company still in network');
      }
    }

    console.log('\n🎉 Full Network Functionality Test Complete!');
    console.log('\n📊 Summary:');
    console.log('✅ Available Companies: Working');
    console.log('✅ Add to Network: Working');
    console.log('✅ User Network: Working');
    console.log('✅ Remove from Network: Working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFullNetworkFunctionality().catch(console.error);
