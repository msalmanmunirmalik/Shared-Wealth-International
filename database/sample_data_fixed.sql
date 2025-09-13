-- Corrected Sample Data Population Script
-- This script populates the database with data that matches the actual schema

-- Insert sample projects (fixing date format)
WITH company_mapping AS (
  SELECT c.id as company_id, c.name
  FROM companies c
  WHERE c.name IN ('GreenEnergy Corp', 'Sustainable Foods Co', 'CommunityFirst Bank', 'SocialImpact Ventures')
),
user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('jane.smith@example.com', 'david.brown@example.com', 'sarah.wilson@example.com', 'mike.johnson@example.com')
)
INSERT INTO projects (name, description, company_id, project_type, status, start_date, end_date, budget, currency, participants, project_manager_id, created_by)
SELECT 
  'Solar Panel Installation Initiative', 'Large-scale solar panel installation project for residential communities', c.company_id, 'collaboration', 'active', '2024-01-01'::date, '2024-12-31'::date, 2500000.00, 'USD', ARRAY['GreenEnergy Corp', 'EcoTech Solutions', 'CommunityFirst Bank'], u.user_id, u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'GreenEnergy Corp' AND u.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  'Sustainable Agriculture Research', 'Research project on sustainable farming practices and community impact', c.company_id, 'research', 'active', '2024-02-01'::date, '2024-11-30'::date, 500000.00, 'USD', ARRAY['Sustainable Foods Co', 'TechForGood Inc'], u.user_id, u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'Sustainable Foods Co' AND u.email = 'david.brown@example.com'
UNION ALL
SELECT 
  'Community Banking Innovation', 'Development of new community-focused banking products', c.company_id, 'development', 'planning', '2024-03-01'::date, '2024-10-31'::date, 750000.00, 'USD', ARRAY['CommunityFirst Bank', 'SocialImpact Ventures'], u.user_id, u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'CommunityFirst Bank' AND u.email = 'sarah.wilson@example.com'
UNION ALL
SELECT 
  'Impact Investment Platform', 'Technology platform for impact investment management', c.company_id, 'development', 'completed', '2023-06-01'::date, '2024-01-31'::date, 1200000.00, 'USD', ARRAY['SocialImpact Ventures', 'TechForGood Inc'], u.user_id, u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'SocialImpact Ventures' AND u.email = 'mike.johnson@example.com'
ON CONFLICT (name) DO NOTHING;

-- Insert sample collaboration meetings (fixing timestamp format)
WITH company_mapping AS (
  SELECT c.id as company_id, c.name
  FROM companies c
  WHERE c.name IN ('GreenEnergy Corp', 'SocialImpact Ventures', 'Sustainable Foods Co')
),
user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('jane.smith@example.com', 'mike.johnson@example.com', 'david.brown@example.com')
)
INSERT INTO collaboration_meetings (company_id, meeting_title, meeting_date, participants, meeting_notes, outcomes, impact_score, shared_wealth_contribution, meeting_type, created_by)
SELECT 
  c.company_id, 'Solar Panel Partnership Discussion', '2024-01-15 14:00:00'::timestamp, ARRAY['John Doe (EcoTech)', 'Jane Smith (GreenEnergy)', 'Mike Johnson (SocialImpact)'], 'Discussed partnership opportunities for solar panel installation project', 'Agreed to collaborate on community solar initiatives with 20% profit sharing', 8, 'Facilitated partnership that will benefit 3 communities', 'collaboration', u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'GreenEnergy Corp' AND u.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  c.company_id, 'Impact Investment Strategy Session', '2024-01-20 10:00:00'::timestamp, ARRAY['Mike Johnson (SocialImpact)', 'Sarah Wilson (CommunityFirst)', 'David Brown (Sustainable Foods)'], 'Strategic planning for impact investment portfolio', 'Developed new investment criteria focusing on shared wealth principles', 9, 'Created framework for measuring social impact in investments', 'partnership', u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'SocialImpact Ventures' AND u.email = 'mike.johnson@example.com'
