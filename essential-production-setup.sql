-- Essential Production Database Setup
-- This script creates the minimum required tables for the Shared Wealth International platform

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
    countries TEXT[], -- Array of countries
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

-- Activity feed table
CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    related_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    related_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    related_content_id UUID,
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unified content table
CREATE TABLE IF NOT EXISTS unified_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('news', 'update', 'announcement', 'collaboration', 'post', 'article', 'event')),
    tags JSONB DEFAULT '[]'::jsonb,
    media_urls JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    reactions JSONB DEFAULT '{}'::jsonb,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funding opportunities table
CREATE TABLE IF NOT EXISTS funding_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    amount DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    application_deadline DATE,
    requirements TEXT,
    eligibility_criteria TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Funding applications table
CREATE TABLE IF NOT EXISTS funding_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES funding_opportunities(id) ON DELETE CASCADE,
    applicant_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    applicant_company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    project_title VARCHAR(255) NOT NULL,
    project_description TEXT NOT NULL,
    requested_amount DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    business_model TEXT,
    market_analysis TEXT,
    financial_projections JSONB DEFAULT '{}',
    team_information JSONB DEFAULT '{}',
    business_plan_url VARCHAR(500),
    financial_statements_url VARCHAR(500),
    pitch_deck_url VARCHAR(500),
    additional_documents JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'approved', 'rejected', 'withdrawn')),
    review_notes TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(100) DEFAULT 'collaboration' CHECK (project_type IN ('collaboration', 'research', 'development', 'partnership')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'cancelled', 'on_hold')),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    participants TEXT[],
    project_manager_id UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(100),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    location VARCHAR(255),
    organizer_id UUID REFERENCES users(id),
    company_id UUID REFERENCES companies(id),
    max_attendees INTEGER,
    registration_required BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'voice', 'system')),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File uploads table
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    file_type VARCHAR(50) CHECK (file_type IN ('document', 'image', 'video', 'audio', 'archive', 'other')),
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'logo', 'document', 'presentation', 'spreadsheet', 'pdf')),
    is_public BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin activity log table
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    description TEXT,
    changes JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a default admin user (password: admin123)
INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified) VALUES
('admin@sharedwealth.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'Admin', 'User', true, true)
ON CONFLICT (email) DO NOTHING;
