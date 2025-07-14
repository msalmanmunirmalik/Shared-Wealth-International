-- Create user roles enum and table for founding members and media managers
CREATE TYPE public.user_role AS ENUM ('admin', 'founding_member', 'media_manager', 'member');

-- Create user profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'member',
  bio TEXT,
  avatar_url TEXT,
  company_name TEXT,
  position TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" 
ON public.profiles FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE user_id = auth.uid()
));

-- Create news/updates table for founding members and media managers
CREATE TABLE public.news_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  category TEXT DEFAULT 'general',
  tags TEXT[],
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on news_updates
ALTER TABLE public.news_updates ENABLE ROW LEVEL SECURITY;

-- Create policies for news_updates
CREATE POLICY "Published news is viewable by everyone" 
ON public.news_updates FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authors can manage their own news" 
ON public.news_updates FOR ALL 
USING (auth.uid() = author_id);

CREATE POLICY "Founding members and media managers can create news" 
ON public.news_updates FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('founding_member', 'media_manager', 'admin')
  )
);

CREATE POLICY "Admins can manage all news" 
ON public.news_updates FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE user_id = auth.uid()
));

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for news_updates updated_at
CREATE TRIGGER update_news_updates_updated_at
BEFORE UPDATE ON public.news_updates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup and create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update admin_users table to reference profiles instead of random UUIDs
ALTER TABLE public.admin_users 
DROP CONSTRAINT IF EXISTS admin_users_user_id_fkey;

ALTER TABLE public.admin_users 
ADD CONSTRAINT admin_users_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Function to easily promote user to admin (for initial setup)
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT, is_super BOOLEAN DEFAULT false)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_rec RECORD;
BEGIN
  -- Find user by email
  SELECT au.id, au.email INTO user_rec
  FROM auth.users au
  WHERE au.email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Insert into admin_users if not already exists
  INSERT INTO public.admin_users (user_id, email, is_super_admin)
  VALUES (user_rec.id, user_rec.email, is_super)
  ON CONFLICT (user_id) DO UPDATE SET 
    is_super_admin = EXCLUDED.is_super_admin;
    
  -- Update profile role to admin
  UPDATE public.profiles 
  SET role = 'admin'
  WHERE id = user_rec.id;
END;
$$;