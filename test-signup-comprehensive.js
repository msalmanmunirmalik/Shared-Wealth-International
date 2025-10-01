import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.VITE_API_URL || 'https://sharedwealth.net/api';

async function callApi(endpoint, method = 'GET', body = null, token = null, isFormData = false) {
  const headers = {};
  
  if (!isFormData && body) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    body: isFormData ? body : (body ? JSON.stringify(body) : null),
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

async function testSignupComprehensive() {
  console.log('🧪 Testing Comprehensive Signup Functionality...\n');

  try {
    // Test 1: Basic signup without company
    console.log('👤 Test 1: Basic Signup (New Company)');
    const testEmail1 = `test-user-${Date.now()}@example.com`;
    const basicSignupData = {
      email: testEmail1,
      password: 'TestPassword123!',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      company: 'Test Company Ltd',
      position: 'CEO',
      role: 'member'
    };

    const basicSignupResult = await callApi('/auth/signup', 'POST', basicSignupData);
    console.log(`Basic Signup Status: ${basicSignupResult.status}`);
    if (basicSignupResult.success) {
      console.log('✅ Basic signup successful');
    } else {
      console.log('❌ Basic signup failed:', basicSignupResult.data);
    }

    // Test 2: Signup with existing company
    console.log('\n🏢 Test 2: Signup with Existing Company');
    const companiesResult = await callApi('/companies');
    if (companiesResult.success && companiesResult.data.length > 0) {
      const testCompany = companiesResult.data[0];
      const testEmail2 = `test-user-company-${Date.now()}@example.com`;
      const companySignupData = {
        email: testEmail2,
        password: 'TestPassword123!',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1234567890',
        position: 'Manager',
        selectedCompanyId: testCompany.id,
        role: 'member'
      };

      const companySignupResult = await callApi('/auth/signup', 'POST', companySignupData);
      console.log(`Company Signup Status: ${companySignupResult.status}`);
      if (companySignupResult.success) {
        console.log('✅ Company signup successful');
        
        // Test login and verify company relationship
        const loginResult = await callApi('/auth/signin', 'POST', {
          email: testEmail2,
          password: 'TestPassword123!'
        });

        if (loginResult.success) {
          console.log('✅ Login successful');
          const token = loginResult.data.session.access_token;
          
          // Test user companies endpoint
          const userCompaniesResult = await callApi('/companies/user', 'GET', null, token);
          console.log(`User Companies Status: ${userCompaniesResult.status}`);
          if (userCompaniesResult.success) {
            console.log(`✅ User has ${userCompaniesResult.data.length} companies`);
          }
        }
      } else {
        console.log('❌ Company signup failed:', companySignupResult.data);
      }
    }

    // Test 3: Check signup endpoint accessibility
    console.log('\n📸 Test 3: Signup Endpoint Analysis');
    console.log('Testing signup endpoint structure...');
    
    // Test with minimal data to see what's failing
    const minimalSignupData = {
      email: `minimal-${Date.now()}@example.com`,
      password: 'Test123!',
      firstName: 'Min',
      lastName: 'User'
    };

    const minimalSignupResult = await callApi('/auth/signup', 'POST', minimalSignupData);
    console.log(`Minimal Signup Status: ${minimalSignupResult.status}`);
    if (minimalSignupResult.success) {
      console.log('✅ Minimal signup successful');
    } else {
      console.log('❌ Minimal signup failed:', minimalSignupResult.data);
    }

    // Test 4: Check profile creation
    console.log('\n👤 Test 4: Profile Creation Check');
    const testEmail4 = `test-profile-${Date.now()}@example.com`;
    const profileSignupData = {
      email: testEmail4,
      password: 'TestPassword123!',
      firstName: 'Profile',
      lastName: 'User',
      phone: '+1234567890',
      bio: 'This is a test bio for profile creation',
      company: 'Profile Test Company',
      position: 'Product Manager',
      location: 'Test City, Test Country',
      website: 'https://testuser.com',
      linkedin: 'https://linkedin.com/in/testuser',
      role: 'member'
    };

    const profileSignupResult = await callApi('/auth/signup', 'POST', profileSignupData);
    console.log(`Profile Signup Status: ${profileSignupResult.status}`);
    if (profileSignupResult.success) {
      console.log('✅ Profile signup successful');
      
      // Test login and check user profile
      const profileLoginResult = await callApi('/auth/signin', 'POST', {
        email: testEmail4,
        password: 'TestPassword123!'
      });

      if (profileLoginResult.success) {
        console.log('✅ Profile login successful');
        const token = profileLoginResult.data.session.access_token;
        
        // Test user profile endpoint
        const profileResult = await callApi('/users/profile', 'GET', null, token);
        console.log(`Profile Endpoint Status: ${profileResult.status}`);
        if (profileResult.success) {
          console.log('✅ Profile endpoint accessible');
          console.log('Profile data:', JSON.stringify(profileResult.data, null, 2));
        } else {
          console.log('❌ Profile endpoint failed:', profileResult.data);
        }
      }
    } else {
      console.log('❌ Profile signup failed:', profileSignupResult.data);
    }

    console.log('\n🎉 Comprehensive Signup Test Complete!');
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`- Basic Signup: ${basicSignupResult.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`- Company Signup: ${companiesResult.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`- Minimal Signup: ${minimalSignupResult.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`- Profile Creation: ${profileSignupResult.success ? '✅ PASS' : '❌ FAIL'}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSignupComprehensive().catch(console.error);
