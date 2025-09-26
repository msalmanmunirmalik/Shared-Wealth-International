-- =====================================================
-- SHARED WEALTH INTERNATIONAL - COMPREHENSIVE SCHEMA
-- =====================================================
-- This schema supports all features of the platform:
-- - User & Company Management
-- - Social Features & Networking
-- - Content Management & News
-- - Funding Platform
-- - Collaboration Tools
-- - Business Analytics
-- - Admin Dashboard
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For composite indexes

-- =====================================================
-- CORE USER MANAGEMENT
-- =====================================================

-- Users table (enhanced)
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
    timezone VARCHAR(50),
    
    -- Account Status
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    
    -- Preferences
    notification_preferences JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    language VARCHAR(10) DEFAULT 'en',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- COMPANY MANAGEMENT
-- =====================================================

-- Companies table (enhanced)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE, -- SEO-friendly URL
    description TEXT,
    
    -- Business Information
    industry VARCHAR(100),
    sector VARCHAR(100),
    size VARCHAR(50) CHECK (size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    employees INTEGER,
    founded_year INTEGER,
    
    -- Location & Contact
    location VARCHAR(255),
    countries TEXT[], -- Array of countries
    website VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    
    -- Branding
    logo_url VARCHAR(500),
    logo_file_path VARCHAR(500),
    banner_url VARCHAR(500),
    brand_colors JSONB DEFAULT '{}',
    
    -- Business Model
    business_model TEXT,
    revenue_model VARCHAR(100),
    target_market TEXT[],
    key_partners TEXT[],
    
    -- Shared Wealth Integration
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    is_shared_wealth_licensed BOOLEAN DEFAULT false,
    license_number VARCHAR(100),
    license_date DATE,
    license_expiry DATE,
    
    -- Application Information
    applicant_role VARCHAR(100),
    applicant_position VARCHAR(100),
    applicant_user_id UUID REFERENCES users(id),
    application_notes TEXT,
    
    -- Metrics
    connection_count INTEGER DEFAULT 0,
    project_count INTEGER DEFAULT 0,
    funding_received DECIMAL(15,2) DEFAULT 0,
    
    -- Admin Management
    created_by_admin BOOLEAN DEFAULT false,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Company relationships
CREATE TABLE IF NOT EXISTS user_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Role Information
    role VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    start_date DATE,
    end_date DATE,
    
    -- Status & Permissions
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
    is_primary BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    permissions JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, company_id)
);

-- =====================================================
-- SOCIAL FEATURES & NETWORKING
-- =====================================================

-- User connections (following/followers)
CREATE TABLE IF NOT EXISTS user_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    connection_type VARCHAR(50) DEFAULT 'follow' CHECK (connection_type IN ('follow', 'friend', 'colleague', 'mentor')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'blocked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Company connections (partnerships, collaborations)
CREATE TABLE IF NOT EXISTS company_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_a_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    company_b_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    connection_type VARCHAR(50) DEFAULT 'partnership' CHECK (connection_type IN ('partnership', 'supplier', 'customer', 'competitor', 'collaborator')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
    strength INTEGER DEFAULT 1 CHECK (strength >= 1 AND strength <= 5),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(company_a_id, company_b_id),
    CHECK (company_a_id != company_b_id)
);

-- Activity feed
CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    
    -- Activity Details
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('user_joined', 'company_created', 'connection_made', 'post_created', 'project_started', 'funding_received', 'event_created', 'comment_made', 'reaction_added')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Related Entities
    related_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    related_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    related_content_id UUID, -- Could reference various content types
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONTENT MANAGEMENT SYSTEM
-- =====================================================

-- Unified content table (replaces multiple content tables)
CREATE TABLE IF NOT EXISTS unified_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    
    -- Content Details
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    
    -- Content Type & Status
    type VARCHAR(50) NOT NULL CHECK (type IN ('news', 'update', 'announcement', 'collaboration', 'post', 'article', 'event', 'funding_opportunity', 'project_update', 'case_study')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'deleted')),
    
    -- Media & Attachments
    featured_image_url VARCHAR(500),
    media_urls JSONB DEFAULT '[]',
    attachments JSONB DEFAULT '[]',
    
    -- SEO & Metadata
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags TEXT[] DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',
    
    -- Engagement Metrics
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    
    -- Publishing
    is_featured BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content reactions (likes, loves, etc.)
