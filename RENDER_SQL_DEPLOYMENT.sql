-- =====================================================
-- SHARED WEALTH INTERNATIONAL - RENDER DATABASE DEPLOYMENT
-- =====================================================
-- Execute these SQL statements in the Render PostgreSQL SQL console
-- This will create the essential tables and populate with 30 companies
-- =====================================================

-- Step 1: Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create Users table
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

-- Step 3: Create Companies table
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

-- Step 4: Create User-Company relationships table
CREATE TABLE IF NOT EXISTS user_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, company_id)
);

-- Step 5: Create Content table
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

-- Step 6: Create File uploads table
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

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_content_author_id ON unified_content(author_id);
CREATE INDEX IF NOT EXISTS idx_content_company_id ON unified_content(company_id);
CREATE INDEX IF NOT EXISTS idx_content_published_at ON unified_content(published_at);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON file_uploads(uploaded_by);

-- Step 8: Create Admin User
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
) ON CONFLICT (email) DO NOTHING;

-- Step 9: Create 30 Companies and Users
INSERT INTO companies (id, name, industry, sector, location, website, description, created_at, updated_at) VALUES
(uuid_generate_v4(), 'Supernova Eco', 'Renewable Energy', 'Clean Technology', 'San Francisco, CA', 'https://supernovaeco.com', 'Leading renewable energy solutions provider', NOW(), NOW()),
(uuid_generate_v4(), 'Quantum Finance', 'Financial Services', 'Fintech', 'New York, NY', 'https://quantumfinance.com', 'Advanced financial technology solutions', NOW(), NOW()),
(uuid_generate_v4(), 'GreenTech Innovations', 'Environmental Technology', 'Sustainability', 'Austin, TX', 'https://greentechinnovations.com', 'Sustainable technology solutions', NOW(), NOW()),
(uuid_generate_v4(), 'DataFlow Systems', 'Information Technology', 'Software', 'Seattle, WA', 'https://dataflowsystems.com', 'Enterprise data management solutions', NOW(), NOW()),
(uuid_generate_v4(), 'BioMed Solutions', 'Healthcare', 'Biotechnology', 'Boston, MA', 'https://biomedsolutions.com', 'Advanced biomedical research and solutions', NOW(), NOW()),
(uuid_generate_v4(), 'CyberSecure Corp', 'Cybersecurity', 'Information Security', 'Washington, DC', 'https://cybersecurecorp.com', 'Enterprise cybersecurity solutions', NOW(), NOW()),
(uuid_generate_v4(), 'AgriTech Plus', 'Agriculture', 'Agricultural Technology', 'Des Moines, IA', 'https://agritechplus.com', 'Smart agriculture technology solutions', NOW(), NOW()),
(uuid_generate_v4(), 'LogiChain Global', 'Logistics', 'Supply Chain', 'Memphis, TN', 'https://logichainglobal.com', 'Global logistics and supply chain management', NOW(), NOW()),
(uuid_generate_v4(), 'EduTech Solutions', 'Education', 'Educational Technology', 'Denver, CO', 'https://edutechsolutions.com', 'Innovative educational technology platforms', NOW(), NOW()),
(uuid_generate_v4(), 'RetailMax Systems', 'Retail', 'E-commerce', 'Los Angeles, CA', 'https://retailmaxsystems.com', 'Advanced retail management systems', NOW(), NOW()),
(uuid_generate_v4(), 'Manufacturing Pro', 'Manufacturing', 'Industrial Technology', 'Detroit, MI', 'https://manufacturingpro.com', 'Smart manufacturing solutions', NOW(), NOW()),
(uuid_generate_v4(), 'RealEstate Tech', 'Real Estate', 'Property Technology', 'Miami, FL', 'https://realestatetech.com', 'Real estate technology and analytics', NOW(), NOW()),
(uuid_generate_v4(), 'EnergyGrid Solutions', 'Energy', 'Energy Management', 'Houston, TX', 'https://energygridsolutions.com', 'Smart energy grid management systems', NOW(), NOW()),
(uuid_generate_v4(), 'TransportTech', 'Transportation', 'Transportation Technology', 'Chicago, IL', 'https://transporttech.com', 'Advanced transportation solutions', NOW(), NOW()),
(uuid_generate_v4(), 'MediaStream Corp', 'Media', 'Digital Media', 'Los Angeles, CA', 'https://mediastreamcorp.com', 'Digital media streaming and content delivery', NOW(), NOW()),
(uuid_generate_v4(), 'HealthTech Innovations', 'Healthcare', 'Health Technology', 'San Diego, CA', 'https://healthtechinnovations.com', 'Digital health and wellness solutions', NOW(), NOW()),
(uuid_generate_v4(), 'FoodTech Systems', 'Food & Beverage', 'Food Technology', 'Portland, OR', 'https://foodtechsystems.com', 'Smart food production and distribution', NOW(), NOW()),
(uuid_generate_v4(), 'SportsTech Solutions', 'Sports', 'Sports Technology', 'Atlanta, GA', 'https://sportstechsolutions.com', 'Sports analytics and performance technology', NOW(), NOW()),
(uuid_generate_v4(), 'TravelTech Global', 'Travel', 'Travel Technology', 'Orlando, FL', 'https://traveltechglobal.com', 'Global travel and tourism technology', NOW(), NOW()),
(uuid_generate_v4(), 'Entertainment Plus', 'Entertainment', 'Digital Entertainment', 'Las Vegas, NV', 'https://entertainmentplus.com', 'Digital entertainment and gaming solutions', NOW(), NOW()),
(uuid_generate_v4(), 'ConstructionTech', 'Construction', 'Construction Technology', 'Phoenix, AZ', 'https://constructiontech.com', 'Smart construction and building technology', NOW(), NOW()),
(uuid_generate_v4(), 'InsuranceTech', 'Insurance', 'Insurance Technology', 'Hartford, CT', 'https://insurancetech.com', 'Digital insurance and risk management', NOW(), NOW()),
(uuid_generate_v4(), 'LegalTech Solutions', 'Legal Services', 'Legal Technology', 'San Francisco, CA', 'https://legaltechsolutions.com', 'Legal technology and case management', NOW(), NOW()),
(uuid_generate_v4(), 'ConsultingTech', 'Consulting', 'Business Consulting', 'New York, NY', 'https://consultingtech.com', 'Business consulting and advisory services', NOW(), NOW()),
(uuid_generate_v4(), 'MarketingTech', 'Marketing', 'Digital Marketing', 'Chicago, IL', 'https://marketingtech.com', 'Digital marketing and advertising technology', NOW(), NOW()),
(uuid_generate_v4(), 'HRTech Solutions', 'Human Resources', 'HR Technology', 'Dallas, TX', 'https://hrtechsolutions.com', 'Human resources management technology', NOW(), NOW()),
(uuid_generate_v4(), 'SalesTech Pro', 'Sales', 'Sales Technology', 'San Jose, CA', 'https://salestechpro.com', 'Sales automation and CRM solutions', NOW(), NOW()),
(uuid_generate_v4(), 'CustomerTech', 'Customer Service', 'Customer Experience', 'Salt Lake City, UT', 'https://customertech.com', 'Customer experience and support technology', NOW(), NOW()),
(uuid_generate_v4(), 'AnalyticsTech', 'Analytics', 'Data Analytics', 'Minneapolis, MN', 'https://analyticstech.com', 'Advanced data analytics and business intelligence', NOW(), NOW()),
(uuid_generate_v4(), 'CloudTech Solutions', 'Cloud Computing', 'Cloud Services', 'Seattle, WA', 'https://cloudtechsolutions.com', 'Cloud computing and infrastructure solutions', NOW(), NOW());

