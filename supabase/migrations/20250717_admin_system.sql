-- Ultra-safe Admin System Migration for Shared Wealth International
-- This migration works with existing admin functions and doesn't break anything

-- Step 1: Create admin role type only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role_type') THEN
        CREATE TYPE admin_role_type AS ENUM ('superadmin', 'admin', 'moderator', 'support');
    END IF;
END $$;

-- Step 2: Create admin tables only if they don't exist
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

CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_key TEXT NOT NULL UNIQUE,
  permission_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS public.admin_dashboard_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  dashboard_config JSONB NOT NULL DEFAULT '{}',
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 3: Insert permissions only if they don't exist
INSERT INTO public.admin_permissions (permission_key, permission_name, description, category) VALUES
('users.view', 'View Users', 'Can view user accounts and profiles', 'user_management'),
('companies.view', 'View Companies', 'Can view company applications and profiles', 'company_management'),
('companies.approve', 'Approve Companies', 'Can approve company applications', 'company_management'),
('content.view', 'View Content', 'Can view all platform content', 'content_management'),
('system.view', 'View System', 'Can view system settings and logs', 'system_management')
ON CONFLICT (permission_key) DO NOTHING;

-- Step 4: Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- Step 5: Enable RLS only if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admin_users' AND rowsecurity = true) THEN
        ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admin_permissions' AND rowsecurity = true) THEN
        ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admin_activity_log' AND rowsecurity = true) THEN
        ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'admin_dashboard_settings' AND rowsecurity = true) THEN
        ALTER TABLE public.admin_dashboard_settings ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Step 6: Create policies only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_users' AND policyname = 'Basic admin access') THEN
        CREATE POLICY "Basic admin access" ON public.admin_users
          FOR SELECT USING (auth.uid() IS NOT NULL);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_permissions' AND policyname = 'View permissions') THEN
        CREATE POLICY "View permissions" ON public.admin_permissions
          FOR SELECT USING (auth.uid() IS NOT NULL);
    END IF;
END $$;

-- Step 7: Create additional helper functions with unique names (won't conflict with existing ones)
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

-- Step 8: Create activity logging function
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

-- Step 9: Add some sample data for testing (optional)
-- You can comment this out if you don't want sample data
INSERT INTO public.admin_users (user_id, role, permissions, is_active) VALUES
(
  '00000000-0000-0000-0000-000000000000', -- Placeholder UUID - replace with actual user ID
  'superadmin',
  '{"users.view": true, "companies.view": true, "companies.approve": true, "content.view": true, "system.view": true}',
  true
) ON CONFLICT DO NOTHING;