UNION ALL
SELECT 
  c.company_id, 'Sustainable Agriculture Workshop', '2024-02-05 09:00:00'::timestamp, ARRAY['David Brown (Sustainable Foods)', 'Lisa Davis (TechForGood)', 'Local Farmers Association'], 'Workshop on sustainable farming practices and community benefits', 'Established farmer training program with profit-sharing model', 7, 'Created educational program benefiting 50+ local farmers', 'mentoring', u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'Sustainable Foods Co' AND u.email = 'david.brown@example.com'
ON CONFLICT (meeting_title) DO NOTHING;

-- Insert sample forum topics (fixing schema - no last_reply_at column)
WITH category_mapping AS (
  SELECT id as category_id, name
  FROM forum_categories
  WHERE name IN ('General Discussion', 'Business & Strategy', 'Technology', 'Sustainability')
),
user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com', 'lisa.davis@example.com', 'david.brown@example.com')
)
INSERT INTO forum_topics (category_id, title, content, user_id, is_pinned, is_locked, view_count)
SELECT 
  c.category_id, 'Welcome to Shared Wealth International!', 'Welcome everyone to our community! This is a place where we can share ideas, collaborate, and work together to create shared wealth for all. Please introduce yourselves and let us know what brings you here.', u.user_id, true, false, 156
FROM category_mapping c, user_mapping u WHERE c.name = 'General Discussion' AND u.email = 'john.doe@example.com'
UNION ALL
SELECT 
  c.category_id, 'Best Practices for Measuring Social Impact', 'I''m working on implementing a social impact measurement framework for our tech startup. What metrics do you find most valuable for tracking progress?', u.user_id, false, false, 89
FROM category_mapping c, user_mapping u WHERE c.name = 'Business & Strategy' AND u.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  c.category_id, 'Technology Solutions for Community Development', 'How can we leverage technology to better serve our communities? I''d love to hear about successful tech implementations that have created positive social impact.', u.user_id, false, false, 67
FROM category_mapping c, user_mapping u WHERE c.name = 'Technology' AND u.email = 'lisa.davis@example.com'
UNION ALL
SELECT 
  c.category_id, 'Sustainable Business Models That Work', 'Share your experiences with sustainable business models. What approaches have you found most effective for balancing profit with social impact?', u.user_id, false, false, 134
FROM category_mapping c, user_mapping u WHERE c.name = 'Sustainability' AND u.email = 'david.brown@example.com'
ON CONFLICT (title) DO NOTHING;

-- Insert sample forum replies (fixing schema - no is_solution column)
WITH topic_mapping AS (
  SELECT id as topic_id, title
  FROM forum_topics
  WHERE title IN ('Welcome to Shared Wealth International!', 'Best Practices for Measuring Social Impact', 'Technology Solutions for Community Development', 'Sustainable Business Models That Work')
),
user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('mike.johnson@example.com', 'sarah.wilson@example.com', 'lisa.davis@example.com', 'john.doe@example.com')
)
INSERT INTO forum_replies (topic_id, content, user_id)
SELECT 
  t.topic_id, 'Thank you for the warm welcome! I''m excited to be part of this community and look forward to learning from everyone here.', u.user_id
FROM topic_mapping t, user_mapping u WHERE t.title = 'Welcome to Shared Wealth International!' AND u.email = 'mike.johnson@example.com'
UNION ALL
SELECT 
  t.topic_id, 'Great to be here! I''m passionate about creating positive social impact through business.', u.user_id
FROM topic_mapping t, user_mapping u WHERE t.title = 'Welcome to Shared Wealth International!' AND u.email = 'sarah.wilson@example.com'
UNION ALL
SELECT 
  t.topic_id, 'We use a combination of quantitative metrics (number of beneficiaries, revenue impact) and qualitative measures (community feedback, stakeholder satisfaction). The key is to track both short-term outputs and long-term outcomes.', u.user_id
