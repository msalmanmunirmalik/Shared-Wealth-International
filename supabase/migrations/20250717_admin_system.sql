-- Clean Admin System Migration for Shared Wealth International
-- This migration handles existing objects and creates a clean admin system

-- Step 1: Clean up any existing admin functions to avoid conflicts
DROP FUNCTION IF EXISTS is_admin(uuid);
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_superadmin(uuid);
DROP FUNCTION IF EXISTS is_superadmin();
DROP FUNCTION IF EXISTS has_permission(text, uuid);
DROP FUNCTION IF EXISTS has_permission(text);
DROP FUNCTION IF EXISTS log_admin_activity(uuid, text, text, uuid, jsonb, inet, text);

-- Step 2: Clean up any existing admin tables to start fresh
DROP TABLE IF EXISTS public.admin_dashboard_settings CASCADE;
DROP TABLE IF EXISTS public.admin_activity_log CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.admin_permissions CASCADE;

-- Step 3: Clean up any existing admin role type
DROP TYPE IF EXISTS admin_role_type CASCADE;

-- Step 4: Create the admin role type
CREATE TYPE admin_role_type AS ENUM ('superadmin', 'admin', 'moderator', 'support');

-- Step 5: Create admin_users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role admin_role_type NOT NULL DEFAULT 'admin',
  permissions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 6: Create admin_permissions table
CREATE TABLE public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_key TEXT NOT NULL UNIQUE,
  permission_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 7: Create admin_activity_log table
CREATE TABLE public.admin_activity_log (
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

-- Step 8: Create admin_dashboard_settings table
CREATE TABLE public.admin_dashboard_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  dashboard_config JSONB NOT NULL DEFAULT '{}',
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 9: Insert basic permissions
INSERT INTO public.admin_permissions (permission_key, permission_name, description, category) VALUES
('users.view', 'View Users', 'Can view user accounts and profiles', 'user_management'),
('companies.view', 'View Companies', 'Can view company applications and profiles', 'company_management'),
('companies.approve', 'Approve Companies', 'Can approve company applications', 'company_management'),
('content.view', 'View Content', 'Can view all platform content', 'content_management'),
('system.view', 'View System', 'Can view system settings and logs', 'system_management');

-- Step 10: Create basic indexes
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_admin_users_role ON public.admin_users(role);

-- Step 11: Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_dashboard_settings ENABLE ROW LEVEL SECURITY;

-- Step 12: Create RLS policies
CREATE POLICY "Basic admin access" ON public.admin_users
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "View permissions" ON public.admin_permissions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Step 13: Create helper functions with unique names to avoid conflicts
CREATE OR REPLACE FUNCTION check_is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_is_superadmin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid AND role = 'superadmin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 14: Create a simple activity logging function
CREATE OR REPLACE FUNCTION log_admin_action(
  admin_user_uuid UUID,
  action_text TEXT,
  entity_type_param TEXT DEFAULT NULL,
  entity_id_param UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.admin_activity_log (
    admin_user_id,
    action,
    entity_type,
    entity_id
  ) VALUES (
    admin_user_uuid,
    action_text,
    entity_type_param,
    entity_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 15: Add some sample data for testing (optional)
-- You can comment this out if you don't want sample data
INSERT INTO public.admin_users (user_id, role, permissions, is_active) VALUES
(
  '00000000-0000-0000-0000-000000000000', -- Placeholder UUID - replace with actual user ID
  'superadmin',
  '{"users.view": true, "companies.view": true, "companies.approve": true, "content.view": true, "system.view": true}',
  true
) ON CONFLICT DO NOTHING;
