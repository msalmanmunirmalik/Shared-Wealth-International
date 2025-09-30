-- Shared Wealth International Database Setup
-- Run this script in your PostgreSQL database

-- Create database (run as postgres user)
-- CREATE DATABASE sharedwealth;

-- Create user (run as postgres user)
-- CREATE USER sharedwealth WITH PASSWORD 'your-secure-password';
-- GRANT ALL PRIVILEGES ON DATABASE sharedwealth TO sharedwealth;

-- Connect to sharedwealth database and run the following:

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin', 'director')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    company_name VARCHAR(255),
    position VARCHAR(100),
    location VARCHAR(255),
    linkedin VARCHAR(255),
    twitter VARCHAR(255),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    location VARCHAR(255),
    website VARCHAR(255),
    countries TEXT[],
    status VARCHAR(50) DEFAULT 'pending',
    applicant_user_id UUID REFERENCES users(id),
    created_by_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_companies relationship table
CREATE TABLE IF NOT EXISTS user_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    role VARCHAR(100),
    position VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, company_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);

-- Insert default admin user (password: Admin123!)
INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified) 
VALUES ('admin@sharedwealth.net', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4Y/7yQxK2S', 'superadmin', 'Admin', 'User', true, true)
ON CONFLICT (email) DO NOTHING;

COMMIT;