CREATE TABLE IF NOT EXISTS content_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES unified_content(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry', 'support', 'celebrate')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(content_id, user_id)
);

-- Content comments
CREATE TABLE IF NOT EXISTS content_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES unified_content(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES content_comments(id) ON DELETE CASCADE,
    
    -- Comment Details
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT false,
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FUNDING PLATFORM
-- =====================================================

-- Funding opportunities
CREATE TABLE IF NOT EXISTS funding_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT NOT NULL,
    
    -- Funding Details
    amount_min DECIMAL(15,2),
    amount_max DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    funding_type VARCHAR(50) CHECK (funding_type IN ('grant', 'loan', 'equity', 'donation', 'partnership')),
    
    -- Eligibility & Requirements
    category VARCHAR(100),
    industry_focus TEXT[],
    geographic_focus TEXT[],
    requirements TEXT,
    eligibility_criteria TEXT,
    application_process TEXT,
    
    -- Timeline
    application_deadline DATE,
    review_period_days INTEGER DEFAULT 30,
    disbursement_timeline TEXT,
    
    -- Status & Management
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed', 'completed')),
    is_featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    
    -- Metrics
    applications_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Funding applications
CREATE TABLE IF NOT EXISTS funding_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES funding_opportunities(id) ON DELETE CASCADE,
    applicant_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    applicant_company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Application Details
    project_title VARCHAR(255) NOT NULL,
    project_description TEXT NOT NULL,
    requested_amount DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Business Information
    business_model TEXT,
    market_analysis TEXT,
    financial_projections JSONB DEFAULT '{}',
    team_information JSONB DEFAULT '{}',
    
    -- Documents & Attachments
    business_plan_url VARCHAR(500),
    financial_statements_url VARCHAR(500),
    pitch_deck_url VARCHAR(500),
    additional_documents JSONB DEFAULT '[]',
    
    -- Application Status
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'approved', 'rejected', 'withdrawn')),
    review_notes TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    
    -- Timestamps
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(opportunity_id, applicant_user_id, applicant_company_id)
);

-- =====================================================
-- COLLABORATION & PROJECTS
-- =====================================================

-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(100) DEFAULT 'collaboration' CHECK (project_type IN ('collaboration', 'research', 'development', 'partnership', 'consulting', 'training')),
    
    -- Project Details
    objectives TEXT[],
    deliverables TEXT[],
    timeline TEXT,
    budget DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status & Timeline
    status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    start_date DATE,
    end_date DATE,
    actual_completion_date DATE,
    
    -- Participants
    project_manager_id UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    participants JSONB DEFAULT '[]', -- Array of user/company IDs
    
    -- Metrics
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    milestones_completed INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project participants (detailed relationship)
CREATE TABLE IF NOT EXISTS project_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Role & Responsibilities
    role VARCHAR(100) NOT NULL,
    responsibilities TEXT[],
    time_commitment VARCHAR(50),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(project_id, user_id, company_id)
);

-- Collaboration meetings
CREATE TABLE IF NOT EXISTS collaboration_meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Meeting Details
    meeting_type VARCHAR(50) DEFAULT 'virtual' CHECK (meeting_type IN ('virtual', 'in_person', 'hybrid')),
    location VARCHAR(255),
    meeting_url VARCHAR(500),
    
    -- Schedule
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    timezone VARCHAR(50),
    
    -- Status
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    
    -- Organizer
    organizer_id UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FORUM SYSTEM
