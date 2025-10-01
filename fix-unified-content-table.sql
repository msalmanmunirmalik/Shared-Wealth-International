-- Fix unified_content table by adding missing columns
-- This script adds the missing 'type' column and other required columns

-- Add type column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'unified_content' 
        AND column_name = 'type'
    ) THEN
        ALTER TABLE unified_content ADD COLUMN type VARCHAR(50) DEFAULT 'post';
    END IF;
END $$;

-- Add other missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'unified_content' 
        AND column_name = 'tags'
    ) THEN
        ALTER TABLE unified_content ADD COLUMN tags JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'unified_content' 
        AND column_name = 'media_urls'
    ) THEN
        ALTER TABLE unified_content ADD COLUMN media_urls JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'unified_content' 
        AND column_name = 'metadata'
    ) THEN
        ALTER TABLE unified_content ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'unified_content' 
        AND column_name = 'reactions'
    ) THEN
        ALTER TABLE unified_content ADD COLUMN reactions JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'unified_content' 
        AND column_name = 'comments_count'
    ) THEN
        ALTER TABLE unified_content ADD COLUMN comments_count INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'unified_content' 
        AND column_name = 'shares_count'
    ) THEN
        ALTER TABLE unified_content ADD COLUMN shares_count INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'unified_content' 
        AND column_name = 'views_count'
    ) THEN
        ALTER TABLE unified_content ADD COLUMN views_count INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'unified_content' 
        AND column_name = 'is_published'
    ) THEN
        ALTER TABLE unified_content ADD COLUMN is_published BOOLEAN DEFAULT true;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'unified_content' 
        AND column_name = 'published_at'
    ) THEN
        ALTER TABLE unified_content ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_unified_content_type ON unified_content(type);
CREATE INDEX IF NOT EXISTS idx_unified_content_author_id ON unified_content(author_id);
CREATE INDEX IF NOT EXISTS idx_unified_content_company_id ON unified_content(company_id);
CREATE INDEX IF NOT EXISTS idx_unified_content_published_at ON unified_content(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_unified_content_is_published ON unified_content(is_published);
CREATE INDEX IF NOT EXISTS idx_unified_content_created_at ON unified_content(created_at DESC);
