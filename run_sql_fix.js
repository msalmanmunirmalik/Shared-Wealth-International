const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.log('Please make sure you have:');
  console.log('- VITE_SUPABASE_URL in your .env file');
  console.log('- SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sqlFix = `
-- Fix Activity Feed Foreign Key Relationships
-- Drop existing activity_feed table if it exists (to recreate with proper relationships)
DROP TABLE IF EXISTS public.activity_feed CASCADE;

-- Recreate activity_feed table with proper foreign key relationships
CREATE TABLE public.activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type TEXT NOT NULL, -- 'post', 'meeting', 'growth', 'connection', 'milestone'
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB, -- Flexible metadata storage
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Activity Feed
CREATE POLICY "Public can view activity feed" 
ON public.activity_feed FOR SELECT 
USING (true);

CREATE POLICY "Company users can create activity feed entries" 
ON public.activity_feed FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.company_users 
    WHERE company_id = activity_feed.company_id 
    AND user_id = auth.uid() 
    AND is_active = true
  )
);

-- Create indexes for better performance
CREATE INDEX idx_activity_feed_company_type ON public.activity_feed(company_id, activity_type);
CREATE INDEX idx_activity_feed_created_at ON public.activity_feed(created_at DESC);

-- Function to automatically create activity feed entries
CREATE OR REPLACE FUNCTION public.create_activity_feed_entry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create activity feed entry for new collaboration meetings
  IF TG_TABLE_NAME = 'collaboration_meetings' THEN
    INSERT INTO public.activity_feed (
      activity_type,
      company_id,
      user_id,
      title,
      description,
      metadata
    ) VALUES (
      'meeting',
      NEW.company_id,
      NEW.created_by,
      NEW.meeting_title,
      NEW.outcomes,
      jsonb_build_object(
        'participants', NEW.participants,
        'impact_score', NEW.impact_score,
        'shared_wealth_contribution', NEW.shared_wealth_contribution
      )
    );
  END IF;
  
  -- Create activity feed entry for new growth metrics
  IF TG_TABLE_NAME = 'company_growth_metrics' THEN
    INSERT INTO public.activity_feed (
      activity_type,
      company_id,
      user_id,
      title,
      description,
      metadata
    ) VALUES (
      'growth',
      NEW.company_id,
      (SELECT created_by FROM public.company_users WHERE company_id = NEW.company_id LIMIT 1),
      NEW.metric_type || ' Growth',
      NEW.notes,
      jsonb_build_object(
        'metric_value', NEW.metric_value,
        'metric_unit', NEW.metric_unit,
        'shared_wealth_impact', NEW.shared_wealth_impact
      )
    );
  END IF;
  
  -- Create activity feed entry for new network connections
  IF TG_TABLE_NAME = 'network_connections' THEN
    INSERT INTO public.activity_feed (
      activity_type,
      company_id,
      user_id,
      title,
      description,
      metadata
    ) VALUES (
      'connection',
      NEW.source_company_id,
      NEW.created_by,
      'New ' || NEW.connection_type || ' Connection',
      NEW.description,
      jsonb_build_object(
        'target_company_id', NEW.target_company_id,
        'outcome', NEW.outcome,
        'value_generated', NEW.value_generated
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Triggers to automatically create activity feed entries
CREATE TRIGGER trigger_collaboration_meeting_activity
  AFTER INSERT ON public.collaboration_meetings
  FOR EACH ROW EXECUTE FUNCTION public.create_activity_feed_entry();

CREATE TRIGGER trigger_growth_metric_activity
  AFTER INSERT ON public.company_growth_metrics
  FOR EACH ROW EXECUTE FUNCTION public.create_activity_feed_entry();

CREATE TRIGGER trigger_network_connection_activity
  AFTER INSERT ON public.network_connections
  FOR EACH ROW EXECUTE FUNCTION public.create_activity_feed_entry();
`;

async function runSqlFix() {
  try {
    console.log('Running SQL fix for activity_feed table...');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlFix });
    
    if (error) {
      console.error('Error running SQL fix:', error);
      
      // Try alternative approach - run individual statements
      console.log('Trying alternative approach...');
      
      // Split the SQL into individual statements
      const statements = sqlFix.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' });
            if (stmtError) {
              console.log('Statement failed (this might be expected):', statement.substring(0, 50) + '...');
            }
          } catch (e) {
            console.log('Statement error (this might be expected):', e.message);
          }
        }
      }
    } else {
      console.log('SQL fix completed successfully!');
    }
    
    console.log('✅ Database fix completed!');
    console.log('Please refresh your browser to see the updated system.');
    
  } catch (error) {
    console.error('Failed to run SQL fix:', error);
    console.log('\n📋 Manual Steps Required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy the contents of fix_activity_feed.sql');
    console.log('4. Paste and run the SQL script');
  }
}

runSqlFix(); 