-- =====================================================

-- Forum categories
CREATE TABLE IF NOT EXISTS forum_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Moderation
    moderators UUID[] DEFAULT '{}', -- Array of user IDs
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forum topics
CREATE TABLE IF NOT EXISTS forum_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    
    -- Topic Details
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content TEXT NOT NULL,
    
    -- Status & Moderation
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'locked', 'pinned', 'archived')),
    is_pinned BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    
    -- Engagement
    views_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMP,
    last_reply_by UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forum replies
CREATE TABLE IF NOT EXISTS forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
    
    -- Reply Details
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT false, -- Marked as solution
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT true,
    is_deleted BOOLEAN DEFAULT false,
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MESSAGING SYSTEM
-- =====================================================

-- Messages (direct messaging)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    conversation_id UUID, -- Group conversations
    
    -- Message Details
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'voice', 'system')),
    
    -- Attachments
    attachments JSONB DEFAULT '[]',
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    
    -- Reply Context
    reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    
    -- Timestamps
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FILE MANAGEMENT
-- =====================================================

-- File uploads
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    
    -- File Details
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    
    -- File Type & Category
    file_type VARCHAR(50) CHECK (file_type IN ('document', 'image', 'video', 'audio', 'archive', 'other')),
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'logo', 'document', 'presentation', 'spreadsheet', 'pdf')),
    
    -- Usage Context
    entity_type VARCHAR(50), -- What this file belongs to
    entity_id UUID, -- ID of the related entity
    
    -- Access Control
    is_public BOOLEAN DEFAULT false,
    access_level VARCHAR(20) DEFAULT 'private' CHECK (access_level IN ('private', 'company', 'network', 'public')),
    
    -- Timestamps
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- BUSINESS TOOLS & ANALYTICS
-- =====================================================

-- Business canvas (for the Business Canvas tool)
CREATE TABLE IF NOT EXISTS business_canvas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Canvas Details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    
    -- Canvas Sections (stored as JSONB for flexibility)
    canvas_data JSONB NOT NULL DEFAULT '{}',
    
    -- Collaboration
    collaborators UUID[] DEFAULT '{}', -- Array of user IDs
    is_template BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment results
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Assessment Details
    assessment_type VARCHAR(100) NOT NULL CHECK (assessment_type IN ('values', 'readiness', 'impact', 'sustainability', 'collaboration')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Results
    score INTEGER CHECK (score >= 0 AND score <= 100),
    results JSONB NOT NULL DEFAULT '{}',
    recommendations TEXT[],
    
    -- Status
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'archived')),
    
    -- Timestamps
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ADMIN & MONITORING
-- =====================================================

-- Admin activity log
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Activity Details
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    description TEXT,
    
    -- Changes
    changes JSONB DEFAULT '{}',
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Details
    type VARCHAR(50) NOT NULL CHECK (type IN ('system', 'social', 'business', 'funding', 'project', 'message')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related Entity
    entity_type VARCHAR(50),
    entity_id UUID,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    -- Delivery
    delivery_method VARCHAR(20) DEFAULT 'in_app' CHECK (delivery_method IN ('in_app', 'email', 'sms', 'push')),
    sent_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Company indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);

-- User-Company relationship indexes
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_status ON user_companies(status);

