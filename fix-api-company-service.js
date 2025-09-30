import { Client } from 'pg';

async function fixAPICompanyService() {
  console.log('🔧 Fixing API Company Service...');
  
  const client = new Client({
    connectionString: 'postgresql://shared_wealth_db_user:fQ36Pb3VRDUHD6UsiqmeLCNG0KLXtYSd@dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com/shared_wealth_db?sslmode=require'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check the actual columns in the companies table
    console.log('\n🔍 Checking actual companies table structure...');
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'companies' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Actual companies table columns:');
    columnsResult.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'}) ${col.column_default ? `default: ${col.column_default}` : ''}`);
    });

    // Check if status column exists
    const statusColumn = columnsResult.rows.find(col => col.column_name === 'status');
    const isActiveColumn = columnsResult.rows.find(col => col.column_name === 'is_active');
    const isVerifiedColumn = columnsResult.rows.find(col => col.column_name === 'is_verified');

    console.log('\n🔧 Database Schema Analysis:');
    console.log(`  - status column exists: ${!!statusColumn}`);
    console.log(`  - is_active column exists: ${!!isActiveColumn}`);
    console.log(`  - is_verified column exists: ${!!isVerifiedColumn}`);

    if (!statusColumn && isActiveColumn) {
      console.log('\n⚠️ Issue found: API expects "status" column but database has "is_active" column');
      console.log('🔧 Solution: Update API code to use is_active instead of status');
    }

    // Test the actual query that should work
    console.log('\n🧪 Testing correct query...');
    const testQuery = `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.industry,
        c.location,
        c.website,
        c.is_active,
        c.is_verified
      FROM companies c
      WHERE c.is_active = true
      ORDER BY c.created_at DESC
    `;
    
    const testResult = await client.query(testQuery);
    console.log(`✅ Correct query returns ${testResult.rows.length} companies`);
    
    if (testResult.rows.length > 0) {
      console.log('📊 Sample company data:');
      console.log(JSON.stringify(testResult.rows[0], null, 2));
    }

  } catch (error) {
    console.error('❌ Database analysis failed:', error.message);
  } finally {
    await client.end();
  }
}

fixAPICompanyService().catch(console.error);
