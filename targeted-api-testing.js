import { Client } from 'pg';

async function targetedAPITesting() {
  console.log('🔧 Starting Targeted API Testing...');
  
  // Test database connection first
  console.log('\n💾 Testing Database Connection...');
  const client = new Client({
    connectionString: 'postgresql://shared_wealth_db_user:fQ36Pb3VRDUHD6UsiqmeLCNG0KLXtYSd@dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com/shared_wealth_db?sslmode=require'
  });

  try {
    await client.connect();
    console.log('✅ Database connection successful');

    // Test 1: Check users table
    console.log('\n👥 Testing Users Table...');
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Users table: ${usersResult.rows[0].count} users found`);

    // Test 2: Check companies table
    console.log('\n🏢 Testing Companies Table...');
    const companiesResult = await client.query('SELECT COUNT(*) as count FROM companies');
    console.log(`✅ Companies table: ${companiesResult.rows[0].count} companies found`);

    // Test 3: Check user_companies table
    console.log('\n🔗 Testing User-Companies Table...');
    const userCompaniesResult = await client.query('SELECT COUNT(*) as count FROM user_companies');
    console.log(`✅ User-companies table: ${userCompaniesResult.rows[0].count} relationships found`);

    // Test 4: Test specific API queries
    console.log('\n🔍 Testing Specific API Queries...');
    
    // Test getUserCompanies query
    const getUserCompaniesQuery = `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.industry,
        c.location,
        c.website,
        uc.is_primary
      FROM user_companies uc
      JOIN companies c ON uc.company_id = c.id
      WHERE uc.user_id = $1
    `;
    
    const testUserId = '8299f6b2-56e5-40bc-8c93-f43c8975fb8d'; // Luis Mauch's ID
    const userCompaniesQueryResult = await client.query(getUserCompaniesQuery, [testUserId]);
    console.log(`✅ getUserCompanies query: ${userCompaniesQueryResult.rows.length} companies found for user`);

    // Test getCompanies query
    const getCompaniesQuery = `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.industry,
        c.location,
        c.website,
        c.is_active
      FROM companies c
      WHERE c.is_active = true
      ORDER BY c.created_at DESC
    `;
    
    const companiesResult2 = await client.query(getCompaniesQuery);
    console.log(`✅ getCompanies query: ${companiesResult2.rows.length} active companies found`);

    // Test 5: Check for any database errors
    console.log('\n🚨 Checking for Database Issues...');
    
    // Check for missing foreign key relationships
    const orphanedUserCompanies = await client.query(`
      SELECT uc.id FROM user_companies uc 
      LEFT JOIN users u ON uc.user_id = u.id 
      WHERE u.id IS NULL
    `);
    
    if (orphanedUserCompanies.rows.length > 0) {
      console.log(`⚠️ Found ${orphanedUserCompanies.rows.length} orphaned user_companies records`);
    } else {
      console.log('✅ No orphaned user_companies records found');
    }

    const orphanedCompanies = await client.query(`
      SELECT uc.id FROM user_companies uc 
      LEFT JOIN companies c ON uc.company_id = c.id 
      WHERE c.id IS NULL
    `);
    
    if (orphanedCompanies.rows.length > 0) {
      console.log(`⚠️ Found ${orphanedCompanies.rows.length} orphaned company references`);
    } else {
      console.log('✅ No orphaned company references found');
    }

    await client.end();

  } catch (error) {
    console.error('❌ Database testing failed:', error.message);
  }

  // Test 6: Test API endpoints directly
  console.log('\n🌐 Testing API Endpoints...');
  
  const testCases = [
    {
      name: 'Health Check',
      url: 'https://sharedwealth.net/api/health',
      method: 'GET'
    },
    {
      name: 'Get Companies',
      url: 'https://sharedwealth.net/api/companies',
      method: 'GET'
    },
    {
      name: 'Get User Companies',
      url: 'https://sharedwealth.net/api/companies/user',
      method: 'GET',
      headers: { 'Authorization': 'Bearer test-token' }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`  Testing ${testCase.name}...`);
      
      const response = await fetch(testCase.url, {
        method: testCase.method,
        headers: testCase.headers || {}
      });
      
      const result = await response.text();
      
      if (response.ok) {
        console.log(`    ✅ ${testCase.name}: ${response.status} - Success`);
        try {
          const jsonResult = JSON.parse(result);
          console.log(`    📊 Response data: ${JSON.stringify(jsonResult).substring(0, 100)}...`);
        } catch (e) {
          console.log(`    📄 Response text: ${result.substring(0, 100)}...`);
        }
      } else {
        console.log(`    ❌ ${testCase.name}: ${response.status} - ${result}`);
      }
    } catch (error) {
      console.log(`    ❌ ${testCase.name}: Error - ${error.message}`);
    }
  }

  // Test 7: Test authentication flow
  console.log('\n🔐 Testing Authentication Flow...');
  
  try {
    // Test login
    const loginResponse = await fetch('https://sharedwealth.net/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'luis@ktalise.com',
        password: 'Sharedwealth123'
      })
    });

    const loginResult = await loginResponse.json();
    
    if (loginResponse.ok && loginResult.session?.access_token) {
      console.log('✅ Login successful');
      
      // Test authenticated endpoint
      const userCompaniesResponse = await fetch('https://sharedwealth.net/api/companies/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginResult.session.access_token}`
        }
      });

      const userCompaniesResult = await userCompaniesResponse.json();
      
      if (userCompaniesResponse.ok) {
        console.log('✅ Authenticated API call successful');
        console.log(`📊 User companies data: ${JSON.stringify(userCompaniesResult).substring(0, 200)}...`);
      } else {
        console.log(`❌ Authenticated API call failed: ${userCompaniesResponse.status} - ${JSON.stringify(userCompaniesResult)}`);
      }
    } else {
      console.log(`❌ Login failed: ${JSON.stringify(loginResult)}`);
    }
  } catch (error) {
    console.log(`❌ Authentication testing failed: ${error.message}`);
  }

  console.log('\n🎉 Targeted API Testing Complete!');
}

targetedAPITesting().catch(console.error);
