-- Simple Sample Data with Auto-Generated UUIDs
-- This script populates the database with basic sample data using auto-generated UUIDs

-- Insert sample users
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, is_active, is_verified) VALUES
('john.doe@example.com', '$2b$10$example_hash_1', 'user', 'John', 'Doe', '+1-555-0101', true, true),
('jane.smith@example.com', '$2b$10$example_hash_2', 'user', 'Jane', 'Smith', '+1-555-0102', true, true),
('mike.johnson@example.com', '$2b$10$example_hash_3', 'user', 'Mike', 'Johnson', '+1-555-0103', true, true),
('sarah.wilson@example.com', '$2b$10$example_hash_4', 'user', 'Sarah', 'Wilson', '+1-555-0104', true, true),
('david.brown@example.com', '$2b$10$example_hash_5', 'user', 'David', 'Brown', '+1-555-0105', true, true),
('lisa.davis@example.com', '$2b$10$example_hash_6', 'user', 'Lisa', 'Davis', '+1-555-0106', true, true),
('admin@sharedwealth.com', '$2b$10$example_hash_admin', 'admin', 'Admin', 'User', '+1-555-0000', true, true)
ON CONFLICT (email) DO NOTHING;

-- Get user IDs for reference
WITH user_ids AS (
  SELECT id, email FROM users WHERE email IN (
    'john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com',
    'sarah.wilson@example.com', 'david.brown@example.com', 'lisa.davis@example.com'
  )
)
-- Insert sample companies
INSERT INTO companies (name, description, industry, sector, size, location, website, logo_url, approved, status, applicant_role, applicant_position, applicant_user_id)
SELECT 
  'EcoTech Solutions', 'Leading provider of sustainable technology solutions for businesses', 'Technology', 'Green Tech', 'medium', 'San Francisco, CA', 'https://ecotech-solutions.com', '/logos/ecotech.png', true, 'approved', 'CEO', 'Chief Executive Officer', u.id
FROM user_ids u WHERE u.email = 'john.doe@example.com'
UNION ALL
SELECT 
  'GreenEnergy Corp', 'Renewable energy solutions and sustainable power systems', 'Energy', 'Renewable Energy', 'large', 'Austin, TX', 'https://greenenergy-corp.com', '/logos/greenenergy.png', true, 'approved', 'Founder', 'Founder & CTO', u.id
FROM user_ids u WHERE u.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  'SocialImpact Ventures', 'Investment firm focused on social impact and shared wealth businesses', 'Finance', 'Impact Investing', 'medium', 'New York, NY', 'https://socialimpact-ventures.com', '/logos/socialimpact.png', true, 'approved', 'Managing Partner', 'Managing Partner', u.id
FROM user_ids u WHERE u.email = 'mike.johnson@example.com'
UNION ALL
SELECT 
  'CommunityFirst Bank', 'Community-focused banking with shared wealth principles', 'Finance', 'Community Banking', 'large', 'Portland, OR', 'https://communityfirst-bank.com', '/logos/communityfirst.png', true, 'approved', 'President', 'President & CEO', u.id
FROM user_ids u WHERE u.email = 'sarah.wilson@example.com'
UNION ALL
SELECT 
  'Sustainable Foods Co', 'Organic and sustainable food production and distribution', 'Agriculture', 'Sustainable Agriculture', 'medium', 'Seattle, WA', 'https://sustainable-foods.com', '/logos/sustainablefoods.png', true, 'approved', 'Co-Founder', 'Co-Founder & COO', u.id
FROM user_ids u WHERE u.email = 'david.brown@example.com'
UNION ALL
SELECT 
  'TechForGood Inc', 'Technology solutions for social good and community development', 'Technology', 'Social Tech', 'small', 'Denver, CO', 'https://techforgood-inc.com', '/logos/techforgood.png', false, 'pending', 'Founder', 'Founder & CEO', u.id
FROM user_ids u WHERE u.email = 'lisa.davis@example.com'
ON CONFLICT (name) DO NOTHING;

