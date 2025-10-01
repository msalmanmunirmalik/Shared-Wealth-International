import pool from './src/integrations/postgresql/config.js';

async function checkRoleColumn() {
  try {
    console.log('🔍 Checking role column in users table...');
    
    const result = await pool.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'role'
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ Role column not found in users table');
    } else {
      const roleColumn = result.rows[0];
      console.log('📊 Role column details:');
      console.log(`  - Type: ${roleColumn.data_type}`);
      console.log(`  - Default: ${roleColumn.column_default}`);
      console.log(`  - Nullable: ${roleColumn.is_nullable}`);
    }
    
    // Check if there are any constraints on the role column
    const constraints = await pool.query(`
      SELECT constraint_name, constraint_type, check_clause
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
      WHERE tc.table_name = 'users' 
      AND tc.constraint_type = 'CHECK'
    `);
    
    console.log('\n📋 Constraints on users table:');
    constraints.rows.forEach(row => {
      console.log(`  - ${row.constraint_name}: ${row.check_clause}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking role column:', error);
  } finally {
    await pool.end();
  }
}

checkRoleColumn();
