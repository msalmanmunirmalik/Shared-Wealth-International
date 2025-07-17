-- Secure Admin System Migration
-- This migration adds secure admin invitation system and audit logging

-- Create admin invitations table
CREATE TABLE public.admin_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin audit log table
CREATE TABLE public.admin_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_invitations
CREATE POLICY "Super admins can manage invitations" 
ON public.admin_invitations FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND is_super_admin = true
  )
);

CREATE POLICY "Invited users can view their invitation" 
ON public.admin_invitations FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- RLS Policies for admin_audit_log
CREATE POLICY "Admins can view audit log" 
ON public.admin_audit_log FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit log" 
ON public.admin_audit_log FOR INSERT 
WITH CHECK (true);

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action TEXT,
  resource_type TEXT,
  resource_id TEXT DEFAULT NULL,
  details JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    details
  )
  SELECT 
    au.id,
    action,
    resource_type,
    resource_id,
    details
  FROM public.admin_users au
  WHERE au.user_id = auth.uid();
END;
$$;

-- Create function to validate admin invitation
CREATE OR REPLACE FUNCTION public.validate_admin_invitation(invitation_token TEXT)
RETURNS TABLE(
  is_valid BOOLEAN,
  email TEXT,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_record RECORD;
BEGIN
  -- Get invitation details
  SELECT * INTO invitation_record
  FROM public.admin_invitations
  WHERE token = invitation_token;

  -- Check if invitation exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, '', 'Invalid invitation token';
    RETURN;
  END IF;

  -- Check if invitation is already used
  IF invitation_record.is_used THEN
    RETURN QUERY SELECT false, invitation_record.email, 'Invitation already used';
    RETURN;
  END IF;

  -- Check if invitation has expired
  IF invitation_record.expires_at < NOW() THEN
    RETURN QUERY SELECT false, invitation_record.email, 'Invitation has expired';
    RETURN;
  END IF;

  -- Return valid invitation
  RETURN QUERY SELECT true, invitation_record.email, '';
END;
$$;

-- Create function to accept admin invitation
CREATE OR REPLACE FUNCTION public.accept_admin_invitation(invitation_token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_record RECORD;
BEGIN
  -- Get invitation details
  SELECT * INTO invitation_record
  FROM public.admin_invitations
  WHERE token = invitation_token;

  -- Check if invitation exists and is valid
  IF NOT FOUND OR invitation_record.is_used OR invitation_record.expires_at < NOW() THEN
    RETURN false;
  END IF;

  -- Mark invitation as used
  UPDATE public.admin_invitations
  SET is_used = true, used_at = NOW(), used_by = auth.uid()
  WHERE token = invitation_token;

  -- Create admin user
  INSERT INTO public.admin_users (user_id, email, is_super_admin)
  VALUES (auth.uid(), invitation_record.email, false);

  -- Log the action
  PERFORM public.log_admin_action(
    'admin_invitation_accepted',
    'admin_invitation',
    invitation_token,
    jsonb_build_object('invited_email', invitation_record.email)
  );

  RETURN true;
END;
$$;

-- Create triggers for audit logging
CREATE OR REPLACE FUNCTION public.audit_admin_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_admin_action(
      'created',
      TG_TABLE_NAME,
      NEW.id::TEXT,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_admin_action(
      'updated',
      TG_TABLE_NAME,
      NEW.id::TEXT,
      jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_admin_action(
      'deleted',
      TG_TABLE_NAME,
      OLD.id::TEXT,
      to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create triggers for admin tables
CREATE TRIGGER audit_content_sections_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.content_sections
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_changes();

CREATE TRIGGER audit_directors_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.directors
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_changes();

CREATE TRIGGER audit_partners_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.audit_admin_changes();

-- Create function to get admin audit log
CREATE OR REPLACE FUNCTION public.get_admin_audit_log(
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
  id UUID,
  admin_email TEXT,
  action TEXT,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.id,
    au.email as admin_email,
    al.action,
    al.resource_type,
    al.resource_id,
    al.details,
    al.created_at
  FROM public.admin_audit_log al
  JOIN public.admin_users au ON al.admin_user_id = au.id
  WHERE al.created_at >= NOW() - INTERVAL '1 day' * days_back
  ORDER BY al.created_at DESC;
END;
$$;

-- Update existing admin_users table to add last_login tracking
ALTER TABLE public.admin_users 
ADD COLUMN last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN login_count INTEGER DEFAULT 0;

-- Create function to update admin login stats
CREATE OR REPLACE FUNCTION public.update_admin_login()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.admin_users
  SET last_login = NOW(), login_count = login_count + 1
  WHERE user_id = auth.uid();
  
  RETURN NEW;
END;
$$;

-- Create trigger for login tracking
CREATE TRIGGER track_admin_login
  AFTER INSERT ON public.admin_audit_log
  FOR EACH ROW
  WHEN (NEW.action = 'login')
  EXECUTE FUNCTION public.update_admin_login(); 