-- Content indexes
CREATE INDEX IF NOT EXISTS idx_unified_content_author_id ON unified_content(author_id);
CREATE INDEX IF NOT EXISTS idx_unified_content_type ON unified_content(type);
CREATE INDEX IF NOT EXISTS idx_unified_content_status ON unified_content(status);
CREATE INDEX IF NOT EXISTS idx_unified_content_published_at ON unified_content(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_unified_content_search ON unified_content USING gin(to_tsvector('english', title || ' ' || content));

-- Activity feed indexes
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created_at ON activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_type ON activity_feed(activity_type);

-- Message indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at DESC);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Create default admin user
INSERT INTO users (email, password_hash, role, first_name, last_name, is_active, email_verified) VALUES
('admin@sharedwealth.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'Admin', 'User', true, true)
ON CONFLICT (email) DO NOTHING;

-- Create default forum categories
INSERT INTO forum_categories (name, slug, description, icon, color) VALUES
('General Discussion', 'general', 'General discussions about shared wealth', 'message-circle', '#3B82F6'),
('Business Opportunities', 'business', 'Share and discover business opportunities', 'briefcase', '#10B981'),
('Funding & Investment', 'funding', 'Funding opportunities and investment discussions', 'dollar-sign', '#F59E0B'),
('Collaboration Hub', 'collaboration', 'Find collaboration partners and projects', 'users', '#8B5CF6'),
('Success Stories', 'success', 'Share your success stories and case studies', 'trophy', '#EF4444')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- User profile view with company information
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
    u.*,
    COALESCE(json_agg(
        json_build_object(
            'company_id', c.id,
            'company_name', c.name,
            'role', uc.role,
            'position', uc.position,
            'status', uc.status
        )
    ) FILTER (WHERE c.id IS NOT NULL), '[]') as companies
FROM users u
LEFT JOIN user_companies uc ON u.id = uc.user_id AND uc.status = 'active'
LEFT JOIN companies c ON uc.company_id = c.id
GROUP BY u.id;

-- Company profile view with user information
CREATE OR REPLACE VIEW company_profiles AS
SELECT 
    c.*,
    COALESCE(json_agg(
        json_build_object(
            'user_id', u.id,
            'user_name', u.first_name || ' ' || u.last_name,
            'user_email', u.email,
            'role', uc.role,
            'position', uc.position,
            'is_primary', uc.is_primary
        )
    ) FILTER (WHERE u.id IS NOT NULL), '[]') as team_members
FROM companies c
LEFT JOIN user_companies uc ON c.id = uc.company_id AND uc.status = 'active'
LEFT JOIN users u ON uc.user_id = u.id
GROUP BY c.id;

-- =====================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to update activity feed
CREATE OR REPLACE FUNCTION add_activity_feed_entry(
    p_user_id UUID,
    p_activity_type VARCHAR(50),
    p_title VARCHAR(255),
    p_description TEXT DEFAULT NULL,
    p_company_id UUID DEFAULT NULL,
    p_related_user_id UUID DEFAULT NULL,
    p_related_company_id UUID DEFAULT NULL,
    p_related_content_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO activity_feed (
        user_id, activity_type, title, description, company_id,
        related_user_id, related_company_id, related_content_id
    ) VALUES (
        p_user_id, p_activity_type, p_title, p_description, p_company_id,
        p_related_user_id, p_related_company_id, p_related_content_id
    ) RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update content engagement metrics
CREATE OR REPLACE FUNCTION update_content_metrics(p_content_id UUID) RETURNS VOID AS $$
BEGIN
    UPDATE unified_content SET
        views_count = (SELECT COUNT(*) FROM content_reactions WHERE content_id = p_content_id),
        likes_count = (SELECT COUNT(*) FROM content_reactions WHERE content_id = p_content_id AND reaction_type = 'like'),
        comments_count = (SELECT COUNT(*) FROM content_comments WHERE content_id = p_content_id AND is_deleted = false)
    WHERE id = p_content_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_companies_updated_at BEFORE UPDATE ON user_companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_unified_content_updated_at BEFORE UPDATE ON unified_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funding_opportunities_updated_at BEFORE UPDATE ON funding_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funding_applications_updated_at BEFORE UPDATE ON funding_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_topics_updated_at BEFORE UPDATE ON forum_topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON forum_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- This schema provides a comprehensive foundation for the Shared Wealth International platform
-- supporting all identified features including user management, company networking, content management,
-- funding platform, collaboration tools, forum system, messaging, file management, and admin functions.
