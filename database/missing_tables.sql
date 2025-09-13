-- Missing Database Tables for Phase 1
-- Add these tables to the existing schema

-- Projects table for tracking active projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    project_type VARCHAR(100) DEFAULT 'collaboration' CHECK (project_type IN ('collaboration', 'research', 'development', 'partnership')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'cancelled', 'on_hold')),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    participants TEXT[], -- Array of participant names/companies
    project_manager_id UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company applications table for tracking company applications
CREATE TABLE IF NOT EXISTS company_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(20),
    company_sector VARCHAR(100),
    company_size VARCHAR(50) CHECK (company_size IN ('startup', 'small', 'medium', 'large')),
    company_location VARCHAR(255),
    company_website VARCHAR(255),
    company_description TEXT,
    business_model TEXT,
    shared_wealth_commitment TEXT,
    expected_impact TEXT,
    application_status VARCHAR(50) DEFAULT 'pending' CHECK (application_status IN ('pending', 'under_review', 'approved', 'rejected', 'on_hold')),
    review_notes TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collaboration meetings table (mentioned in docs)
CREATE TABLE IF NOT EXISTS collaboration_meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    meeting_title VARCHAR(255) NOT NULL,
    meeting_date TIMESTAMP NOT NULL,
    participants TEXT[], -- Array of participant names
    meeting_notes TEXT,
    outcomes TEXT,
    impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 10),
    shared_wealth_contribution TEXT,
    meeting_type VARCHAR(100) DEFAULT 'collaboration' CHECK (meeting_type IN ('collaboration', 'partnership', 'mentoring', 'networking')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User connections table for following/follower system
CREATE TABLE IF NOT EXISTS user_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    connection_type VARCHAR(50) DEFAULT 'follow' CHECK (connection_type IN ('follow', 'friend', 'colleague', 'mentor')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

-- Post reactions table for likes/dislikes
CREATE TABLE IF NOT EXISTS post_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL, -- References forum_topics or other posts
    post_type VARCHAR(50) NOT NULL CHECK (post_type IN ('forum_topic', 'forum_reply', 'company_post', 'event')),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(50) DEFAULT 'like' CHECK (reaction_type IN ('like', 'dislike', 'love', 'laugh', 'wow', 'sad', 'angry')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, post_type, user_id)
);

-- Bookmarks table for saving content
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bookmarked_id UUID NOT NULL,
    bookmarked_type VARCHAR(50) NOT NULL CHECK (bookmarked_type IN ('forum_topic', 'company_post', 'event', 'user', 'company')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, bookmarked_id, bookmarked_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_company_applications_status ON company_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_collaboration_meetings_company_id ON collaboration_meetings(company_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_follower_id ON user_connections(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_following_id ON user_connections(following_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id, post_type);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_type ON bookmarks(bookmarked_type);
