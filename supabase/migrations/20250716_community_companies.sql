-- Community Companies & Posts Migration

-- 1. Companies Table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  sector TEXT,
  website TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved BOOLEAN DEFAULT false
);

-- 2. Company Users Table
CREATE TABLE public.company_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'rep',
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, user_id)
);

-- 3. Company Posts Table
CREATE TABLE public.company_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- news, event, update
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Companies: Anyone can view approved, only company users can edit
CREATE POLICY "Public can view approved companies" ON public.companies FOR SELECT USING (approved = true);
CREATE POLICY "Company users can manage their company" ON public.companies FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.company_users cu WHERE cu.company_id = id AND cu.user_id = auth.uid() AND cu.is_active)
);

-- Company Users: Only user or company admin can view/edit
CREATE POLICY "Company user can view their membership" ON public.company_users FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Company user can update their membership" ON public.company_users FOR UPDATE USING (user_id = auth.uid());

-- Company Posts: Public can view approved, company users can create
CREATE POLICY "Public can view approved posts" ON public.company_posts FOR SELECT USING (approved = true);
CREATE POLICY "Company users can create posts" ON public.company_posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.company_users cu WHERE cu.company_id = company_id AND cu.user_id = auth.uid() AND cu.is_active)
);
CREATE POLICY "Company users can update their posts" ON public.company_posts FOR UPDATE USING (user_id = auth.uid()); 