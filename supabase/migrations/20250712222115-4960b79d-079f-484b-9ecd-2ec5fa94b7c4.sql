-- Create admin users table for role management
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_super_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create content sections table for managing website content
CREATE TABLE public.content_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create directors table for managing director profiles
CREATE TABLE public.directors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create partners table for managing partnerships/networks
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.directors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = is_admin.user_id
  );
$$;

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin users" 
ON public.admin_users FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin users" 
ON public.admin_users FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND is_super_admin = true
  )
);

-- RLS Policies for content_sections
CREATE POLICY "Anyone can view content sections" 
ON public.content_sections FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage content sections" 
ON public.content_sections FOR ALL 
USING (public.is_admin(auth.uid()));

-- RLS Policies for directors
CREATE POLICY "Anyone can view active directors" 
ON public.directors FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage directors" 
ON public.directors FOR ALL 
USING (public.is_admin(auth.uid()));

-- RLS Policies for partners
CREATE POLICY "Anyone can view active partners" 
ON public.partners FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage partners" 
ON public.partners FOR ALL 
USING (public.is_admin(auth.uid()));

-- Insert default content sections
INSERT INTO public.content_sections (section_key, title, content) VALUES
('hero', 'Hero Section', '{
  "title": "Shared Wealth International",
  "subtitle": "Empowering Communities Through Sustainable Development",
  "description": "We are committed to creating lasting positive change through innovative partnerships and sustainable development initiatives."
}'),
('about', 'About Section', '{
  "title": "About Us",
  "mission": "Our mission is to foster economic empowerment and sustainable development across communities worldwide.",
  "vision": "A world where every community has access to the resources and opportunities needed for prosperity.",
  "values": ["Integrity", "Sustainability", "Innovation", "Community Focus"]
}'),
('contact', 'Contact Information', '{
  "email": "info@sharedwealthintl.org",
  "phone": "+1 (555) 123-4567",
  "address": "123 Global Development Ave, Suite 100, International City, IC 12345"
}');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_sections_updated_at
  BEFORE UPDATE ON public.content_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_directors_updated_at
  BEFORE UPDATE ON public.directors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();