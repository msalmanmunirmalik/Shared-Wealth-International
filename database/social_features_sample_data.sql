-- Sample Data for Social Features (Phase 2)
-- This script populates the database with sample reactions, connections, and shares

-- Insert sample reactions for existing forum topics
WITH topic_mapping AS (
  SELECT id as topic_id, title
  FROM forum_topics
  WHERE title = 'Welcome to Shared Wealth International!'
),
user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('jane.smith@example.com', 'mike.johnson@example.com', 'sarah.wilson@example.com', 'david.brown@example.com', 'lisa.davis@example.com')
)
INSERT INTO post_reactions (post_id, post_type, user_id, reaction_type)
SELECT 
  t.topic_id, 'forum_topic', u.user_id, 'like'
FROM topic_mapping t, user_mapping u WHERE u.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  t.topic_id, 'forum_topic', u.user_id, 'love'
FROM topic_mapping t, user_mapping u WHERE u.email = 'mike.johnson@example.com'
UNION ALL
SELECT 
  t.topic_id, 'forum_topic', u.user_id, 'like'
FROM topic_mapping t, user_mapping u WHERE u.email = 'sarah.wilson@example.com'
UNION ALL
SELECT 
  t.topic_id, 'forum_topic', u.user_id, 'wow'
FROM topic_mapping t, user_mapping u WHERE u.email = 'david.brown@example.com'
UNION ALL
SELECT 
  t.topic_id, 'forum_topic', u.user_id, 'like'
FROM topic_mapping t, user_mapping u WHERE u.email = 'lisa.davis@example.com';

-- Insert additional user connections (following relationships)
WITH user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com', 'sarah.wilson@example.com', 'david.brown@example.com', 'lisa.davis@example.com')
)
INSERT INTO user_connections (follower_id, following_id, connection_type, status)
SELECT 
  f.user_id, fo.user_id, 'follow', 'active'
FROM user_mapping f, user_mapping fo WHERE f.email = 'mike.johnson@example.com' AND fo.email = 'sarah.wilson@example.com'
UNION ALL
SELECT 
  f.user_id, fo.user_id, 'follow', 'active'
FROM user_mapping f, user_mapping fo WHERE f.email = 'sarah.wilson@example.com' AND fo.email = 'david.brown@example.com'
UNION ALL
SELECT 
  f.user_id, fo.user_id, 'colleague', 'active'
FROM user_mapping f, user_mapping fo WHERE f.email = 'david.brown@example.com' AND fo.email = 'lisa.davis@example.com'
UNION ALL
SELECT 
  f.user_id, fo.user_id, 'follow', 'active'
FROM user_mapping f, user_mapping fo WHERE f.email = 'lisa.davis@example.com' AND fo.email = 'john.doe@example.com'
UNION ALL
SELECT 
  f.user_id, fo.user_id, 'mentor', 'active'
FROM user_mapping f, user_mapping fo WHERE f.email = 'john.doe@example.com' AND fo.email = 'mike.johnson@example.com';

-- Insert sample content shares
WITH topic_mapping AS (
  SELECT id as topic_id, title
  FROM forum_topics
  WHERE title = 'Welcome to Shared Wealth International!'
),
user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('jane.smith@example.com', 'mike.johnson@example.com', 'sarah.wilson@example.com')
)
INSERT INTO content_shares (user_id, content_id, content_type, share_type, platform, message)
SELECT 
  u.user_id, t.topic_id, 'forum_topic', 'internal', 'platform', 'Great discussion! Sharing this with my network.'
FROM topic_mapping t, user_mapping u WHERE u.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  u.user_id, t.topic_id, 'forum_topic', 'linkedin', 'linkedin', 'Excited to be part of this community focused on shared wealth!'
FROM topic_mapping t, user_mapping u WHERE u.email = 'mike.johnson@example.com'
UNION ALL
SELECT 
  u.user_id, t.topic_id, 'forum_topic', 'twitter', 'twitter', 'Building a better future together! #SharedWealth #Community'
FROM topic_mapping t, user_mapping u WHERE u.email = 'sarah.wilson@example.com';

-- Insert sample shares for events
WITH event_mapping AS (
  SELECT id as event_id, title
  FROM events
  WHERE title = 'Shared Wealth Principles Workshop'
),
user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('john.doe@example.com', 'david.brown@example.com')
)
INSERT INTO content_shares (user_id, content_id, content_type, share_type, platform, message)
SELECT 
  u.user_id, e.event_id, 'event', 'internal', 'platform', 'This workshop looks amazing!'
FROM event_mapping e, user_mapping u WHERE u.email = 'john.doe@example.com'
UNION ALL
SELECT 
  u.user_id, e.event_id, 'event', 'facebook', 'facebook', 'Can''t wait to learn more about shared wealth principles!'
FROM event_mapping e, user_mapping u WHERE u.email = 'david.brown@example.com';

-- Insert sample shares for projects
WITH project_mapping AS (
  SELECT id as project_id, name
  FROM projects
  WHERE name = 'Solar Panel Installation Initiative'
),
user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('jane.smith@example.com', 'mike.johnson@example.com')
)
INSERT INTO content_shares (user_id, content_id, content_type, share_type, platform, message)
SELECT 
  u.user_id, p.project_id, 'project', 'internal', 'platform', 'Excited to be part of this sustainable energy project!'
FROM project_mapping p, user_mapping u WHERE u.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  u.user_id, p.project_id, 'project', 'linkedin', 'linkedin', 'Proud to support renewable energy initiatives that benefit communities!'
FROM project_mapping p, user_mapping u WHERE u.email = 'mike.johnson@example.com';
