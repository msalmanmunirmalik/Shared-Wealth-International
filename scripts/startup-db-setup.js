#!/usr/bin/env node

/**
 * Database Setup on Render Service Startup
 * This script runs the database schema deployment when the service starts
 */

import { Client } from 'pg';

// Use environment variables available on Render service
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log('⚠️ DATABASE_URL not found, skipping database setup');
  process.exit(0);
}

console.log('🔌 Setting up database schema on Render service startup...');

// Essential schema
const essentialSchema = `
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (essential)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin', 'moderator', 'director')),
    
    -- Personal Information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    bio TEXT,
    location VARCHAR(255),
    
    -- Account Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table (essential)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    sector VARCHAR(100),
    location VARCHAR(255),
    website VARCHAR(500),
    description TEXT,
    logo_url VARCHAR(500),
    
    -- Company Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Company relationships
CREATE TABLE IF NOT EXISTS user_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, company_id)
);

-- Content table (essential)
CREATE TABLE IF NOT EXISTS unified_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    content_type VARCHAR(50) DEFAULT 'post',
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_content_author_id ON unified_content(author_id);
CREATE INDEX IF NOT EXISTS idx_content_company_id ON unified_content(company_id);
CREATE INDEX IF NOT EXISTS idx_content_published_at ON unified_content(published_at);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON file_uploads(uploaded_by);
`;

async function setupDatabase() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.log('🔌 Connecting to Render PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to Render PostgreSQL successfully');

    console.log('📋 Deploying essential database schema...');
    
    // Execute the essential schema
    await client.query(essentialSchema);
    
    console.log('✅ Essential schema deployed successfully');

    // Check if we have any data
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    const companiesCount = await client.query('SELECT COUNT(*) FROM companies');
    
    console.log(`📊 Current data:`);
    console.log(`   👤 Users: ${usersCount.rows[0].count}`);
    console.log(`   🏢 Companies: ${companiesCount.rows[0].count}`);

    // If no data, populate with sample data
    if (usersCount.rows[0].count === '0' && companiesCount.rows[0].count === '0') {
      console.log('📦 Populating database with sample data...');
      
      // Create admin user
      await client.query(`
        INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_verified, created_at, updated_at)
        VALUES (
          uuid_generate_v4(),
          'admin@sharedwealth.com',
          '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA',
          'Admin',
          'User',
          'admin',
          true,
          NOW(),
          NOW()
        ) ON CONFLICT (email) DO NOTHING
      `);

      // Create sample companies
      const companies = [
        { name: 'Supernova Eco', industry: 'Renewable Energy', sector: 'Clean Technology', location: 'San Francisco, CA' },
        { name: 'Quantum Finance', industry: 'Financial Services', sector: 'Fintech', location: 'New York, NY' },
        { name: 'GreenTech Innovations', industry: 'Environmental Technology', sector: 'Sustainability', location: 'Austin, TX' },
        { name: 'DataFlow Systems', industry: 'Information Technology', sector: 'Software', location: 'Seattle, WA' },
        { name: 'BioMed Solutions', industry: 'Healthcare', sector: 'Biotechnology', location: 'Boston, MA' }
      ];

      for (const company of companies) {
        await client.query(`
          INSERT INTO companies (id, name, industry, sector, location, created_at, updated_at)
          VALUES (uuid_generate_v4(), $1, $2, $3, $4, NOW(), NOW())
          ON CONFLICT (name) DO NOTHING
        `, [company.name, company.industry, company.sector, company.location]);
      }

      console.log('✅ Sample data populated successfully');
    }

    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Failed to setup database:', error.message);
    // Don't exit with error, just log it
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the setup
setupDatabase().catch(console.error);
