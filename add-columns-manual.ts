import pool from './src/integrations/postgresql/config.js';

async function addColumns() {
  try {
    console.log('🔄 Adding profile columns to users table...');
    
    const statements = [
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(200)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(500)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(500)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter VARCHAR(500)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500)'
    ];
    
    for (const statement of statements) {
      console.log(`📝 Executing: ${statement}`);
      await pool.query(statement);
      console.log('✅ Success');
    }
    
    console.log('🎉 All columns added successfully!');
    
    // Verify the columns were added
    const result = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('bio', 'location', 'website', 'linkedin', 'twitter', 'profile_image')
      ORDER BY column_name
    `);
    
    console.log('📊 Added columns:');
    result.rows.forEach(row => {
      console.log(`  ✅ ${row.column_name}: ${row.data_type}`);
    });
    
  } catch (error) {
    console.error('❌ Error adding columns:', error);
  } finally {
    await pool.end();
  }
}

addColumns();
