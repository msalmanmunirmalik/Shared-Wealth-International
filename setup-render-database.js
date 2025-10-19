import { Client } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const renderDbConfig = {
  connectionString: 'postgres://shared_wealth_db_12z3_user:gRQOn1kMLRMFBTc6AS94nKKgoLX3VNey@dpg-d3qlu1mmcj7s73br039g-a.oregon-postgres.render.com:5432/shared_wealth_db_12z3',
  ssl: {
    rejectUnauthorized: false
  }
};

async function setupRenderDatabase() {
  console.log('🚀 Setting up Render PostgreSQL Database...\n');
  const client = new Client(renderDbConfig);

  try {
    await client.connect();
    console.log('✅ Connected to Render database\n');

    // Read and execute schema
    console.log('📋 Step 1: Creating database schema...');
    const schemaSQL = fs.readFileSync('database/schema.sql', 'utf8');
    await client.query(schemaSQL);
    console.log('✅ Schema created successfully\n');

    // Check if companies exist
    const companyCheck = await client.query('SELECT COUNT(*) as count FROM companies');
    const companyCount = parseInt(companyCheck.rows[0].count);
    
    if (companyCount === 0) {
      console.log('📋 Step 2: Populating database with sample data...');
      
      // Read the sample data file
      const sampleDataPath = 'database/sample_data.sql';
      if (fs.existsSync(sampleDataPath)) {
        const sampleDataSQL = fs.readFileSync(sampleDataPath, 'utf8');
        await client.query(sampleDataSQL);
        console.log('✅ Sample data inserted\n');
      } else {
        console.log('⚠️ Sample data file not found, skipping...\n');
      }
    } else {
      console.log(`ℹ️ Database already has ${companyCount} companies, skipping sample data\n`);
    }

    // Verify data
    console.log('🔍 Step 3: Verifying database setup...');
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
    const companiesResult = await client.query('SELECT COUNT(*) as count FROM companies');
    
    console.log(`✅ Users: ${usersResult.rows[0].count}`);
    console.log(`✅ Companies: ${companiesResult.rows[0].count}`);

    console.log('\n🎉 Render database setup complete!');
    console.log('\n📊 Database Info:');
    console.log('- Host: dpg-d3qlu1mmcj7s73br039g-a.oregon-postgres.render.com');
    console.log('- Database: shared_wealth_db_12z3');
    console.log('- User: shared_wealth_db_12z3_user');
    console.log('\n✅ Database is ready for use!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

setupRenderDatabase().catch(console.error);
