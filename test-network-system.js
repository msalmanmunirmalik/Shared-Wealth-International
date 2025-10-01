import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.VITE_API_URL || 'https://sharedwealth.net/api';
const TEST_EMAIL = 'admin@sharedwealth.com';
const TEST_PASSWORD = 'admin123';

const renderDbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
};

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  return response.json();
}

async function testNetworkSystem() {
  console.log('🧪 Testing New Network System...\n');

  const client = new Client(renderDbConfig);

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Test 1: Login to get token
    console.log('\n🔐 Test 1: User Authentication');
    const loginResult = await callApi('/auth/signin', 'POST', {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    let token = null;
    if (loginResult.session && loginResult.session.access_token) {
      token = loginResult.session.access_token;
      console.log('✅ Login successful');
    } else {
      console.error('❌ Login failed:', loginResult.message);
      return;
    }

    // Test 2: Check current user companies (My Companies)
    console.log('\n🏢 Test 2: My Companies (User-owned companies)');
    const userCompanies = await callApi('/companies/user', 'GET', null, token);
    console.log(`✅ User companies: ${userCompanies.length} companies found`);
    userCompanies.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.name} (${company.sector})`);
    });

    // Test 3: Check current network companies
    console.log('\n🌐 Test 3: Current Network Companies');
    const currentNetwork = await callApi('/networks/user', 'GET', null, token);
    console.log(`✅ Current network: ${currentNetwork.length} companies`);
    currentNetwork.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.name} (${company.connection_type})`);
    });

    // Test 4: Get available companies to add to network
    console.log('\n📋 Test 4: Available Companies to Add');
    const availableCompanies = await callApi('/networks/available', 'GET', null, token);
    console.log(`✅ Available companies: ${availableCompanies.length} companies`);
    availableCompanies.slice(0, 5).forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.name} (${company.sector})`);
    });

    // Test 5: Add a company to network (if available)
    if (availableCompanies.length > 0) {
      console.log('\n➕ Test 5: Adding Company to Network');
      const companyToAdd = availableCompanies[0];
      console.log(`Adding ${companyToAdd.name} to network...`);
      
      const addResult = await callApi('/networks/add', 'POST', {
        company_id: companyToAdd.id,
        connection_type: 'partner',
        notes: 'Test connection'
      }, token);

      if (addResult.success !== false) {
        console.log('✅ Company added to network successfully');
        
        // Test 6: Verify company was added
        console.log('\n🔍 Test 6: Verify Network Update');
        const updatedNetwork = await callApi('/networks/user', 'GET', null, token);
        console.log(`✅ Updated network: ${updatedNetwork.length} companies`);
        
        const addedCompany = updatedNetwork.find(c => c.id === companyToAdd.id);
        if (addedCompany) {
          console.log(`✅ Found added company: ${addedCompany.name} (${addedCompany.connection_type})`);
        } else {
          console.log('❌ Added company not found in network');
        }

        // Test 7: Remove company from network
        console.log('\n➖ Test 7: Removing Company from Network');
        const removeResult = await callApi('/networks/remove', 'DELETE', {
          company_id: companyToAdd.id
        }, token);

        if (removeResult.success !== false) {
          console.log('✅ Company removed from network successfully');
          
          // Verify removal
          const finalNetwork = await callApi('/networks/user', 'GET', null, token);
          console.log(`✅ Final network: ${finalNetwork.length} companies`);
          
          const removedCompany = finalNetwork.find(c => c.id === companyToAdd.id);
          if (!removedCompany) {
            console.log('✅ Company successfully removed from network');
          } else {
            console.log('❌ Company still found in network after removal');
          }
        } else {
          console.log('❌ Failed to remove company from network');
        }
      } else {
        console.log('❌ Failed to add company to network');
      }
    } else {
      console.log('⚠️ No available companies to test with');
    }

    // Test 8: Database verification
    console.log('\n💾 Test 8: Database Verification');
    
    // Check network_connections table
    const networkConnections = await client.query('SELECT COUNT(*) FROM network_connections');
    console.log(`✅ network_connections table: ${networkConnections.rows[0].count} connections`);
    
    // Check user_companies table
    const userCompaniesCount = await client.query('SELECT COUNT(*) FROM user_companies');
    console.log(`✅ user_companies table: ${userCompaniesCount.rows[0].count} relationships`);
    
    // Check companies table
    const companiesCount = await client.query('SELECT COUNT(*) FROM companies');
    console.log(`✅ companies table: ${companiesCount.rows[0].count} companies`);

    console.log('\n🎉 Network System Test Complete!');
    console.log('\n📊 Summary:');
    console.log(`- My Companies: ${userCompanies.length} companies`);
    console.log(`- Network Companies: ${currentNetwork.length} companies`);
    console.log(`- Available Companies: ${availableCompanies.length} companies`);
    console.log(`- Database Connections: ${networkConnections.rows[0].count} connections`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

testNetworkSystem().catch(console.error);
