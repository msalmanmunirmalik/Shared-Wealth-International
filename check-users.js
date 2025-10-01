import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.VITE_API_URL || 'https://sharedwealth.net/api';

async function callApi(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

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

async function checkUsers() {
  console.log('👥 Checking available users...\n');

  // Try different common credentials
  const testCredentials = [
    { email: 'admin@sharedwealth.com', password: 'admin123' },
    { email: 'luis@ktalise.com', password: 'Sharedwealth123' },
    { email: 'stephen@carsis.consulting', password: 'Sharedwealth123' },
    { email: 'sam@consortiaco.io', password: 'Sharedwealth123' },
    { email: 'ken@africasgift.org', password: 'Sharedwealth123' }
  ];

  for (const creds of testCredentials) {
    console.log(`🔐 Testing: ${creds.email}`);
    const result = await callApi('/auth/signin', 'POST', creds);
    
    if (result.success && result.data.session && result.data.session.access_token) {
      console.log(`✅ Login successful for ${creds.email}`);
      
      // Test the user's companies and network
      const token = result.data.session.access_token;
      
      const userCompanies = await callApi('/companies/user', 'GET', null, token);
      const networkCompanies = await callApi('/networks/user', 'GET', null, token);
      const availableCompanies = await callApi('/networks/available', 'GET', null, token);
      
      console.log(`  📊 My Companies: ${userCompanies.success ? userCompanies.data.length : 'Error'}`);
      console.log(`  🌐 Network Companies: ${networkCompanies.success ? networkCompanies.data.length : 'Error'}`);
      console.log(`  📋 Available Companies: ${availableCompanies.success ? availableCompanies.data.length : 'Error'}`);
      
      return; // Found a working user
    } else {
      console.log(`❌ Login failed for ${creds.email}`);
    }
  }
  
  console.log('\n❌ No working credentials found');
}

checkUsers().catch(console.error);
