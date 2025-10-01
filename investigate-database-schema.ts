import pool from './src/integrations/postgresql/config.js';

async function investigateDatabaseSchema() {
  try {
    console.log('🔍 Investigating database schema...');
    
    // Check all tables and their columns
    const tables = ['users', 'companies', 'user_companies', 'network_connections', 'activity_feed'];
    
    for (const table of tables) {
      console.log(`\n📊 Table: ${table}`);
      console.log('=' .repeat(50));
      
      try {
        const result = await pool.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = $1 
          ORDER BY ordinal_position
        `, [table]);
        
        if (result.rows.length === 0) {
          console.log(`❌ Table ${table} does not exist`);
        } else {
          result.rows.forEach(row => {
            console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default || 'none'})`);
          });
        }
      } catch (error) {
        console.log(`❌ Error checking table ${table}:`, error.message);
      }
    }
    
    // Check table constraints
    console.log('\n🔒 Table Constraints:');
    console.log('=' .repeat(50));
    
    for (const table of tables) {
      try {
        const constraints = await pool.query(`
          SELECT constraint_name, constraint_type, check_clause
          FROM information_schema.table_constraints tc
          LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
          WHERE tc.table_name = $1
        `, [table]);
        
        if (constraints.rows.length > 0) {
          console.log(`\n📋 ${table} constraints:`);
          constraints.rows.forEach(row => {
            console.log(`  - ${row.constraint_name}: ${row.constraint_type} ${row.check_clause || ''}`);
          });
        }
      } catch (error) {
        console.log(`❌ Error checking constraints for ${table}:`, error.message);
      }
    }
    
    // Check sample data
    console.log('\n📈 Sample Data Counts:');
    console.log('=' .repeat(50));
    
    for (const table of tables) {
      try {
        const count = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`  - ${table}: ${count.rows[0].count} records`);
      } catch (error) {
        console.log(`  - ${table}: Error - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error investigating database schema:', error);
  } finally {
    await pool.end();
  }
}

investigateDatabaseSchema();
