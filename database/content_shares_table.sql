-- Content Shares Table for Phase 2
-- This table tracks content sharing across platforms

CREATE TABLE IF NOT EXISTS content_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('forum_topic', 'forum_reply', 'company_post', 'event', 'project')),
    share_type VARCHAR(50) NOT NULL CHECK (share_type IN ('internal', 'linkedin', 'twitter', 'facebook', 'email')),
    platform VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_shares_user_id ON content_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_content_shares_content_id ON content_shares(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_content_shares_share_type ON content_shares(share_type);
CREATE INDEX IF NOT EXISTS idx_content_shares_created_at ON content_shares(created_at);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_content_shares_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_shares_updated_at
    BEFORE UPDATE ON content_shares
    FOR EACH ROW
    EXECUTE FUNCTION update_content_shares_updated_at();
