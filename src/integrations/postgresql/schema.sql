-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'superadmin');
CREATE TYPE company_size AS ENUM ('startup', 'small', 'medium', 'large');
CREATE TYPE company_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE user_company_role AS ENUM ('owner', 'admin', 'member');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    size company_size,
    location VARCHAR(255),
    website VARCHAR(255),
    logo VARCHAR(255),
    status company_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User-Company relationships
CREATE TABLE IF NOT EXISTS user_companies (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    role user_company_role DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, company_id)
);

-- Network connections
CREATE TABLE IF NOT EXISTS network_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    connected_company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    connection_strength INTEGER DEFAULT 0,
    shared_projects INTEGER DEFAULT 0,
    collaboration_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, connected_company_id)
);

-- Funding opportunities
CREATE TABLE IF NOT EXISTS funding_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    amount VARCHAR(100),
    deadline DATE,
    eligibility TEXT,
    url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Funding applications
CREATE TABLE IF NOT EXISTS funding_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funding_id UUID REFERENCES funding_opportunities(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    application_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Forum posts
CREATE TABLE IF NOT EXISTS forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),
    max_participants INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_network_connections_company_id ON network_connections(company_id);
CREATE INDEX IF NOT EXISTS idx_funding_applications_company_id ON funding_applications(company_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial super admin user
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@sharedwealth.com', '$2a$12$mock.hash.for.testing', 'superadmin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample companies
INSERT INTO companies (name, description, industry, size, location, status) VALUES
('Letstern Limited', 'Innovative technology solutions for sustainable development', 'Technology', 'medium', 'London, UK', 'approved')
ON CONFLICT (name) DO NOTHING;

-- Insert sample funding opportunities
INSERT INTO funding_opportunities (title, category, description, amount, deadline, eligibility, url) VALUES
('Building a Long-Term Africa Union (AU) and European Union (EU) Research and Innovation joint collaboration on Sustainable Renewable Energies', 'HORIZON-CL5-2025-02-D3-15', 'Sustainable renewable energy research collaboration between AU and EU', '€5,000,000', '2025-06-30', 'Research institutions, technology companies', 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl5-2025-02-d3-15'),
('Overcoming the barriers for scaling up circular water management in agriculture', 'HORIZON-CL6-2025-02-FARM2FORK-03', 'Circular water management solutions for agricultural sustainability', '€3,500,000', '2025-07-15', 'Agricultural companies, water management firms', 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl6-2025-02-farm2fork-03'),
('Developing a joint AU-EU Agricultural Knowledge and Innovation System (AKIS) supporting the Food and Nutrition Security and Sustainable Agriculture (FNSSA) partnership', 'HORIZON-CL6-2025-02-FARM2FORK-16', 'Agricultural knowledge and innovation system development', '€4,200,000', '2025-08-20', 'Agricultural research institutions, innovation hubs', 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl6-2025-02-farm2fork-16'),
('Culture, Creativity and Inclusive Society - 2025', 'HORIZON-CL2-2025-01', 'Cultural and creative sector development for inclusive society', '€2,800,000', '2025-09-10', 'Cultural organizations, creative enterprises', 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl2-2025-01'),
('Nutrition in emergency situations - Ready-to-use Supplementary Food (RUSF) and Ready-to-use Therapeutic Food (RUTF)', 'HORIZON-CL6-2025-02-FARM2FORK-17', 'Emergency nutrition solutions for crisis situations', '€3,000,000', '2025-07-30', 'Food companies, humanitarian organizations', 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl6-2025-02-farm2fork-17'),
('DIGITAL - HADEA', 'HORIZON-CL4-2025-04', 'Digital transformation and innovation in healthcare', '€6,500,000', '2025-10-15', 'Healthcare technology companies, digital health startups', 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-cl4-2025-04'),
('Preparatory action for setting up joint programmes among innovation ecosystems actors', 'HORIZON-EIE-2025-02-CONNECT-01', 'Innovation ecosystem development and collaboration', '€4,800,000', '2025-11-20', 'Innovation hubs, ecosystem coordinators', 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/horizon-eie-2025-02-connect-01')
ON CONFLICT (title) DO NOTHING;