-- Insert user-company relationships
WITH user_company_mapping AS (
  SELECT u.id as user_id, c.id as company_id, u.email
  FROM users u
  JOIN companies c ON (
    (u.email = 'john.doe@example.com' AND c.name = 'EcoTech Solutions') OR
    (u.email = 'jane.smith@example.com' AND c.name = 'GreenEnergy Corp') OR
    (u.email = 'mike.johnson@example.com' AND c.name = 'SocialImpact Ventures') OR
    (u.email = 'sarah.wilson@example.com' AND c.name = 'CommunityFirst Bank') OR
    (u.email = 'david.brown@example.com' AND c.name = 'Sustainable Foods Co') OR
    (u.email = 'lisa.davis@example.com' AND c.name = 'TechForGood Inc')
  )
)
INSERT INTO user_companies (user_id, company_id, role)
SELECT user_id, company_id, 'owner' FROM user_company_mapping
ON CONFLICT (user_id, company_id) DO NOTHING;

-- Insert sample projects
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
  'Solar Panel Installation Initiative', 'Large-scale solar panel installation project for residential communities', c.company_id, 'collaboration', 'active', '2024-01-01', '2024-12-31', 2500000.00, 'USD', ARRAY['GreenEnergy Corp', 'EcoTech Solutions', 'CommunityFirst Bank'], u.user_id, u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'GreenEnergy Corp' AND u.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  'Sustainable Agriculture Research', 'Research project on sustainable farming practices and community impact', c.company_id, 'research', 'active', '2024-02-01', '2024-11-30', 500000.00, 'USD', ARRAY['Sustainable Foods Co', 'TechForGood Inc'], u.user_id, u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'Sustainable Foods Co' AND u.email = 'david.brown@example.com'
UNION ALL
SELECT 
  'Community Banking Innovation', 'Development of new community-focused banking products', c.company_id, 'development', 'planning', '2024-03-01', '2024-10-31', 750000.00, 'USD', ARRAY['CommunityFirst Bank', 'SocialImpact Ventures'], u.user_id, u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'CommunityFirst Bank' AND u.email = 'sarah.wilson@example.com'
UNION ALL
SELECT 
  'Impact Investment Platform', 'Technology platform for impact investment management', c.company_id, 'development', 'completed', '2023-06-01', '2024-01-31', 1200000.00, 'USD', ARRAY['SocialImpact Ventures', 'TechForGood Inc'], u.user_id, u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'SocialImpact Ventures' AND u.email = 'mike.johnson@example.com'
ON CONFLICT (name) DO NOTHING;

-- Insert sample collaboration meetings
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
  c.company_id, 'Solar Panel Partnership Discussion', '2024-01-15 14:00:00', ARRAY['John Doe (EcoTech)', 'Jane Smith (GreenEnergy)', 'Mike Johnson (SocialImpact)'], 'Discussed partnership opportunities for solar panel installation project', 'Agreed to collaborate on community solar initiatives with 20% profit sharing', 8, 'Facilitated partnership that will benefit 3 communities', 'collaboration', u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'GreenEnergy Corp' AND u.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  c.company_id, 'Impact Investment Strategy Session', '2024-01-20 10:00:00', ARRAY['Mike Johnson (SocialImpact)', 'Sarah Wilson (CommunityFirst)', 'David Brown (Sustainable Foods)'], 'Strategic planning for impact investment portfolio', 'Developed new investment criteria focusing on shared wealth principles', 9, 'Created framework for measuring social impact in investments', 'partnership', u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'SocialImpact Ventures' AND u.email = 'mike.johnson@example.com'
UNION ALL
SELECT 
  c.company_id, 'Sustainable Agriculture Workshop', '2024-02-05 09:00:00', ARRAY['David Brown (Sustainable Foods)', 'Lisa Davis (TechForGood)', 'Local Farmers Association'], 'Workshop on sustainable farming practices and community benefits', 'Established farmer training program with profit-sharing model', 7, 'Created educational program benefiting 50+ local farmers', 'mentoring', u.user_id
FROM company_mapping c, user_mapping u WHERE c.name = 'Sustainable Foods Co' AND u.email = 'david.brown@example.com'
ON CONFLICT (meeting_title) DO NOTHING;

-- Insert sample forum categories
INSERT INTO forum_categories (name, description, is_active) VALUES
('General Discussion', 'General topics and community discussions', true),
('Business & Strategy', 'Business development and strategic planning discussions', true),
('Technology', 'Technology and innovation topics', true),
('Sustainability', 'Environmental and sustainability discussions', true),
('Events & Networking', 'Event-related discussions and networking', true)
ON CONFLICT (name) DO NOTHING;

