-- Complete Platform Ecosystem Migration
-- This migration creates all necessary tables for the Shared Wealth International platform

-- 1. Enhanced Company Management System
CREATE TABLE IF NOT EXISTS public.company_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  website TEXT,
  employees INTEGER,
  location TEXT,
  is_shared_wealth_licensed BOOLEAN DEFAULT false,
  license_number TEXT,
  license_date DATE,
  applicant_role TEXT NOT NULL,
  applicant_position TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  admin_notes TEXT,
  admin_id UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Social License Agreement System
CREATE TABLE IF NOT EXISTS public.social_license_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_application_id UUID NOT NULL REFERENCES public.company_applications(id) ON DELETE CASCADE,
  agreement_version TEXT NOT NULL DEFAULT '1.0',
  agreement_text TEXT NOT NULL,
  user_signature TEXT NOT NULL, -- Hash of user's digital signature
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Enhanced Network Companies Table
CREATE TABLE IF NOT EXISTS public.network_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_application_id UUID REFERENCES public.company_applications(id),
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  employees INTEGER,
  shared_value TEXT,
  impact_score DECIMAL(3,1) DEFAULT 0.0,
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  website TEXT,
  logo TEXT,
  highlights TEXT[],
  location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending_verification')),
  is_shared_wealth_licensed BOOLEAN DEFAULT false,
  license_number TEXT,
  license_date DATE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'unverified')),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. User Company Relationships
