-- Company News & Updates Table
-- This table stores news and updates posted by companies

CREATE TABLE IF NOT EXISTS company_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_type VARCHAR(50) DEFAULT 'news' CHECK (post_type IN ('news', 'update', 'announcement', 'collaboration')),
    tags JSONB DEFAULT '[]'::jsonb,
    media_urls JSONB DEFAULT '[]'::jsonb,
    reactions JSONB DEFAULT '{}'::jsonb,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_company_news_company_id ON company_news(company_id);
CREATE INDEX IF NOT EXISTS idx_company_news_author_id ON company_news(author_id);
CREATE INDEX IF NOT EXISTS idx_company_news_published_at ON company_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_company_news_is_published ON company_news(is_published);
CREATE INDEX IF NOT EXISTS idx_company_news_post_type ON company_news(post_type);

-- Composite index for company news feed queries
CREATE INDEX IF NOT EXISTS idx_company_news_feed ON company_news(is_published, published_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_company_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_company_news_updated_at
    BEFORE UPDATE ON company_news
    FOR EACH ROW
    EXECUTE FUNCTION update_company_news_updated_at();

-- Add some sample data for testing
INSERT INTO company_news (
    company_id,
    author_id,
    title,
    content,
    post_type,
    tags,
    published_at
) VALUES (
    'd943f30e-a4ad-4c0c-96af-f38aca40c4c3',
    '81de6dec-f752-415f-be12-ef55003d0365',
    'Welcome to Letstern - Connecting Global Education',
    'We are excited to announce the launch of Letstern, a revolutionary platform connecting students, agents, freelancers, and institutes worldwide for seamless study abroad experiences. Our mission is to break down barriers and create opportunities for global education.',
    'announcement',
    '["launch", "education", "global", "students"]'::jsonb,
    NOW() - INTERVAL '2 days'
), (
    'd943f30e-a4ad-4c0c-96af-f38aca40c4c3',
    '81de6dec-f752-415f-be12-ef55003d0365',
    'New Partnership with Global Universities',
    'We are thrilled to announce our new partnerships with 15 leading universities across Europe, Asia, and North America. This expansion will provide our students with even more opportunities for quality education worldwide.',
    'collaboration',
    '["partnership", "universities", "expansion", "global"]'::jsonb,
    NOW() - INTERVAL '1 day'
), (
    'd943f30e-a4ad-4c0c-96af-f38aca40c4c3',
    '81de6dec-f752-415f-be12-ef55003d0365',
    'Student Success Stories - Q1 2024',
    'This quarter, we have successfully helped over 500 students achieve their study abroad dreams. From securing scholarships to visa approvals, our comprehensive support system continues to make a difference in students lives.',
    'update',
    '["success", "students", "achievements", "support"]'::jsonb,
    NOW() - INTERVAL '6 hours'
)
ON CONFLICT DO NOTHING;