-- Insert sample forum topics
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

-- Insert sample forum replies
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

-- Insert sample events
WITH user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com', 'sarah.wilson@example.com')
)
INSERT INTO events (title, description, location, start_date, end_date, registration_url, status, created_by)
SELECT 
  'Shared Wealth Principles Workshop', 'Learn about implementing shared wealth principles in your business', 'San Francisco, CA', '2024-02-15 09:00:00', '2024-02-15 17:00:00', 'https://sharedwealth.com/workshop-feb15', 'upcoming', u.user_id
FROM user_mapping u WHERE u.email = 'john.doe@example.com'
UNION ALL
SELECT 
  'Sustainability in Tech: Online Panel', 'Panel discussion on sustainable technology practices', 'Online', '2024-02-20 14:00:00', '2024-02-20 15:30:00', 'https://sharedwealth.com/webinar-feb20', 'upcoming', u.user_id
FROM user_mapping u WHERE u.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  'Community Banking Innovation Summit', 'Annual summit for community banking innovation', 'Portland, OR', '2024-03-10 08:00:00', '2024-03-12 18:00:00', 'https://sharedwealth.com/summit-mar10', 'upcoming', u.user_id
FROM user_mapping u WHERE u.email = 'sarah.wilson@example.com'
ON CONFLICT (title) DO NOTHING;

-- Insert sample activity feed entries
WITH user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com', 'sarah.wilson@example.com', 'david.brown@example.com')
)
INSERT INTO activity_feed (user_id, activity_type)
SELECT user_id, 'company_joined' FROM user_mapping WHERE email = 'john.doe@example.com'
UNION ALL
SELECT user_id, 'project_started' FROM user_mapping WHERE email = 'jane.smith@example.com'
UNION ALL
SELECT user_id, 'meeting_completed' FROM user_mapping WHERE email = 'mike.johnson@example.com'
UNION ALL
SELECT user_id, 'application_approved' FROM user_mapping WHERE email = 'sarah.wilson@example.com'
UNION ALL
SELECT user_id, 'forum_post' FROM user_mapping WHERE email = 'david.brown@example.com'
ON CONFLICT DO NOTHING;

-- Insert sample messages
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
  s.user_id, r.user_id, 'That sounds great, John! Let''s schedule a meeting to discuss the details.', 'text', true, '2024-01-15 10:30:00'
FROM user_mapping s, user_mapping r WHERE s.email = 'jane.smith@example.com' AND r.email = 'john.doe@example.com'
UNION ALL
SELECT 
  s.user_id, r.user_id, 'Sarah, I''d like to discuss potential investment opportunities in community banking.', 'text', false, NULL
FROM user_mapping s, user_mapping r WHERE s.email = 'mike.johnson@example.com' AND r.email = 'sarah.wilson@example.com'
ON CONFLICT DO NOTHING;

-- Insert sample user connections
WITH user_mapping AS (
  SELECT u.id as user_id, u.email
  FROM users u
  WHERE u.email IN ('john.doe@example.com', 'jane.smith@example.com', 'mike.johnson@example.com', 'sarah.wilson@example.com', 'david.brown@example.com', 'lisa.davis@example.com')
)
INSERT INTO user_connections (follower_id, following_id, connection_type, status)
SELECT 
  f.user_id, fo.user_id, 'follow', 'active'
FROM user_mapping f, user_mapping fo WHERE f.email = 'john.doe@example.com' AND fo.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  f.user_id, fo.user_id, 'follow', 'active'
FROM user_mapping f, user_mapping fo WHERE f.email = 'jane.smith@example.com' AND fo.email = 'john.doe@example.com'
UNION ALL
SELECT 
  f.user_id, fo.user_id, 'colleague', 'active'
FROM user_mapping f, user_mapping fo WHERE f.email = 'mike.johnson@example.com' AND fo.email = 'sarah.wilson@example.com'
UNION ALL
SELECT 
  f.user_id, fo.user_id, 'mentor', 'active'
FROM user_mapping f, user_mapping fo WHERE f.email = 'david.brown@example.com' AND fo.email = 'lisa.davis@example.com'
ON CONFLICT (follower_id, following_id) DO NOTHING;
