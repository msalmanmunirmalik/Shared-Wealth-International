-- User Companies Management Migration

-- 1. User Companies Table
CREATE TABLE public.user_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL, -- Optional reference to existing network company
  company_name TEXT NOT NULL,
  role TEXT NOT NULL, -- owner, executive, manager, employee, consultant, advisor, other
  position TEXT NOT NULL,
  is_shared_wealth_licensed BOOLEAN DEFAULT false,
  license_number TEXT,
  license_date DATE,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Network Companies Table (for the public network directory)
CREATE TABLE public.network_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  employees INTEGER,
  shared_value TEXT,
  impact_score DECIMAL(3,1),
  joined_date TEXT,
  website TEXT,
  logo TEXT,
  highlights TEXT[], -- Array of highlight strings
  location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  is_shared_wealth_licensed BOOLEAN DEFAULT false,
  license_number TEXT,
  license_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Company Applications Table (for new companies applying to join network)
CREATE TABLE public.company_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  website TEXT,
  employees INTEGER,
  is_shared_wealth_licensed BOOLEAN DEFAULT false,
  license_number TEXT,
  license_date DATE,
  applicant_role TEXT NOT NULL,
  applicant_position TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_companies
CREATE POLICY "Users can view their own company associations" ON public.user_companies 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own company associations" ON public.user_companies 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own company associations" ON public.user_companies 
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own company associations" ON public.user_companies 
  FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for network_companies
CREATE POLICY "Public can view active network companies" ON public.network_companies 
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage network companies" ON public.network_companies 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for company_applications
CREATE POLICY "Users can view their own applications" ON public.company_applications 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own applications" ON public.company_applications 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all applications" ON public.company_applications 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update applications" ON public.company_applications 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_user_companies_user_id ON public.user_companies(user_id);
CREATE INDEX idx_user_companies_company_id ON public.user_companies(company_id);
CREATE INDEX idx_network_companies_status ON public.network_companies(status);
CREATE INDEX idx_company_applications_status ON public.company_applications(status);
CREATE INDEX idx_company_applications_user_id ON public.company_applications(user_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_companies_updated_at 
  BEFORE UPDATE ON public.user_companies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_companies_updated_at 
  BEFORE UPDATE ON public.network_companies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_applications_updated_at 
  BEFORE UPDATE ON public.company_applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 