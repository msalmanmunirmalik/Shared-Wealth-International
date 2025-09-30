-- Unified Content Table
-- This table consolidates all content types (news, posts, announcements, etc.)
-- Replaces company_news table and other content tables

CREATE TABLE IF NOT EXISTS unified_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
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

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_unified_content_author_id ON unified_content(author_id);
CREATE INDEX IF NOT EXISTS idx_unified_content_company_id ON unified_content(company_id);
CREATE INDEX IF NOT EXISTS idx_unified_content_type ON unified_content(type);
CREATE INDEX IF NOT EXISTS idx_unified_content_published_at ON unified_content(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_unified_content_is_published ON unified_content(is_published);
CREATE INDEX IF NOT EXISTS idx_unified_content_created_at ON unified_content(created_at DESC);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_unified_content_feed ON unified_content(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_unified_content_company_type ON unified_content(company_id, type, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_unified_content_author_type ON unified_content(author_id, type, published_at DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_unified_content_search ON unified_content USING gin(to_tsvector('english', title || ' ' || content));

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_unified_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_unified_content_updated_at
    BEFORE UPDATE ON unified_content
    FOR EACH ROW
    EXECUTE FUNCTION update_unified_content_updated_at();

-- Migrate existing company_news data to unified_content
INSERT INTO unified_content (
    id,
    author_id,
    company_id,
    title,
    content,
    type,
    tags,
    media_urls,
    reactions,
    comments_count,
    shares_count,
    is_published,
    published_at,
    created_at,
    updated_at
)
SELECT 
    id,
    author_id,
    company_id,
    title,
    content,
    post_type as type,
    tags,
    media_urls,
    reactions,
    comments_count,
    shares_count,
    is_published,
    published_at,
    created_at,
    updated_at
FROM company_news
WHERE NOT EXISTS (
    SELECT 1 FROM unified_content WHERE unified_content.id = company_news.id
);

-- Add some sample data for testing different content types
INSERT INTO unified_content (
    author_id,
    company_id,
    title,
    content,
    type,
    tags,
    metadata,
    published_at
) VALUES 
-- News content
(
    '81de6dec-f752-415f-be12-ef55003d0365',
    'd943f30e-a4ad-4c0c-96af-f38aca40c4c3',
    'Platform Update: New Features Released',
    'We are excited to announce several new features including enhanced collaboration tools, improved analytics, and better user experience. These updates will help our community members connect and collaborate more effectively.',
    'news',
    '["platform", "features", "update", "collaboration"]'::jsonb,
    '{"feature_count": 5, "impact_level": "high"}'::jsonb,
    NOW() - INTERVAL '1 day'
),
-- Announcement content
(
    '81de6dec-f752-415f-be12-ef55003d0365',
    'd943f30e-a4ad-4c0c-96af-f38aca40c4c3',
    'Important: System Maintenance Scheduled',
    'We will be performing scheduled maintenance on our platform this weekend. The system will be temporarily unavailable from 2 AM to 6 AM EST on Sunday. We apologize for any inconvenience.',
    'announcement',
    '["maintenance", "system", "scheduled"]'::jsonb,
    '{"maintenance_duration": "4 hours", "impact": "temporary_outage"}'::jsonb,
    NOW() - INTERVAL '3 hours'
),
-- Collaboration content
(
    '81de6dec-f752-415f-be12-ef55003d0365',
    'd943f30e-a4ad-4c0c-96af-f38aca40c4c3',
    'New Partnership with Global Education Network',
    'We are thrilled to announce our new partnership with Global Education Network, expanding our reach to 15 new countries. This collaboration will provide our students with even more opportunities for quality education worldwide.',
    'collaboration',
    '["partnership", "global", "education", "expansion"]'::jsonb,
    '{"partner_countries": 15, "expected_impact": "high"}'::jsonb,
    NOW() - INTERVAL '2 days'
),
-- Update content
(
    '81de6dec-f752-415f-be12-ef55003d0365',
    'd943f30e-a4ad-4c0c-96af-f38aca40c4c3',
    'Q1 2024 Impact Report: Supporting 10,000+ Students',
    'Our Q1 impact report shows incredible growth in student support, with over 10,000 students benefiting from our programs. This represents a 25% increase from the previous quarter.',
    'update',
    '["impact", "students", "growth", "report"]'::jsonb,
    '{"student_count": 10000, "growth_percentage": 25}'::jsonb,
    NOW() - INTERVAL '5 days'
),
-- Article content
(
    '81de6dec-f752-415f-be12-ef55003d0365',
    NULL,
    'The Future of Shared Wealth: Trends and Predictions',
    'As we look ahead to the future of shared wealth models, several key trends are emerging. This article explores the latest developments in collaborative business practices and their impact on global communities.',
    'article',
    '["shared_wealth", "future", "trends", "business"]'::jsonb,
    '{"article_length": "long", "category": "thought_leadership"}'::jsonb,
    NOW() - INTERVAL '1 week'
)
ON CONFLICT DO NOTHING;

-- Create a view for easy content access with author and company info
CREATE OR REPLACE VIEW content_with_details AS
SELECT 
    c.*,
    u.first_name,
    u.last_name,
    u.email as author_email,
    comp.name as company_name,
    comp.logo_url as company_logo,
    comp.sector as company_sector
FROM unified_content c
LEFT JOIN users u ON c.author_id = u.id
LEFT JOIN companies comp ON c.company_id = comp.id;

-- Create a function to get content statistics
CREATE OR REPLACE FUNCTION get_content_stats()
RETURNS TABLE (
    total_content bigint,
    published_content bigint,
    content_by_type jsonb,
    recent_content bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_content,
        COUNT(*) FILTER (WHERE is_published = true) as published_content,
        jsonb_object_agg(type, type_count) as content_by_type,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as recent_content
    FROM (
        SELECT 
            type,
            COUNT(*) as type_count
        FROM unified_content
        GROUP BY type
    ) type_stats
    CROSS JOIN unified_content;
END;
$$ LANGUAGE plpgsql;
