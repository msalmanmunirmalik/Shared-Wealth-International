#!/usr/bin/env node

/**
 * Deploy Essential Database Schema to Render PostgreSQL
 * This script creates the essential tables needed for the application to work
 */

import { Client } from 'pg';

// Render PostgreSQL connection details
const renderDbConfig = {
  host: 'dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com',
  port: 5432,
  database: 'shared_wealth_db',
  user: 'shared_wealth_db_user',
  password: process.env.RENDER_DB_PASSWORD || 'default_password',
  ssl: {
    rejectUnauthorized: false
  }
};

// Essential schema - just the core tables
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

async function deployEssentialSchema() {
  const client = new Client(renderDbConfig);
  
  try {
    console.log('🔌 Connecting to Render PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to Render PostgreSQL successfully');

    console.log('📋 Deploying essential database schema...');
    
    // Execute the essential schema
    await client.query(essentialSchema);
    
    console.log('✅ Essential schema deployed successfully');

    // Verify tables were created
    console.log('\n🔍 Verifying table creation...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log(`📋 Created tables (${tablesResult.rows.length}):`);
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n🎉 Essential database schema deployment completed successfully!');

  } catch (error) {
    console.error('❌ Failed to deploy essential schema:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the deployment
deployEssentialSchema().catch(console.error);
