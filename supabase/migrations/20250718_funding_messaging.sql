-- Funding Platform and Messaging System Migration
-- This migration creates the necessary tables for AI-powered funding matching and inter-company messaging

-- 1. FUNDING OPPORTUNITIES TABLE
CREATE TABLE public.funding_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  agency TEXT NOT NULL,
  category TEXT NOT NULL,
  amount TEXT NOT NULL,
  deadline DATE NOT NULL,
  eligibility TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  application_process TEXT,
  contact_info TEXT,
  website TEXT,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. FUNDING MATCHES TABLE
CREATE TABLE public.funding_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.funding_opportunities(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.network_companies(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  match_reasons TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'interested', 'applied', 'awarded', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(opportunity_id, company_id)
);

-- 3. CONVERSATIONS TABLE
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participants UUID[] NOT NULL,
  last_message_id UUID,
  unread_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. MESSAGES TABLE
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'voice')),
  attachments TEXT[] DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_funding_opportunities_category ON public.funding_opportunities(category);
CREATE INDEX idx_funding_opportunities_amount ON public.funding_opportunities(amount);
CREATE INDEX idx_funding_opportunities_deadline ON public.funding_opportunities(deadline);
CREATE INDEX idx_funding_opportunities_is_active ON public.funding_opportunities(is_active);
CREATE INDEX idx_funding_opportunities_tags ON public.funding_opportunities USING GIN(tags);

CREATE INDEX idx_funding_matches_company_id ON public.funding_matches(company_id);
CREATE INDEX idx_funding_matches_opportunity_id ON public.funding_matches(opportunity_id);
CREATE INDEX idx_funding_matches_status ON public.funding_matches(status);
CREATE INDEX idx_funding_matches_match_score ON public.funding_matches(match_score);

CREATE INDEX idx_conversations_participants ON public.conversations USING GIN(participants);
CREATE INDEX idx_conversations_updated_at ON public.conversations(updated_at);
CREATE INDEX idx_conversations_is_archived ON public.conversations(is_archived);

CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_conversation ON public.messages(sender_id, receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);

