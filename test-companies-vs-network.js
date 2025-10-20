import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'https://sharedwealth.net/api';

async function testCompaniesVsNetwork() {
  console.log('🧪 Testing My Companies vs My Network...\n');

  try {
    // Sign in as Luis
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
    console.log('✅ Signed in as luis@ktalise.com\n');

    // Test My Companies
    console.log('🏢 MY COMPANIES (Companies user works for):');
    const myCompaniesResponse = await fetch(`${API_URL}/companies/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const myCompanies = await myCompaniesResponse.json();
    const companies = Array.isArray(myCompanies) ? myCompanies : myCompanies.data;
    
    console.log(`   Total: ${companies?.length || 0}`);
    if (companies && companies.length > 0) {
      companies.forEach((company, index) => {
        console.log(`   ${index + 1}. ${company.name} (${company.location})`);
        console.log(`      Position: ${company.position}`);
        console.log(`      Role: ${company.user_role}`);
      });
    } else {
      console.log('   (Empty - user has no employment relationships)');
    }

    // Test My Network
    console.log('\n🌐 MY NETWORK (Partner/collaboration companies):');
    const myNetworkResponse = await fetch(`${API_URL}/networks/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const myNetwork = await myNetworkResponse.json();
    const networkCompanies = myNetwork.data || [];
    
    console.log(`   Total: ${networkCompanies.length}`);
    if (networkCompanies.length > 0) {
      networkCompanies.forEach((company, index) => {
        console.log(`   ${index + 1}. ${company.name} (${company.location})`);
        console.log(`      Connection: ${company.connection_type}`);
        console.log(`      Added: ${new Date(company.added_at).toLocaleDateString()}`);
      });
    } else {
      console.log('   (Empty - user hasn\'t added network partners yet)');
    }

    // Test available companies to add to network
    console.log('\n📋 AVAILABLE COMPANIES (Can add to network):');
    const availableResponse = await fetch(`${API_URL}/networks/available`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const available = await availableResponse.json();
    const availableCompanies = available.data || [];
    
    console.log(`   Total: ${availableCompanies.length} companies available`);
    console.log('   Sample companies user can add to network:');
    availableCompanies.slice(0, 5).forEach((company, index) => {
      console.log(`   ${index + 1}. ${company.name} (${company.location})`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ FEATURE VERIFICATION');
    console.log('='.repeat(60));
    console.log(`My Companies Endpoint:  ${myCompaniesResponse.ok ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`My Network Endpoint:    ${myNetworkResponse.ok ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`Available Companies:    ${availableResponse.ok ? '✅ WORKING' : '❌ FAILED'}`);
    console.log('='.repeat(60));

    console.log('\n🎯 Summary:');
    console.log(`   - User works for: ${companies?.length || 0} companies (My Companies)`);
    console.log(`   - User networked with: ${networkCompanies.length} companies (My Network)`);
    console.log(`   - Can add to network: ${availableCompanies.length} companies`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCompaniesVsNetwork().catch(console.error);
