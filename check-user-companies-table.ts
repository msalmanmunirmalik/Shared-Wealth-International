import pool from './src/integrations/postgresql/config.js';

async function checkUserCompaniesTable() {
  try {
    console.log('🔍 Checking user_companies table structure...');
    
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'user_companies' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 user_companies table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking user_companies table:', error);
  } finally {
    await pool.end();
  }
}

checkUserCompaniesTable();
