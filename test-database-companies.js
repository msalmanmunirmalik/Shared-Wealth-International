import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const renderDbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

async function testDatabaseCompanies() {
  console.log('🔍 Testing Database Companies Query...');
  const client = new Client(renderDbConfig);

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Test basic companies query
    console.log('\n📋 Testing basic companies query...');
    const basicQuery = 'SELECT COUNT(*) as total FROM companies';
    const basicResult = await client.query(basicQuery);
    console.log(`✅ Total companies in database: ${basicResult.rows[0].total}`);

    if (basicResult.rows[0].total > 0) {
      // Get first few companies
      const sampleQuery = 'SELECT id, name, is_active, status FROM companies LIMIT 5';
      const sampleResult = await client.query(sampleQuery);
      console.log('\n📋 Sample companies:');
      sampleResult.rows.forEach((company, index) => {
        console.log(`  ${index + 1}. ${company.name} (ID: ${company.id}, Active: ${company.is_active}, Status: ${company.status})`);
      });

      // Test the exact query used by NetworkService
      console.log('\n🔍 Testing NetworkService query...');
      const networkQuery = 'SELECT c.* FROM companies c ORDER BY c.name ASC';
      const networkResult = await client.query(networkQuery);
      console.log(`✅ NetworkService query result: ${networkResult.rows.length} companies`);

      if (networkResult.rows.length > 0) {
        console.log('First 3 companies from NetworkService query:');
        networkResult.rows.slice(0, 3).forEach((company, index) => {
          console.log(`  ${index + 1}. ${company.name} (ID: ${company.id})`);
        });
      }
    }

    // Test user_companies table
    console.log('\n👥 Testing user_companies table...');
    try {
      const userCompaniesQuery = 'SELECT COUNT(*) as total FROM user_companies';
      const userCompaniesResult = await client.query(userCompaniesQuery);
      console.log(`✅ Total user_companies records: ${userCompaniesResult.rows[0].total}`);
    } catch (error) {
      console.log('❌ user_companies table does not exist or has issues:', error.message);
    }

    // Test network_connections table
    console.log('\n🌐 Testing network_connections table...');
    try {
      const networkConnectionsQuery = 'SELECT COUNT(*) as total FROM network_connections';
      const networkConnectionsResult = await client.query(networkConnectionsQuery);
      console.log(`✅ Total network_connections records: ${networkConnectionsResult.rows[0].total}`);
    } catch (error) {
      console.log('❌ network_connections table does not exist or has issues:', error.message);
    }

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

testDatabaseCompanies().catch(console.error);
