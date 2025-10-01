import pool from './src/integrations/postgresql/config.js';

async function addUserCompaniesColumns() {
  try {
    console.log('🔄 Adding missing columns to user_companies table...');
    
    const statements = [
      'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS position VARCHAR(100)',
      'ALTER TABLE user_companies ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT \'active\''
    ];
    
    for (const statement of statements) {
      console.log(`📝 Executing: ${statement}`);
      await pool.query(statement);
      console.log('✅ Success');
    }
    
    console.log('🎉 All columns added successfully!');
    
    // Verify the columns were added
    const result = await pool.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'user_companies' 
      AND column_name IN ('position', 'status')
      ORDER BY column_name
    `);
    
    console.log('📊 Added columns:');
    result.rows.forEach(row => {
      console.log(`  ✅ ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
    });
    
  } catch (error) {
    console.error('❌ Error adding columns:', error);
  } finally {
    await pool.end();
  }
}

addUserCompaniesColumns();
