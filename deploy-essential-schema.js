import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function deployEssentialSchema() {
  try {
    console.log('🔌 Connecting to production database...');
    await client.connect();
    console.log('✅ Connected to production database successfully');

    console.log('🏗️ Deploying essential database schema...');

    // Create companies table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        industry VARCHAR(100),
        sector VARCHAR(100),
        size VARCHAR(50) CHECK (size IN ('startup', 'small', 'medium', 'large')),
        location VARCHAR(255),
        website VARCHAR(255),
        logo_url VARCHAR(500),
        logo_file_path VARCHAR(500),
        countries TEXT[],
        employees INTEGER,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        is_shared_wealth_licensed BOOLEAN DEFAULT false,
        license_number VARCHAR(100),
        license_date DATE,
        applicant_role VARCHAR(100),
        applicant_position VARCHAR(100),
        applicant_user_id UUID REFERENCES users(id),
        created_by_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Companies table created/verified');

    // Create user_companies table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'director')),
        position VARCHAR(100),
        is_primary BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, company_id)
      );
    `);
    console.log('✅ User companies table created/verified');

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
      CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
      CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);
    `);
    console.log('✅ Database indexes created/verified');

    console.log('\n🎉 Essential database schema deployed successfully!');

  } catch (error) {
    console.error('❌ Failed to deploy schema:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

deployEssentialSchema().catch(console.error);
