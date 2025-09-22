-- Manual Database Setup for Production
-- Execute these statements directly in the Render PostgreSQL database

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
