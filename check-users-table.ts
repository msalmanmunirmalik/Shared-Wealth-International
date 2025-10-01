import pool from './src/integrations/postgresql/config.js';

async function checkUsersTable() {
  try {
    console.log('🔍 Checking users table structure...');
    
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Users table columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check specifically for the new columns
    const newColumns = result.rows.filter(row => 
      ['bio', 'location', 'website', 'linkedin', 'twitter', 'profile_image'].includes(row.column_name)
    );
    
    console.log('\n📋 New profile columns:');
    if (newColumns.length === 0) {
      console.log('  ❌ No new profile columns found');
    } else {
      newColumns.forEach(row => {
        console.log(`  ✅ ${row.column_name}: ${row.data_type}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking users table:', error);
  } finally {
    await pool.end();
  }
}

checkUsersTable();
