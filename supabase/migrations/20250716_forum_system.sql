-- Forum System Migration
-- This migration creates the forum tables for community discussions

-- 1. Forum Topics Table
CREATE TABLE public.forum_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'business', 'technology', 'sustainability', 'events')),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false
);

-- 2. Forum Replies Table
CREATE TABLE public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.forum_topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_solution BOOLEAN DEFAULT false
);

-- 3. Events Table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  event_type TEXT NOT NULL DEFAULT 'workshop' CHECK (event_type IN ('workshop', 'conference', 'meetup', 'webinar')),
  is_virtual BOOLEAN DEFAULT false,
  virtual_link TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled'))
);

-- 4. Event Participants Table
CREATE TABLE public.event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forum_topics
CREATE POLICY "Anyone can view forum topics" 
ON public.forum_topics FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create topics" 
ON public.forum_topics FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their own topics" 
ON public.forum_topics FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own topics" 
ON public.forum_topics FOR DELETE 
USING (auth.uid() = author_id);

-- RLS Policies for forum_replies
CREATE POLICY "Anyone can view forum replies" 
ON public.forum_replies FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create replies" 
ON public.forum_replies FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their own replies" 
ON public.forum_replies FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own replies" 
ON public.forum_replies FOR DELETE 
USING (auth.uid() = author_id);

-- RLS Policies for events
CREATE POLICY "Anyone can view events" 
ON public.events FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create events" 
ON public.events FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Event creators can update their events" 
ON public.events FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Event creators can delete their events" 
ON public.events FOR DELETE 
USING (auth.uid() = created_by);

-- RLS Policies for event_participants
CREATE POLICY "Anyone can view event participants" 
ON public.event_participants FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can join events" 
ON public.event_participants FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can leave events" 
ON public.event_participants FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_forum_topics_category ON public.forum_topics(category);
CREATE INDEX idx_forum_topics_author ON public.forum_topics(author_id);
CREATE INDEX idx_forum_topics_created ON public.forum_topics(created_at);
CREATE INDEX idx_forum_replies_topic ON public.forum_replies(topic_id);
CREATE INDEX idx_forum_replies_author ON public.forum_replies(author_id);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_created_by ON public.events(created_by);
CREATE INDEX idx_events_company ON public.events(company_id);
CREATE INDEX idx_event_participants_event ON public.event_participants(event_id);
CREATE INDEX idx_event_participants_user ON public.event_participants(user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_forum_topics_updated_at
  BEFORE UPDATE ON public.forum_topics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at
  BEFORE UPDATE ON public.forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update reply count
CREATE OR REPLACE FUNCTION public.update_topic_reply_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_topics 
    SET reply_count = reply_count + 1 
    WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_topics 
    SET reply_count = reply_count - 1 
    WHERE id = OLD.topic_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for reply count updates
CREATE TRIGGER update_topic_reply_count_trigger
  AFTER INSERT OR DELETE ON public.forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_topic_reply_count();

-- Create function to update event participant count
CREATE OR REPLACE FUNCTION public.update_event_participant_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.events 
    SET current_participants = current_participants + 1 
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.events 
    SET current_participants = current_participants - 1 
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for participant count updates
CREATE TRIGGER update_event_participant_count_trigger
  AFTER INSERT OR DELETE ON public.event_participants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_event_participant_count();

-- Update profiles table to add missing fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT;

-- Create function to handle event status updates
CREATE OR REPLACE FUNCTION public.update_event_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update status based on current time
  IF NEW.start_date <= NOW() AND NEW.end_date >= NOW() THEN
    NEW.status = 'ongoing';
  ELSIF NEW.end_date < NOW() THEN
    NEW.status = 'completed';
  ELSE
    NEW.status = 'upcoming';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic event status updates
CREATE TRIGGER update_event_status_trigger
  BEFORE INSERT OR UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_event_status(); 