-- Enable RLS
ALTER TABLE public.funding_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for funding_opportunities
CREATE POLICY "Anyone can view active funding opportunities" ON public.funding_opportunities 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage funding opportunities" ON public.funding_opportunities 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for funding_matches
CREATE POLICY "Users can view their own funding matches" ON public.funding_matches 
  FOR SELECT USING (company_id IN (
    SELECT id FROM public.network_companies WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own funding matches" ON public.funding_matches 
  FOR INSERT WITH CHECK (company_id IN (
    SELECT id FROM public.network_companies WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own funding matches" ON public.funding_matches 
  FOR UPDATE USING (company_id IN (
    SELECT id FROM public.network_companies WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own funding matches" ON public.funding_matches 
  FOR DELETE USING (company_id IN (
    SELECT id FROM public.network_companies WHERE user_id = auth.uid()
  ));

-- RLS Policies for conversations
CREATE POLICY "Users can view conversations they participate in" ON public.conversations 
  FOR SELECT USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can insert conversations they participate in" ON public.conversations 
  FOR INSERT WITH CHECK (auth.uid() = ANY(participants));

CREATE POLICY "Users can update conversations they participate in" ON public.conversations 
  FOR UPDATE USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can delete conversations they participate in" ON public.conversations 
  FOR DELETE USING (auth.uid() = ANY(participants));

-- RLS Policies for messages
CREATE POLICY "Users can view messages they sent or received" ON public.messages 
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can insert messages they send" ON public.messages 
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update messages they sent" ON public.messages 
  FOR UPDATE USING (sender_id = auth.uid());

CREATE POLICY "Users can delete messages they sent" ON public.messages 
  FOR DELETE USING (sender_id = auth.uid());

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_funding_opportunities_updated_at 
  BEFORE UPDATE ON public.funding_opportunities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funding_matches_updated_at 
  BEFORE UPDATE ON public.funding_matches 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON public.conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at 
  BEFORE UPDATE ON public.messages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample funding opportunities
INSERT INTO public.funding_opportunities (
  title,
  description,
  agency,
  category,
  amount,
  deadline,
  eligibility,
  requirements,
  application_process,
  contact_info,
  website,
  tags,
  is_active
) VALUES 
(
  'Green Innovation Fund',
  'Supporting sustainable business models and environmental initiatives across Europe',
  'European Green Deal Fund',
  'Environment',
  '€500K - €1M',
  '2024-12-31',
  ARRAY['EU-based companies', 'Environmental focus', 'Innovation-driven', 'Proven track record'],
  ARRAY['Business plan', 'Environmental impact assessment', 'Financial projections', 'Sustainability metrics'],
  'Two-stage application process: Initial screening followed by detailed proposal and pitch presentation',
  'greenfund@eu.eu',
  'https://greenfund.eu',
  ARRAY['sustainability', 'innovation', 'environment', 'green-tech', 'climate-action'],
  true
),
(
  'Social Enterprise Development Grant',
  'Funding for businesses that create measurable positive social impact in their communities',
  'Social Impact Foundation',
  'Social Enterprise',
  '€100K - €500K',
  '2024-11-30',
  ARRAY['Social enterprise', 'Proven impact', 'Scalable model', 'Community-focused'],
  ARRAY['Impact measurement framework', 'Social mission statement', 'Community testimonials', 'Financial sustainability plan'],
  'Online application with supporting documents, followed by virtual pitch presentation and Q&A session',
  'grants@socialimpact.org',
  'https://socialimpact.org',
  ARRAY['social impact', 'community', 'sustainability', 'social-enterprise', 'inclusion'],
  true
),
(
  'Digital Transformation Initiative',
  'Supporting SMEs in adopting digital technologies and improving their competitive position',
  'Digital Europe Programme',
  'Technology',
  '€50K - €100K',
  '2025-03-15',
  ARRAY['SMEs', 'Digital adoption focus', 'Growth potential', 'Innovation mindset'],
  ARRAY['Digital strategy', 'Implementation plan', 'ROI projections', 'Technology roadmap'],
  'Online application with digital readiness assessment and technology consultation session',
  'digital@europe.eu',
  'https://digital-europe.eu',
  ARRAY['digital', 'SMEs', 'transformation', 'technology', 'innovation'],
  true
),
(
  'Circular Economy Innovation Grant',
  'Supporting businesses that implement circular economy principles and reduce waste',
  'Circular Economy Fund',
  'Environment',
  '€200K - €800K',
  '2025-01-31',
  ARRAY['Circular business model', 'Waste reduction focus', 'Innovative approach', 'Market potential'],
  ARRAY['Circular economy strategy', 'Waste reduction metrics', 'Market analysis', 'Implementation timeline'],
  'Multi-stage application with expert panel review and sustainability assessment',
  'circular@fund.eu',
  'https://circular-fund.eu',
  ARRAY['circular-economy', 'waste-reduction', 'sustainability', 'innovation', 'environment'],
  true
),
(
  'Women-Led Business Accelerator',
  'Supporting women entrepreneurs in scaling their businesses and accessing new markets',
  'Women Entrepreneurship Fund',
  'Social Enterprise',
  '€75K - €300K',
  '2025-02-28',
  ARRAY['Women-led business', 'Growth stage', 'Market expansion focus', 'Innovation-driven'],
  ARRAY['Business growth plan', 'Market expansion strategy', 'Financial projections', 'Leadership development plan'],
  'Application with business plan review, followed by accelerator program and final pitch',
  'women@entrepreneurship.eu',
  'https://women-entrepreneurship.eu',
  ARRAY['women-entrepreneurship', 'business-acceleration', 'growth', 'leadership', 'innovation'],
  true
);

-- Grant necessary permissions
GRANT ALL ON public.funding_opportunities TO authenticated;
GRANT SELECT ON public.funding_opportunities TO anon;

GRANT ALL ON public.funding_matches TO authenticated;

GRANT ALL ON public.conversations TO authenticated;

GRANT ALL ON public.messages TO authenticated;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_conversation_messages(conv_id UUID)
RETURNS TABLE (
  id UUID,
  sender_id UUID,
  receiver_id UUID,
  content TEXT,
  message_type TEXT,
  attachments TEXT[],
  is_read BOOLEAN,
  is_starred BOOLEAN,
  is_pinned BOOLEAN,
  reply_to_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.sender_id,
    m.receiver_id,
    m.content,
    m.message_type,
    m.attachments,
    m.is_read,
    m.is_starred,
    m.is_pinned,
    m.reply_to_id,
    m.created_at,
    m.updated_at
  FROM public.messages m
  JOIN public.conversations c ON 
    (m.sender_id = ANY(c.participants) AND m.receiver_id = ANY(c.participants))
  WHERE c.id = conv_id
  ORDER BY m.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate funding match score
CREATE OR REPLACE FUNCTION calculate_funding_match_score(
  company_sector TEXT,
  company_country TEXT,
  company_highlights TEXT[],
  opportunity_category TEXT,
  opportunity_eligibility TEXT[],
  opportunity_tags TEXT[]
)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Sector matching (30 points)
  IF LOWER(company_sector) = LOWER(opportunity_category) THEN
    score := score + 30;
  END IF;
  
  -- Geographic matching (20 points)
  IF EXISTS (
    SELECT 1 FROM unnest(opportunity_eligibility) AS e 
    WHERE LOWER(e) LIKE '%' || LOWER(company_country) || '%'
  ) THEN
    score := score + 20;
  END IF;
  
  -- Highlight matching (15 points)
  IF EXISTS (
    SELECT 1 FROM unnest(company_highlights) AS h
    JOIN unnest(opportunity_tags) AS t ON LOWER(h) LIKE '%' || LOWER(t) || '%'
  ) THEN
    score := score + 15;
  END IF;
  
  -- Return capped score
  RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
