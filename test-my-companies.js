import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'https://sharedwealth.net/api';

async function testMyCompanies() {
  console.log('🧪 Testing My Companies Feature...\n');

  try {
    // Sign in as luis
    console.log('🔐 Step 1: Signing in as luis@ktalise.com...');
    const signinResponse = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'luis@ktalise.com',
        password: 'Sharedwealth123'
      })
    });

    const signinData = await signinResponse.json();
    const token = signinData.session.access_token;
    console.log('✅ Signed in successfully\n');

    // Get user companies
    console.log('🏢 Step 2: Fetching My Companies...');
    const companiesResponse = await fetch(`${API_URL}/companies/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const companiesData = await companiesResponse.json();
    console.log('Response:', JSON.stringify(companiesData, null, 2));

    if (companiesData.success !== false && (Array.isArray(companiesData) || companiesData.data)) {
      const companies = Array.isArray(companiesData) ? companiesData : companiesData.data;
      console.log(`\n✅ User has ${companies.length} companies in "My Companies":\n`);
      companies.forEach((company, index) => {
        console.log(`   ${index + 1}. ${company.name} (${company.location || 'N/A'})`);
        console.log(`      Position: ${company.position || 'N/A'}`);
        console.log(`      Primary: ${company.is_primary || false}`);
      });
    } else {
      console.log('⚠️  No companies found or error:', companiesData.message);
    }

    // Test for another user
    console.log('\n🧪 Testing for stephen@carsis.consulting...');
    const signin2 = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'stephen@carsis.consulting',
        password: 'Sharedwealth123'
      })
    });

    const signin2Data = await signin2.json();
    const token2 = signin2Data.session.access_token;

    const companies2 = await fetch(`${API_URL}/companies/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token2}`,
        'Content-Type': 'application/json'
      }
    });

    const companies2Data = await companies2.json();
    const userCompanies = Array.isArray(companies2Data) ? companies2Data : companies2Data.data;
    console.log(`✅ Stephen has ${userCompanies?.length || 0} companies`);

    console.log('\n🎉 My Companies test complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMyCompanies().catch(console.error);
