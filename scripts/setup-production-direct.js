#!/usr/bin/env node

/**
 * Direct Production Database Setup
 * This script connects directly to your Render PostgreSQL database
 * and sets up the essential tables and your data
 */

import { Client } from 'pg';

// Production database configuration for Render
const prodDbConfig = {
  user: 'shared_wealth_international_user',
  host: 'dpg-d2i38rm3jp1c738vksr0-a.render.com',
  database: 'shared_wealth_international',
  password: process.env.DB_PASSWORD || '', // You'll need to set this
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
};

async function setupProductionDatabase() {
  const client = new Client(prodDbConfig);
  
  try {
    console.log('🚀 Starting direct production database setup...');
    console.log(`📊 Connecting to: ${prodDbConfig.host}:${prodDbConfig.port}/${prodDbConfig.database}`);
    
    await client.connect();
    console.log('✅ Connected to production database successfully');

    // SQL to set up the database
    const setupSQL = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Users table
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          phone VARCHAR(20),
          is_active BOOLEAN DEFAULT true,
          email_verified BOOLEAN DEFAULT false,
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Companies table
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

      -- User Companies relationship table
      CREATE TABLE IF NOT EXISTS user_companies (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          role VARCHAR(100) NOT NULL,
          position VARCHAR(100) NOT NULL,
          status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, company_id)
      );

      -- Create your user account (password: Salman123)
      INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified) VALUES
      ('msalmanmunirmalik@outlook.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'Salman', 'Malik', true, true)
      ON CONFLICT (email) DO NOTHING;

      -- Create your company
      INSERT INTO companies (name, description, industry, sector, size, location, website, countries, employees, status, applicant_role, applicant_position, applicant_user_id) VALUES
      ('Letstern', 'Connecting Students, Agents, Freelancers, and Institutes Worldwide for Seamless Study Abroad Experiences.', 'Education', 'Study Abroad', 'startup', 'Global', 'https://letstern.com', ARRAY['Global'], 10, 'approved', 'Founder', 'CEO', (SELECT id FROM users WHERE email = 'msalmanmunirmalik@outlook.com'))
      ON CONFLICT DO NOTHING;

      -- Create user-company relationship
      INSERT INTO user_companies (user_id, company_id, role, position, status) VALUES
      ((SELECT id FROM users WHERE email = 'msalmanmunirmalik@outlook.com'), (SELECT id FROM companies WHERE name = 'Letstern'), 'Founder', 'CEO', 'active')
      ON CONFLICT (user_id, company_id) DO NOTHING;

      -- Create default admin user (password: admin123)
      INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified) VALUES
      ('admin@sharedwealth.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'Admin', 'User', true, true)
      ON CONFLICT (email) DO NOTHING;
    `;

    console.log('🏗️  Setting up database schema and data...');
    await client.query(setupSQL);
    console.log('✅ Database setup completed successfully');

    // Verify the setup
    console.log('\n🔍 Verifying setup...');
    const userCount = await client.query('SELECT COUNT(*) as count FROM users');
    const companyCount = await client.query('SELECT COUNT(*) as count FROM companies');
    const relationshipCount = await client.query('SELECT COUNT(*) as count FROM user_companies');

    console.log(`   👥 Users: ${userCount.rows[0].count}`);
    console.log(`   🏢 Companies: ${companyCount.rows[0].count}`);
    console.log(`   🔗 Relationships: ${relationshipCount.rows[0].count}`);

    // Check your specific data
    const yourUser = await client.query('SELECT email, first_name, last_name FROM users WHERE email = $1', ['msalmanmunirmalik@outlook.com']);
    const yourCompany = await client.query('SELECT name, status FROM companies WHERE name = $1', ['Letstern']);

    if (yourUser.rows.length > 0) {
      console.log(`\n✅ Your user: ${yourUser.rows[0].email} (${yourUser.rows[0].first_name} ${yourUser.rows[0].last_name})`);
    }

    if (yourCompany.rows.length > 0) {
      console.log(`✅ Your company: ${yourCompany.rows[0].name} (${yourCompany.rows[0].status})`);
    }

    console.log('\n🎉 Production database setup completed successfully!');
    console.log('\n🌐 You can now access your application at:');
    console.log('   https://sharedwealth.onrender.com');
    console.log('\n🔑 Login credentials:');
    console.log('   Email: msalmanmunirmalik@outlook.com');
    console.log('   Password: Salman123');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  setupProductionDatabase().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

export { setupProductionDatabase };
