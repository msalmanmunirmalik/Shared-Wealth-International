-- Simple Admin System Migration for Shared Wealth International
-- This migration creates basic admin tables step by step

-- Step 1: Create the admin role type (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role_type') THEN
        CREATE TYPE admin_role_type AS ENUM ('superadmin', 'admin', 'moderator', 'support');
    END IF;
END $$;

-- Step 2: Create admin_users table (basic version)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role admin_role_type NOT NULL DEFAULT 'admin',
  permissions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 3: Create admin_permissions table
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_key TEXT NOT NULL UNIQUE,
  permission_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 4: Create admin_activity_log table
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 5: Create admin_dashboard_settings table
CREATE TABLE IF NOT EXISTS public.admin_dashboard_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  dashboard_config JSONB NOT NULL DEFAULT '{}',
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 6: Insert basic permissions (only essential ones)
INSERT INTO public.admin_permissions (permission_key, permission_name, description, category) VALUES
('users.view', 'View Users', 'Can view user accounts and profiles', 'user_management'),
('companies.view', 'View Companies', 'Can view company applications and profiles', 'company_management'),
('companies.approve', 'Approve Companies', 'Can approve company applications', 'company_management'),
('content.view', 'View Content', 'Can view all platform content', 'content_management'),
('system.view', 'View System', 'Can view system settings and logs', 'system_management')
ON CONFLICT (permission_key) DO NOTHING;

-- Step 7: Create basic indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- Step 8: Enable RLS (basic)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_dashboard_settings ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS policies (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Basic admin access" ON public.admin_users;
CREATE POLICY "Basic admin access" ON public.admin_users
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Step 10: Create basic function
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Create superadmin function
CREATE OR REPLACE FUNCTION is_superadmin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid AND role = 'superadmin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