CREATE TABLE IF NOT EXISTS public.user_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.network_companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'executive', 'manager', 'employee', 'consultant', 'advisor', 'investor')),
  position TEXT NOT NULL,
  is_primary_contact BOOLEAN DEFAULT false,
  permissions TEXT[] DEFAULT ARRAY['view', 'edit_basic']::TEXT[],
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- 5. Funding Platform System
CREATE TABLE IF NOT EXISTS public.funding_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  agency TEXT NOT NULL,
  category TEXT NOT NULL,
  amount_min DECIMAL(15,2),
  amount_max DECIMAL(15,2),
  amount_display TEXT NOT NULL,
  deadline DATE NOT NULL,
  eligibility TEXT[] NOT NULL,
  requirements TEXT[] NOT NULL,
  application_process TEXT,
  contact_info TEXT,
  website TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.funding_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.funding_opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.network_companies(id) ON DELETE CASCADE,
  application_data JSONB NOT NULL, -- Flexible application data
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'awarded')),
  match_score INTEGER DEFAULT 0,
  match_reasons TEXT[],
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Tools & Learning System
CREATE TABLE IF NOT EXISTS public.learning_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.learning_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'course', 'tool', 'template', 'guide')),
  content_url TEXT,
  content_file TEXT,
  difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration INTEGER, -- in minutes
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.learning_resources(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent INTEGER DEFAULT 0, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- 7. Interactive Tools System
CREATE TABLE IF NOT EXISTS public.interactive_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  tool_type TEXT NOT NULL CHECK (tool_type IN ('calculator', 'simulator', 'assessment', 'generator', 'analyzer')),
  tool_config JSONB NOT NULL, -- Tool-specific configuration
  is_active BOOLEAN DEFAULT true,
  requires_authentication BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tool_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.interactive_tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id), -- Can be null for anonymous users
  session_data JSONB NOT NULL, -- Tool session data
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Business Canvas System
CREATE TABLE IF NOT EXISTS public.business_canvases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.network_companies(id),
  title TEXT NOT NULL,
  description TEXT,
  canvas_data JSONB NOT NULL, -- Canvas structure and content
  is_template BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  version TEXT DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. Discussion Forums System
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.forum_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.forum_topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_reply_id UUID REFERENCES public.forum_replies(id), -- For nested replies
  content TEXT NOT NULL,
  is_solution BOOLEAN DEFAULT false, -- Marked as solution
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. News & Updates System
CREATE TABLE IF NOT EXISTS public.news_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.news_categories(id),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. Notification System
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('info', 'success', 'warning', 'error', 'system')),
  related_entity_type TEXT, -- 'company', 'funding', 'learning', etc.
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 12. Activity Feed System
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id), -- Can be null for system activities
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  related_entity_type TEXT,
  related_entity_id UUID,
  metadata JSONB, -- Additional activity data
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 13. Platform Settings & Configuration
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.company_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_license_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_company_applications_user_id ON public.company_applications(user_id);
CREATE INDEX idx_company_applications_status ON public.company_applications(status);
CREATE INDEX idx_network_companies_status ON public.network_companies(status);
CREATE INDEX idx_user_companies_user_id ON public.user_companies(user_id);
CREATE INDEX idx_user_companies_company_id ON public.user_companies(company_id);
CREATE INDEX idx_funding_opportunities_status ON public.funding_opportunities(approval_status);
CREATE INDEX idx_funding_applications_user_id ON public.funding_applications(user_id);
CREATE INDEX idx_learning_resources_category ON public.learning_resources(category_id);
CREATE INDEX idx_forum_topics_category ON public.forum_topics(category_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_activity_feed_user_id ON public.activity_feed(user_id);

-- Insert default data
INSERT INTO public.learning_categories (name, description, icon, color, sort_order) VALUES
('Shared Wealth Principles', 'Core concepts and principles of shared wealth models', 'book-open', '#3B82F6', 1),
('Business Model Innovation', 'Tools and frameworks for innovative business models', 'lightbulb', '#10B981', 2),
('Impact Measurement', 'Methods and tools for measuring social and environmental impact', 'target', '#F59E0B', 3),
('Stakeholder Engagement', 'Strategies for engaging and managing stakeholders', 'users', '#8B5CF6', 4),
('Sustainability Practices', 'Sustainable business practices and implementation', 'leaf', '#06B6D4', 5);

INSERT INTO public.forum_categories (name, description, icon, color, sort_order) VALUES
('General Discussion', 'General topics about shared wealth and business', 'message-circle', '#3B82F6', 1),
('Business Models', 'Discussions about business model innovation', 'briefcase', '#10B981', 2),
('Funding & Investment', 'Funding opportunities and investment discussions', 'dollar-sign', '#F59E0B', 3),
('Tools & Resources', 'Sharing tools, resources, and best practices', 'tool', '#8B5CF6', 4),
('Success Stories', 'Case studies and success stories', 'award', '#06B6D4', 5);

INSERT INTO public.news_categories (name, description, color, sort_order) VALUES
('Platform Updates', 'Latest platform features and improvements', '#3B82F6', 1),
('Industry News', 'News from the shared wealth and sustainability sectors', '#10B981', 2),
('Member Spotlights', 'Featured member companies and success stories', '#F59E0B', 3),
('Events & Webinars', 'Upcoming events and webinar announcements', '#8B5CF6', 4),
('Research & Insights', 'Research findings and industry insights', '#06B6D4', 5);

-- Insert default platform settings
INSERT INTO public.platform_settings (setting_key, setting_value, setting_type, description) VALUES
('company_approval_required', 'true', 'boolean', 'Whether company applications require admin approval'),
('social_license_required', 'true', 'boolean', 'Whether social license agreement is required'),
('funding_approval_required', 'true', 'boolean', 'Whether funding opportunities require admin approval'),
('max_companies_per_user', '5', 'number', 'Maximum number of companies a user can register'),
('default_impact_score', '5.0', 'number', 'Default impact score for new companies');

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables that have this column
CREATE TRIGGER update_company_applications_updated_at 
  BEFORE UPDATE ON public.company_applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_companies_updated_at 
  BEFORE UPDATE ON public.network_companies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_companies_updated_at 
  BEFORE UPDATE ON public.user_companies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funding_opportunities_updated_at 
  BEFORE UPDATE ON public.funding_opportunities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funding_applications_updated_at 
  BEFORE UPDATE ON public.funding_applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_resources_updated_at 
  BEFORE UPDATE ON public.learning_resources 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interactive_tools_updated_at 
  BEFORE UPDATE ON public.interactive_tools 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_canvases_updated_at 
  BEFORE UPDATE ON public.business_canvases 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_topics_updated_at 
  BEFORE UPDATE ON public.forum_topics 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at 
  BEFORE UPDATE ON public.forum_replies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at 
  BEFORE UPDATE ON public.news_articles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_settings_updated_at 
  BEFORE UPDATE ON public.platform_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