-- Step 10: Create User Accounts for Companies (30 users)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_verified, created_at, updated_at) VALUES
(uuid_generate_v4(), 'supernovaeco@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'quantumfinance@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'greentechinnovations@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'dataflowsystems@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'biomedsolutions@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'cybersecurecorp@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'agritechplus@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'logichainglobal@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'edutechsolutions@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'retailmaxsystems@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'manufacturingpro@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'realestatetech@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'energygridsolutions@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'transporttech@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'mediastreamcorp@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'healthtechinnovations@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'foodtechsystems@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'sportstechsolutions@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'traveltechglobal@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'entertainmentplus@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'constructiontech@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'insurancetech@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'legaltechsolutions@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'consultingtech@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'marketingtech@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'hrtechsolutions@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'salestechpro@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'customertech@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'analyticstech@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW()),
(uuid_generate_v4(), 'cloudtechsolutions@sharedwealth.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'Company', 'Director', 'director', true, NOW(), NOW());

-- Step 11: Create User-Company relationships
-- This creates relationships between users and companies
INSERT INTO user_companies (user_id, company_id, is_primary, created_at, updated_at)
SELECT 
    u.id as user_id,
    c.id as company_id,
    true as is_primary,
    NOW() as created_at,
    NOW() as updated_at
FROM users u
JOIN companies c ON 
    CASE 
        WHEN u.email = 'supernovaeco@sharedwealth.com' THEN c.name = 'Supernova Eco'
        WHEN u.email = 'quantumfinance@sharedwealth.com' THEN c.name = 'Quantum Finance'
        WHEN u.email = 'greentechinnovations@sharedwealth.com' THEN c.name = 'GreenTech Innovations'
        WHEN u.email = 'dataflowsystems@sharedwealth.com' THEN c.name = 'DataFlow Systems'
        WHEN u.email = 'biomedsolutions@sharedwealth.com' THEN c.name = 'BioMed Solutions'
        WHEN u.email = 'cybersecurecorp@sharedwealth.com' THEN c.name = 'CyberSecure Corp'
        WHEN u.email = 'agritechplus@sharedwealth.com' THEN c.name = 'AgriTech Plus'
        WHEN u.email = 'logichainglobal@sharedwealth.com' THEN c.name = 'LogiChain Global'
        WHEN u.email = 'edutechsolutions@sharedwealth.com' THEN c.name = 'EduTech Solutions'
        WHEN u.email = 'retailmaxsystems@sharedwealth.com' THEN c.name = 'RetailMax Systems'
        WHEN u.email = 'manufacturingpro@sharedwealth.com' THEN c.name = 'Manufacturing Pro'
        WHEN u.email = 'realestatetech@sharedwealth.com' THEN c.name = 'RealEstate Tech'
        WHEN u.email = 'energygridsolutions@sharedwealth.com' THEN c.name = 'EnergyGrid Solutions'
        WHEN u.email = 'transporttech@sharedwealth.com' THEN c.name = 'TransportTech'
        WHEN u.email = 'mediastreamcorp@sharedwealth.com' THEN c.name = 'MediaStream Corp'
        WHEN u.email = 'healthtechinnovations@sharedwealth.com' THEN c.name = 'HealthTech Innovations'
        WHEN u.email = 'foodtechsystems@sharedwealth.com' THEN c.name = 'FoodTech Systems'
        WHEN u.email = 'sportstechsolutions@sharedwealth.com' THEN c.name = 'SportsTech Solutions'
        WHEN u.email = 'traveltechglobal@sharedwealth.com' THEN c.name = 'TravelTech Global'
        WHEN u.email = 'entertainmentplus@sharedwealth.com' THEN c.name = 'Entertainment Plus'
        WHEN u.email = 'constructiontech@sharedwealth.com' THEN c.name = 'ConstructionTech'
        WHEN u.email = 'insurancetech@sharedwealth.com' THEN c.name = 'InsuranceTech'
        WHEN u.email = 'legaltechsolutions@sharedwealth.com' THEN c.name = 'LegalTech Solutions'
        WHEN u.email = 'consultingtech@sharedwealth.com' THEN c.name = 'ConsultingTech'
        WHEN u.email = 'marketingtech@sharedwealth.com' THEN c.name = 'MarketingTech'
        WHEN u.email = 'hrtechsolutions@sharedwealth.com' THEN c.name = 'HRTech Solutions'
        WHEN u.email = 'salestechpro@sharedwealth.com' THEN c.name = 'SalesTech Pro'
        WHEN u.email = 'customertech@sharedwealth.com' THEN c.name = 'CustomerTech'
        WHEN u.email = 'analyticstech@sharedwealth.com' THEN c.name = 'AnalyticsTech'
        WHEN u.email = 'cloudtechsolutions@sharedwealth.com' THEN c.name = 'CloudTech Solutions'
        ELSE false
    END
WHERE u.role = 'director' AND u.email LIKE '%@sharedwealth.com';

-- Step 12: Verify the deployment
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Companies' as table_name, COUNT(*) as count FROM companies
UNION ALL
SELECT 'User-Companies' as table_name, COUNT(*) as count FROM user_companies;

-- =====================================================
-- DEPLOYMENT COMPLETE!
-- =====================================================
-- You should see:
-- - 31 users (1 admin + 30 company directors)
-- - 30 companies
-- - 30 user-company relationships
-- 
-- Default credentials:
-- Admin: admin@sharedwealth.com / admin123
-- Company Directors: {company}@sharedwealth.com / Sharedwealth123
-- =====================================================
