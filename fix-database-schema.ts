import pool from './src/integrations/postgresql/config.js';

async function fixDatabaseSchema() {
  try {
    console.log('🔧 Fixing database schema...');
    
    // 1. Add missing columns to user_companies table
    console.log('\n📝 Adding missing columns to user_companies table...');
    
    const userCompaniesColumns = [
      'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
    ];
    
    for (const statement of userCompaniesColumns) {
      console.log(`  - ${statement}`);
      await pool.query(statement);
      console.log('    ✅ Success');
    }
    
    // 2. Create network_connections table
    console.log('\n📝 Creating network_connections table...');
    
    const createNetworkConnections = `
      CREATE TABLE IF NOT EXISTS network_connections (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        connection_type VARCHAR(50) DEFAULT 'member' CHECK (connection_type IN ('member', 'partner', 'supplier', 'customer')),
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, company_id)
      )
    `;
    
    console.log('  - Creating network_connections table...');
    await pool.query(createNetworkConnections);
    console.log('    ✅ Success');
    
    // 3. Fix companies table status column
    console.log('\n📝 Fixing companies table status column...');
    
    // First, check if the status column exists and what type it is
    const statusCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'companies' AND column_name = 'status'
    `);
    
    if (statusCheck.rows.length > 0) {
      const currentType = statusCheck.rows[0].data_type;
      console.log(`  - Current status column type: ${currentType}`);
      
      if (currentType === 'USER-DEFINED') {
        console.log('  - Converting status column from custom type to VARCHAR...');
        
        // Drop the custom type constraint and convert to VARCHAR
        await pool.query(`
          ALTER TABLE companies 
          ALTER COLUMN status TYPE VARCHAR(50) 
          USING status::text
        `);
        
        // Add the check constraint
        await pool.query(`
          ALTER TABLE companies 
          ADD CONSTRAINT companies_status_check 
          CHECK (status IN ('pending', 'approved', 'rejected'))
        `);
        
        console.log('    ✅ Status column converted to VARCHAR');
      } else {
        console.log('    ✅ Status column is already VARCHAR');
      }
    } else {
      console.log('  - Adding status column...');
      await pool.query(`
        ALTER TABLE companies 
        ADD COLUMN status VARCHAR(50) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected'))
      `);
      console.log('    ✅ Status column added');
    }
    
    // 4. Verify the fixes
    console.log('\n📊 Verifying fixes...');
    
    // Check user_companies table
    const userCompaniesCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user_companies' 
      AND column_name IN ('created_at', 'updated_at')
      ORDER BY column_name
    `);
    
    console.log('  - user_companies columns:');
    userCompaniesCheck.rows.forEach(row => {
      console.log(`    ✅ ${row.column_name}: ${row.data_type}`);
    });
    
    // Check network_connections table
    const networkConnectionsCheck = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_name = 'network_connections'
    `);
    
    if (networkConnectionsCheck.rows[0].count > 0) {
      console.log('  ✅ network_connections table exists');
    } else {
      console.log('  ❌ network_connections table still missing');
    }
    
    // Check companies status column
    const companiesStatusCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'companies' AND column_name = 'status'
    `);
    
    if (companiesStatusCheck.rows.length > 0) {
      console.log(`  ✅ companies.status: ${companiesStatusCheck.rows[0].data_type}`);
    } else {
      console.log('  ❌ companies.status column missing');
    }
    
    console.log('\n🎉 Database schema fixes completed!');
    
  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
  } finally {
    await pool.end();
  }
}

fixDatabaseSchema();