FROM topic_mapping t, user_mapping u WHERE t.title = 'Best Practices for Measuring Social Impact' AND u.email = 'mike.johnson@example.com'
UNION ALL
SELECT 
  t.topic_id, 'Mobile apps for community health monitoring have been incredibly effective. We''ve seen 40% improvement in health outcomes in communities where we''ve implemented our solution.', u.user_id
FROM topic_mapping t, user_mapping u WHERE t.title = 'Technology Solutions for Community Development' AND u.email = 'lisa.davis@example.com'
UNION ALL
SELECT 
  t.topic_id, 'The B-Corp model has worked well for us. It provides a framework for balancing profit with purpose while maintaining accountability to stakeholders.', u.user_id
FROM topic_mapping t, user_mapping u WHERE t.title = 'Sustainable Business Models That Work' AND u.email = 'john.doe@example.com'
ON CONFLICT DO NOTHING;

-- Insert sample events (fixing schema - no registration_url column, using max_participants instead of capacity)
WITH user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com', 'sarah.wilson@example.com')
)
INSERT INTO events (title, description, location, start_date, end_date, max_participants, status)
SELECT 
  'Shared Wealth Principles Workshop', 'Learn about implementing shared wealth principles in your business', 'San Francisco, CA', '2024-02-15 09:00:00'::timestamp, '2024-02-15 17:00:00'::timestamp, 50, 'upcoming'
UNION ALL
SELECT 
  'Sustainability in Tech: Online Panel', 'Panel discussion on sustainable technology practices', 'Online', '2024-02-20 14:00:00'::timestamp, '2024-02-20 15:30:00'::timestamp, 200, 'upcoming'
UNION ALL
SELECT 
  'Community Banking Innovation Summit', 'Annual summit for community banking innovation', 'Portland, OR', '2024-03-10 08:00:00'::timestamp, '2024-03-12 18:00:00'::timestamp, 300, 'upcoming'
ON CONFLICT (title) DO NOTHING;

-- Insert sample activity feed entries (fixing schema - adding required title column)
WITH user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com', 'sarah.wilson@example.com', 'david.brown@example.com')
)
INSERT INTO activity_feed (user_id, title, activity_type)
SELECT user_id, 'Company Joined Network', 'company_joined' FROM user_mapping WHERE email = 'john.doe@example.com'
UNION ALL
SELECT user_id, 'New Project Started', 'project_started' FROM user_mapping WHERE email = 'jane.smith@example.com'
UNION ALL
SELECT user_id, 'Meeting Completed', 'meeting_completed' FROM user_mapping WHERE email = 'mike.johnson@example.com'
UNION ALL
SELECT user_id, 'Application Approved', 'application_approved' FROM user_mapping WHERE email = 'sarah.wilson@example.com'
UNION ALL
SELECT user_id, 'Forum Post Created', 'forum_post' FROM user_mapping WHERE email = 'david.brown@example.com'
ON CONFLICT DO NOTHING;

-- Insert sample messages (fixing timestamp format)
WITH user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com', 'sarah.wilson@example.com')
)
INSERT INTO messages (sender_id, recipient_id, content, message_type, is_read, read_at)
SELECT 
  s.user_id, r.user_id, 'Hi Jane! I saw your post about solar panel initiatives. We''d love to collaborate on this project.', 'text', false, NULL
FROM user_mapping s, user_mapping r WHERE s.email = 'john.doe@example.com' AND r.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  s.user_id, r.user_id, 'That sounds great, John! Let''s schedule a meeting to discuss the details.', 'text', true, '2024-01-15 10:30:00'::timestamp
FROM user_mapping s, user_mapping r WHERE s.email = 'jane.smith@example.com' AND r.email = 'john.doe@example.com'
UNION ALL
SELECT 
  s.user_id, r.user_id, 'Sarah, I''d like to discuss potential investment opportunities in community banking.', 'text', false, NULL
FROM user_mapping s, user_mapping r WHERE s.email = 'mike.johnson@example.com' AND r.email = 'sarah.wilson@example.com'
ON CONFLICT DO NOTHING;
