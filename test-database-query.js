import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const renderDbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: true
};

async function testDatabaseQuery() {
  console.log('🔍 Testing Database Query for getUserCompanies...\n');

  const client = new Client(renderDbConfig);

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Test the exact query from getUserCompanies
    const testUserId = '8299f6b2-56e5-40bc-8c93-f43c8975fb8d'; // Luis Mauch's ID
    console.log(`Testing with user ID: ${testUserId}`);

    // Check if user_companies table exists and has data
    console.log('\n📊 Checking user_companies table...');
    const userCompaniesCheck = await client.query('SELECT COUNT(*) FROM user_companies');
    console.log(`user_companies table has ${userCompaniesCheck.rows[0].count} records`);

    // Check if companies table exists and has data
    console.log('\n🏢 Checking companies table...');
    const companiesCheck = await client.query('SELECT COUNT(*) FROM companies');
    console.log(`companies table has ${companiesCheck.rows[0].count} records`);

    // Test the exact query from getUserCompanies
    console.log('\n🔍 Testing getUserCompanies query...');
    const getUserCompaniesQuery = `
      SELECT c.*, uc.is_primary
      FROM companies c
      INNER JOIN user_companies uc ON c.id = uc.company_id
      WHERE uc.user_id = $1 AND uc.status = 'active'
      ORDER BY c.created_at DESC
    `;

    try {
      const result = await client.query(getUserCompaniesQuery, [testUserId]);
      console.log(`✅ Query executed successfully, found ${result.rows.length} companies`);
      
      if (result.rows.length > 0) {
        console.log('Companies found:');
        result.rows.forEach((company, index) => {
          console.log(`  ${index + 1}. ${company.name} (${company.sector || 'N/A'})`);
        });
      } else {
        console.log('⚠️ No companies found for this user');
        
        // Check if user exists in user_companies at all
        const userExists = await client.query('SELECT * FROM user_companies WHERE user_id = $1', [testUserId]);
        console.log(`User exists in user_companies: ${userExists.rows.length > 0}`);
        
        if (userExists.rows.length > 0) {
          console.log('User_companies records:');
          userExists.rows.forEach(record => {
            console.log(`  User ID: ${record.user_id}, Company ID: ${record.company_id}, Status: ${record.status}`);
          });
        }
      }
    } catch (queryError) {
      console.error('❌ Query failed:', queryError.message);
      console.error('Full error:', queryError);
    }

    // Test a simpler query without the status filter
    console.log('\n🔍 Testing simpler query without status filter...');
    const simpleQuery = `
      SELECT c.*, uc.is_primary
      FROM companies c
      INNER JOIN user_companies uc ON c.id = uc.company_id
      WHERE uc.user_id = $1
      ORDER BY c.created_at DESC
    `;

    try {
      const simpleResult = await client.query(simpleQuery, [testUserId]);
      console.log(`✅ Simple query executed successfully, found ${simpleResult.rows.length} companies`);
    } catch (simpleError) {
      console.error('❌ Simple query failed:', simpleError.message);
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

testDatabaseQuery().catch(console.error);
