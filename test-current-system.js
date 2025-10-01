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
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testCurrentSystem() {
  console.log('🧪 Testing Current System (My Companies Fix)...\n');

  try {
    // Login
    console.log('🔐 Authentication');
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

    // Test My Companies (should only show companies this user owns/created)
    console.log('\n🏢 Test: My Companies (User-owned companies)');
    const userCompaniesResult = await callApi('/companies/user', 'GET', null, token);
    
    if (userCompaniesResult.success) {
      console.log(`✅ My Companies: ${userCompaniesResult.data.length} companies found`);
      userCompaniesResult.data.forEach((company, index) => {
        console.log(`  ${index + 1}. ${company.name} (${company.sector || 'N/A'}) - Created: ${company.created_at}`);
      });
    } else {
      console.log('❌ Failed to get user companies:', userCompaniesResult.error || userCompaniesResult.data);
    }

    // Test All Companies (for comparison)
    console.log('\n🌐 Test: All Companies (for comparison)');
    const allCompaniesResult = await callApi('/companies', 'GET');
    
    if (allCompaniesResult.success) {
      console.log(`✅ All Companies: ${allCompaniesResult.data.length} companies found`);
      console.log('First 5 companies:');
      allCompaniesResult.data.slice(0, 5).forEach((company, index) => {
        console.log(`  ${index + 1}. ${company.name} (${company.sector || 'N/A'}) - Created: ${company.created_at}`);
      });
    } else {
      console.log('❌ Failed to get all companies');
    }

    // Compare the results
    console.log('\n📊 Comparison:');
    if (userCompaniesResult.success && allCompaniesResult.success) {
      const userCompanyCount = userCompaniesResult.data.length;
      const allCompanyCount = allCompaniesResult.data.length;
      
      console.log(`- My Companies: ${userCompanyCount}`);
      console.log(`- All Companies: ${allCompanyCount}`);
      console.log(`- Difference: ${allCompanyCount - userCompanyCount} companies not owned by this user`);
      
      if (userCompanyCount < allCompanyCount) {
        console.log('✅ SUCCESS: My Companies is properly filtered to only show user-owned companies');
      } else if (userCompanyCount === allCompanyCount) {
        console.log('⚠️ WARNING: My Companies shows all companies (not properly filtered)');
      } else {
        console.log('❌ ERROR: My Companies shows more companies than total (impossible)');
      }
    }

    // Test with different user to verify filtering
    console.log('\n👥 Test: Different User');
    const login2Result = await callApi('/auth/signin', 'POST', {
      email: 'stephen@carsis.consulting',
      password: 'Sharedwealth123'
    });

    if (login2Result.success && login2Result.data.session?.access_token) {
      const token2 = login2Result.data.session.access_token;
      const user2CompaniesResult = await callApi('/companies/user', 'GET', null, token2);
      
      if (user2CompaniesResult.success) {
        console.log(`✅ Stephen's Companies: ${user2CompaniesResult.data.length} companies found`);
        user2CompaniesResult.data.forEach((company, index) => {
          console.log(`  ${index + 1}. ${company.name} (${company.sector || 'N/A'})`);
        });
      }
    } else {
      console.log('⚠️ Could not test with second user');
    }

    console.log('\n🎉 Current System Test Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCurrentSystem().catch(console.error);
