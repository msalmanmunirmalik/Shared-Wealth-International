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

async function debugSignupIssue() {
  console.log('🔍 Debugging Signup Issue...\n');

  try {
    // Test 1: Minimal signup (works)
    console.log('✅ Test 1: Minimal signup (known to work)');
    const minimalData = {
      email: `minimal-${Date.now()}@example.com`,
      password: 'Test123!',
      firstName: 'Min',
      lastName: 'User'
    };
    
    const minimalResult = await callApi('/auth/signup', 'POST', minimalData);
    console.log(`Status: ${minimalResult.status}`);
    console.log(`Success: ${minimalResult.success}`);

    // Test 2: Add phone field
    console.log('\n🔍 Test 2: Adding phone field');
    const phoneData = {
      email: `phone-${Date.now()}@example.com`,
      password: 'Test123!',
      firstName: 'Phone',
      lastName: 'User',
      phone: '+1234567890'
    };
    
    const phoneResult = await callApi('/auth/signup', 'POST', phoneData);
    console.log(`Status: ${phoneResult.status}`);
    console.log(`Success: ${phoneResult.success}`);
    if (!phoneResult.success) {
      console.log('Error:', phoneResult.data);
    }

    // Test 3: Add role field
    console.log('\n🔍 Test 3: Adding role field');
    const roleData = {
      email: `role-${Date.now()}@example.com`,
      password: 'Test123!',
      firstName: 'Role',
      lastName: 'User',
      phone: '+1234567890',
      role: 'member'
    };
    
    const roleResult = await callApi('/auth/signup', 'POST', roleData);
    console.log(`Status: ${roleResult.status}`);
    console.log(`Success: ${roleResult.success}`);
    if (!roleResult.success) {
      console.log('Error:', roleResult.data);
    }

    // Test 4: Add position field
    console.log('\n🔍 Test 4: Adding position field');
    const positionData = {
      email: `position-${Date.now()}@example.com`,
      password: 'Test123!',
      firstName: 'Position',
      lastName: 'User',
      phone: '+1234567890',
      role: 'member',
      position: 'Manager'
    };
    
    const positionResult = await callApi('/auth/signup', 'POST', positionData);
    console.log(`Status: ${positionResult.status}`);
    console.log(`Success: ${positionResult.success}`);
    if (!positionResult.success) {
      console.log('Error:', positionResult.data);
    }

    // Test 5: Add selectedCompanyId field
    console.log('\n🔍 Test 5: Adding selectedCompanyId field');
    
    // First get a company ID
    const companiesResult = await callApi('/companies');
    if (companiesResult.success && companiesResult.data.length > 0) {
      const companyId = companiesResult.data[0].id;
      
      const companyData = {
        email: `company-${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Company',
        lastName: 'User',
        phone: '+1234567890',
        role: 'member',
        position: 'Manager',
        selectedCompanyId: companyId
      };
      
      const companyResult = await callApi('/auth/signup', 'POST', companyData);
      console.log(`Status: ${companyResult.status}`);
      console.log(`Success: ${companyResult.success}`);
      if (!companyResult.success) {
        console.log('Error:', companyResult.data);
      }
    }

    console.log('\n🎯 Debug Complete!');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugSignupIssue().catch(console.error);
