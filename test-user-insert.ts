import pool from './src/integrations/postgresql/config.js';
import bcrypt from 'bcryptjs';

async function testUserInsert() {
  try {
    console.log('🔄 Testing user insert...');
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash('TestPassword123', saltRounds);
    
    // Test basic user insert
    const result = await pool.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name, last_name, role
    `, ['test.insert@example.com', passwordHash, 'Test', 'Insert', 'user']);
    
    console.log('✅ User inserted successfully:');
    console.log('  - ID:', result.rows[0].id);
    console.log('  - Email:', result.rows[0].email);
    console.log('  - Name:', result.rows[0].first_name, result.rows[0].last_name);
    console.log('  - Role:', result.rows[0].role);
    
    // Clean up
    await pool.query('DELETE FROM users WHERE email = $1', ['test.insert@example.com']);
    console.log('🧹 Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Error testing user insert:', error);
  } finally {
    await pool.end();
  }
}

testUserInsert();
