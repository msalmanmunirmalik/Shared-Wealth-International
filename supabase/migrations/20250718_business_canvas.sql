-- Business Canvas Migration
-- This migration creates the business_canvases table for the Business Model Canvas tool

-- Create business_canvases table
CREATE TABLE public.business_canvases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.network_companies(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  sections JSONB NOT NULL DEFAULT '{}',
  collaborators TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_business_canvases_user_id ON public.business_canvases(user_id);
CREATE INDEX idx_business_canvases_company_id ON public.business_canvases(company_id);
CREATE INDEX idx_business_canvases_is_public ON public.business_canvases(is_public);
CREATE INDEX idx_business_canvases_created_at ON public.business_canvases(created_at);

-- Enable RLS
ALTER TABLE public.business_canvases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_canvases
CREATE POLICY "Users can view their own canvases" ON public.business_canvases 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view public canvases" ON public.business_canvases 
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own canvases" ON public.business_canvases 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own canvases" ON public.business_canvases 
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own canvases" ON public.business_canvases 
  FOR DELETE USING (user_id = auth.uid());

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger
CREATE TRIGGER update_business_canvases_updated_at 
  BEFORE UPDATE ON public.business_canvases 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample canvas data for demonstration
INSERT INTO public.business_canvases (
  user_id,
  name,
  description,
  sections,
  is_public,
  created_at
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Sample Shared Wealth Business Model',
  'A demonstration of how to structure a shared wealth business model',
  '{
    "valueProposition": "Delivering sustainable value while sharing wealth with all stakeholders",
    "customerSegments": "Environmentally conscious consumers, ethical investors, community organizations",
    "channels": "Direct sales, partnerships, online platforms, community events",
    "customerRelationships": "Long-term partnerships, community engagement, transparent communication",
    "revenueStreams": "Product sales, service fees, licensing, community investments",
    "keyResources": "Skilled workforce, sustainable materials, community relationships, intellectual property",
    "keyActivities": "Sustainable production, community engagement, stakeholder collaboration, innovation",
    "keyPartnerships": "Local suppliers, community organizations, ethical investors, research institutions",
    "costStructure": "Sustainable materials, fair wages, community investment, environmental compliance"
  }'::jsonb,
  true,
  now()
);

-- Grant necessary permissions
GRANT ALL ON public.business_canvases TO authenticated;
GRANT SELECT ON public.business_canvases TO anon;
