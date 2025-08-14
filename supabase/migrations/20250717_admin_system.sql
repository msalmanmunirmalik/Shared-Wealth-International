-- Admin System Migration for Shared Wealth International
-- This migration creates the complete admin hierarchy and management system

-- 1. Admin Roles and Permissions System
CREATE TYPE admin_role_type AS ENUM ('superadmin', 'admin', 'moderator', 'support');

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role admin_role_type NOT NULL DEFAULT 'admin',
  permissions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- 2. Admin Permissions Configuration
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_key TEXT NOT NULL UNIQUE,
  permission_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Admin Activity Log
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Admin Dashboard Settings
CREATE TABLE IF NOT EXISTS public.admin_dashboard_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  dashboard_config JSONB NOT NULL DEFAULT '{}',
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(admin_user_id)
);

-- Insert default admin permissions
INSERT INTO public.admin_permissions (permission_key, permission_name, description, category) VALUES
-- User Management
('users.view', 'View Users', 'Can view user accounts and profiles', 'user_management'),
('users.edit', 'Edit Users', 'Can edit user account details', 'user_management'),
('users.delete', 'Delete Users', 'Can delete user accounts', 'user_management'),
('users.suspend', 'Suspend Users', 'Can suspend user accounts', 'user_management'),
('users.activate', 'Activate Users', 'Can reactivate suspended accounts', 'user_management'),

-- Company Management
('companies.view', 'View Companies', 'Can view company applications and profiles', 'company_management'),
('companies.approve', 'Approve Companies', 'Can approve company applications', 'company_management'),
('companies.reject', 'Reject Companies', 'Can reject company applications', 'company_management'),
('companies.edit', 'Edit Companies', 'Can edit company information', 'company_management'),
('companies.suspend', 'Suspend Companies', 'Can suspend company accounts', 'company_management'),
('companies.delete', 'Delete Companies', 'Can delete company accounts', 'company_management'),

-- Content Management
('content.view', 'View Content', 'Can view all platform content', 'content_management'),
('content.create', 'Create Content', 'Can create new content', 'content_management'),
('content.edit', 'Edit Content', 'Can edit existing content', 'content_management'),
('content.delete', 'Delete Content', 'Can delete content', 'content_management'),
('content.publish', 'Publish Content', 'Can publish/unpublish content', 'content_management'),

-- Funding Management
('funding.view', 'View Funding', 'Can view funding opportunities and applications', 'funding_management'),
('funding.approve', 'Approve Funding', 'Can approve funding opportunities', 'funding_management'),
('funding.reject', 'Reject Funding', 'Can reject funding opportunities', 'funding_management'),
('funding.edit', 'Edit Funding', 'Can edit funding details', 'funding_management'),

-- Learning Management
('learning.view', 'View Learning', 'Can view learning resources', 'learning_management'),
('learning.create', 'Create Learning', 'Can create learning resources', 'learning_management'),
('learning.edit', 'Edit Learning', 'Can edit learning resources', 'learning_management'),
('learning.delete', 'Delete Learning', 'Can delete learning resources', 'learning_management'),

-- Forum Management
('forum.view', 'View Forum', 'Can view forum discussions', 'forum_management'),
('forum.moderate', 'Moderate Forum', 'Can moderate forum content', 'forum_management'),
('forum.delete', 'Delete Forum', 'Can delete forum posts', 'forum_management'),
('forum.ban', 'Ban Users', 'Can ban users from forum', 'forum_management'),

-- System Management
('system.view', 'View System', 'Can view system settings and logs', 'system_management'),
('system.edit', 'Edit System', 'Can edit system settings', 'system_management'),
('system.logs', 'View Logs', 'Can view system logs', 'system_management'),
('system.backup', 'System Backup', 'Can perform system backups', 'system_management'),

-- Admin Management
('admin.view', 'View Admins', 'Can view admin users', 'admin_management'),
('admin.create', 'Create Admins', 'Can create new admin users', 'admin_management'),
('admin.edit', 'Edit Admins', 'Can edit admin permissions', 'admin_management'),
('admin.delete', 'Delete Admins', 'Can delete admin users', 'admin_management'),

-- Analytics and Reports
('analytics.view', 'View Analytics', 'Can view platform analytics', 'analytics'),
('reports.generate', 'Generate Reports', 'Can generate system reports', 'analytics'),
('reports.export', 'Export Reports', 'Can export report data', 'analytics');

-- Create default superadmin user (you'll need to replace with actual user ID)
-- This will be created when you run the setup script

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_dashboard_settings ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_admin_users_role ON public.admin_users(role);
CREATE INDEX idx_admin_activity_log_admin_user_id ON public.admin_activity_log(admin_user_id);
CREATE INDEX idx_admin_activity_log_created_at ON public.admin_activity_log(created_at);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON public.admin_users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_dashboard_settings_updated_at 
  BEFORE UPDATE ON public.admin_dashboard_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for Admin Users
CREATE POLICY "Admin users can view their own profile" ON public.admin_users
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can view all admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );

CREATE POLICY "Superadmins can manage admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );

-- RLS Policies for Admin Permissions
CREATE POLICY "All authenticated users can view permissions" ON public.admin_permissions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for Admin Activity Log
CREATE POLICY "Admins can view their own activity" ON public.admin_activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND id = admin_user_id
    )
  );

CREATE POLICY "Superadmins can view all activity" ON public.admin_activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );

-- RLS Policies for Admin Dashboard Settings
CREATE POLICY "Admins can manage their own dashboard" ON public.admin_dashboard_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND id = admin_user_id
    )
  );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is superadmin
CREATE OR REPLACE FUNCTION is_superadmin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid AND role = 'superadmin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific permission
CREATE OR REPLACE FUNCTION has_permission(permission_key TEXT, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = user_uuid 
    AND au.is_active = true
    AND (
      au.role = 'superadmin' 
      OR au.permissions ? permission_key
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
  admin_user_uuid UUID,
  action_text TEXT,
  entity_type_param TEXT DEFAULT NULL,
  entity_id_param UUID DEFAULT NULL,
  details_param JSONB DEFAULT NULL,
  ip_address_param INET DEFAULT NULL,
  user_agent_param TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.admin_activity_log (
    admin_user_id,
    action,
    entity_type,
    entity_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    admin_user_uuid,
    action_text,
    entity_type_param,
    entity_id_param,
    details_param,
    ip_address_param,
    user_agent_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
