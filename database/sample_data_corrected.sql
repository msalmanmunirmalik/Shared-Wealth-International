-- Corrected Sample Data Population Script for Phase 1
-- This script populates the database with realistic sample data matching the actual schema

-- First, let's create some sample users
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, is_active, email_verified) VALUES
('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', '$2b$10$example_hash_1', 'user', 'John', 'Doe', '+1-555-0101', true, true),
('22222222-2222-2222-2222-222222222222', 'jane.smith@example.com', '$2b$10$example_hash_2', 'user', 'Jane', 'Smith', '+1-555-0102', true, true),
('33333333-3333-3333-3333-333333333333', 'mike.johnson@example.com', '$2b$10$example_hash_3', 'user', 'Mike', 'Johnson', '+1-555-0103', true, true),
('44444444-4444-4444-4444-444444444444', 'sarah.wilson@example.com', '$2b$10$example_hash_4', 'user', 'Sarah', 'Wilson', '+1-555-0104', true, true),
('55555555-5555-5555-5555-555555555555', 'david.brown@example.com', '$2b$10$example_hash_5', 'user', 'David', 'Brown', '+1-555-0105', true, true),
('66666666-6666-6666-6666-666666666666', 'lisa.davis@example.com', '$2b$10$example_hash_6', 'user', 'Lisa', 'Davis', '+1-555-0106', true, true),
('77777777-7777-7777-7777-777777777777', 'admin@sharedwealth.com', '$2b$10$example_hash_admin', 'admin', 'Admin', 'User', '+1-555-0000', true, true)
ON CONFLICT (email) DO NOTHING;

-- Create sample companies
INSERT INTO companies (id, name, description, industry, sector, size, location, website, logo_url, countries, employees, status, is_shared_wealth_licensed, license_number, license_date, applicant_role, applicant_position, applicant_user_id, created_by_admin) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'EcoTech Solutions', 'Leading provider of sustainable technology solutions for businesses', 'Technology', 'Green Tech', 'medium', 'San Francisco, CA', 'https://ecotech-solutions.com', '/logos/ecotech.png', ARRAY['United States', 'Canada'], 150, 'approved', true, 'SWL-2024-001', '2024-01-15', 'CEO', 'Chief Executive Officer', '11111111-1111-1111-1111-111111111111', false),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'GreenEnergy Corp', 'Renewable energy solutions and sustainable power systems', 'Energy', 'Renewable Energy', 'large', 'Austin, TX', 'https://greenenergy-corp.com', '/logos/greenenergy.png', ARRAY['United States', 'Mexico'], 500, 'approved', true, 'SWL-2024-002', '2024-02-01', 'Founder', 'Founder & CTO', '22222222-2222-2222-2222-222222222222', false),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'SocialImpact Ventures', 'Investment firm focused on social impact and shared wealth businesses', 'Finance', 'Impact Investing', 'medium', 'New York, NY', 'https://socialimpact-ventures.com', '/logos/socialimpact.png', ARRAY['United States', 'United Kingdom'], 75, 'approved', true, 'SWL-2024-003', '2024-02-15', 'Managing Partner', 'Managing Partner', '33333333-3333-3333-3333-333333333333', false),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'CommunityFirst Bank', 'Community-focused banking with shared wealth principles', 'Finance', 'Community Banking', 'large', 'Portland, OR', 'https://communityfirst-bank.com', '/logos/communityfirst.png', ARRAY['United States'], 300, 'approved', true, 'SWL-2024-004', '2024-03-01', 'President', 'President & CEO', '44444444-4444-4444-4444-444444444444', false),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Sustainable Foods Co', 'Organic and sustainable food production and distribution', 'Agriculture', 'Sustainable Agriculture', 'medium', 'Seattle, WA', 'https://sustainable-foods.com', '/logos/sustainablefoods.png', ARRAY['United States', 'Canada'], 200, 'approved', true, 'SWL-2024-005', '2024-03-15', 'Co-Founder', 'Co-Founder & COO', '55555555-5555-5555-5555-555555555555', false),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'TechForGood Inc', 'Technology solutions for social good and community development', 'Technology', 'Social Tech', 'small', 'Denver, CO', 'https://techforgood-inc.com', '/logos/techforgood.png', ARRAY['United States'], 25, 'pending', false, NULL, NULL, 'Founder', 'Founder & CEO', '66666666-6666-6666-6666-666666666666', false)
ON CONFLICT (id) DO NOTHING;

-- Create user-company relationships
INSERT INTO user_companies (user_id, company_id, role, status) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'owner', 'active'),
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'owner', 'active'),
('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'owner', 'active'),
('44444444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'owner', 'active'),
('55555555-5555-5555-5555-555555555555', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'owner', 'active'),
('66666666-6666-6666-6666-666666666666', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'owner', 'active'),
-- Add some additional relationships
('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'advisor', 'active'),
('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'investor', 'active')
ON CONFLICT (user_id, company_id) DO NOTHING;

-- Create sample projects
INSERT INTO projects (id, name, description, company_id, project_type, status, start_date, end_date, budget, currency, participants, project_manager_id, created_by) VALUES
('pppppppp-pppp-pppp-pppp-pppppppppppp', 'Solar Panel Installation Initiative', 'Large-scale solar panel installation project for residential communities', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'collaboration', 'active', '2024-01-01', '2024-12-31', 2500000.00, 'USD', ARRAY['GreenEnergy Corp', 'EcoTech Solutions', 'CommunityFirst Bank'], '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222'),
('qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'Sustainable Agriculture Research', 'Research project on sustainable farming practices and community impact', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'research', 'active', '2024-02-01', '2024-11-30', 500000.00, 'USD', ARRAY['Sustainable Foods Co', 'TechForGood Inc'], '55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555'),
('rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', 'Community Banking Innovation', 'Development of new community-focused banking products', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'development', 'planning', '2024-03-01', '2024-10-31', 750000.00, 'USD', ARRAY['CommunityFirst Bank', 'SocialImpact Ventures'], '44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444'),
('ssssssss-ssss-ssss-ssss-ssssssssssss', 'Impact Investment Platform', 'Technology platform for impact investment management', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'development', 'completed', '2023-06-01', '2024-01-31', 1200000.00, 'USD', ARRAY['SocialImpact Ventures', 'TechForGood Inc'], '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;

-- Create sample company applications
INSERT INTO company_applications (id, company_name, applicant_name, applicant_email, applicant_phone, company_sector, company_size, company_location, company_website, company_description, business_model, shared_wealth_commitment, expected_impact, application_status, review_notes, reviewed_by, reviewed_at) VALUES
('appppppp-pppp-pppp-pppp-pppppppppppp', 'CleanWater Solutions', 'Robert Green', 'robert.green@cleanwater.com', '+1-555-0201', 'Environmental', 'small', 'Portland, OR', 'https://cleanwater-solutions.com', 'Water purification technology for developing communities', 'B2B sales with community impact focus', 'Commit to sharing 20% of profits with local communities', 'Provide clean water access to 10,000+ people annually', 'pending', NULL, NULL, NULL),
('appppppp-pppp-pppp-pppp-pppppppppppq', 'EduTech Innovations', 'Maria Rodriguez', 'maria.rodriguez@edutech.com', '+1-555-0202', 'Education', 'medium', 'Austin, TX', 'https://edutech-innovations.com', 'Educational technology for underserved communities', 'Freemium model with premium features', 'Commit to providing free access to 50% of educational content', 'Improve education access for 25,000+ students', 'under_review', 'Strong social impact potential, reviewing financial sustainability', '77777777-7777-7777-7777-777777777777', '2024-01-15 10:30:00'),
('appppppp-pppp-pppp-pppp-pppppppppppr', 'HealthTech Community', 'Dr. Sarah Chen', 'sarah.chen@healthtech.com', '+1-555-0203', 'Healthcare', 'medium', 'Seattle, WA', 'https://healthtech-community.com', 'Healthcare technology solutions for community health', 'Subscription model with sliding scale pricing', 'Commit to providing free healthcare services to 15% of patients', 'Improve healthcare access for 5,000+ community members', 'approved', 'Excellent alignment with shared wealth principles', '77777777-7777-7777-7777-777777777777', '2024-01-20 14:15:00')
ON CONFLICT (id) DO NOTHING;

-- Create sample collaboration meetings
INSERT INTO collaboration_meetings (id, company_id, meeting_title, meeting_date, participants, meeting_notes, outcomes, impact_score, shared_wealth_contribution, meeting_type, created_by) VALUES
('meeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Solar Panel Partnership Discussion', '2024-01-15 14:00:00', ARRAY['John Doe (EcoTech)', 'Jane Smith (GreenEnergy)', 'Mike Johnson (SocialImpact)'], 'Discussed partnership opportunities for solar panel installation project', 'Agreed to collaborate on community solar initiatives with 20% profit sharing', 8, 'Facilitated partnership that will benefit 3 communities', 'collaboration', '22222222-2222-2222-2222-222222222222'),
('meeeeeee-eeee-eeee-eeee-eeeeeeeeeeef', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Impact Investment Strategy Session', '2024-01-20 10:00:00', ARRAY['Mike Johnson (SocialImpact)', 'Sarah Wilson (CommunityFirst)', 'David Brown (Sustainable Foods)'], 'Strategic planning for impact investment portfolio', 'Developed new investment criteria focusing on shared wealth principles', 9, 'Created framework for measuring social impact in investments', 'partnership', '33333333-3333-3333-3333-333333333333'),
('meeeeeee-eeee-eeee-eeee-eeeeeeeeeeeg', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Sustainable Agriculture Workshop', '2024-02-05 09:00:00', ARRAY['David Brown (Sustainable Foods)', 'Lisa Davis (TechForGood)', 'Local Farmers Association'], 'Workshop on sustainable farming practices and community benefits', 'Established farmer training program with profit-sharing model', 7, 'Created educational program benefiting 50+ local farmers', 'mentoring', '55555555-5555-5555-5555-555555555555')
ON CONFLICT (id) DO NOTHING;

-- Create sample forum categories
INSERT INTO forum_categories (id, name, description, is_active) VALUES
('catttttt-tttt-tttt-tttt-tttttttttttt', 'General Discussion', 'General topics and community discussions', true),
('catttttt-tttt-tttt-tttt-tttttttttttu', 'Business & Strategy', 'Business development and strategic planning discussions', true),
('catttttt-tttt-tttt-tttt-tttttttttttv', 'Technology', 'Technology and innovation topics', true),
('catttttt-tttt-tttt-tttt-tttttttttttw', 'Sustainability', 'Environmental and sustainability discussions', true),
('catttttt-tttt-tttt-tttt-tttttttttttx', 'Events & Networking', 'Event-related discussions and networking', true)
ON CONFLICT (id) DO NOTHING;

-- Create sample forum topics
INSERT INTO forum_topics (id, category_id, title, content, author_id, is_pinned, is_locked, view_count, reply_count, last_reply_at) VALUES
('topiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'catttttt-tttt-tttt-tttt-tttttttttttt', 'Welcome to Shared Wealth International!', 'Welcome everyone to our community! This is a place where we can share ideas, collaborate, and work together to create shared wealth for all. Please introduce yourselves and let us know what brings you here.', '11111111-1111-1111-1111-111111111111', true, false, 156, 12, '2024-01-25 16:30:00'),
('topiiiii-iiii-iiii-iiii-iiiiiiiiiiiij', 'catttttt-tttt-tttt-tttt-tttttttttttu', 'Best Practices for Measuring Social Impact', 'I''m working on implementing a social impact measurement framework for our tech startup. What metrics do you find most valuable for tracking progress?', '22222222-2222-2222-2222-222222222222', false, false, 89, 8, '2024-01-24 14:20:00'),
('topiiiii-iiii-iiii-iiii-iiiiiiiiiiiik', 'catttttt-tttt-tttt-tttt-tttttttttttv', 'Technology Solutions for Community Development', 'How can we leverage technology to better serve our communities? I''d love to hear about successful tech implementations that have created positive social impact.', '66666666-6666-6666-6666-666666666666', false, false, 67, 5, '2024-01-23 11:45:00'),
('topiiiii-iiii-iiii-iiii-iiiiiiiiiiiil', 'catttttt-tttt-tttt-tttt-tttttttttttw', 'Sustainable Business Models That Work', 'Share your experiences with sustainable business models. What approaches have you found most effective for balancing profit with social impact?', '55555555-5555-5555-5555-555555555555', false, false, 134, 15, '2024-01-22 09:15:00')
ON CONFLICT (id) DO NOTHING;

-- Create sample forum replies
INSERT INTO forum_replies (id, topic_id, content, author_id, is_solution) VALUES
('repppppp-pppp-pppp-pppp-pppppppppppp', 'topiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'Thank you for the warm welcome! I''m excited to be part of this community and look forward to learning from everyone here.', '33333333-3333-3333-3333-333333333333', false),
('repppppp-pppp-pppp-pppp-pppppppppppq', 'topiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'Great to be here! I''m passionate about creating positive social impact through business.', '44444444-4444-4444-4444-444444444444', false),
('repppppp-pppp-pppp-pppp-pppppppppppr', 'topiiiii-iiii-iiii-iiii-iiiiiiiiiiiij', 'We use a combination of quantitative metrics (number of beneficiaries, revenue impact) and qualitative measures (community feedback, stakeholder satisfaction). The key is to track both short-term outputs and long-term outcomes.', '33333333-3333-3333-3333-333333333333', true),
('repppppp-pppp-pppp-pppp-ppppppppppps', 'topiiiii-iiii-iiii-iiii-iiiiiiiiiiiik', 'Mobile apps for community health monitoring have been incredibly effective. We''ve seen 40% improvement in health outcomes in communities where we''ve implemented our solution.', '66666666-6666-6666-6666-666666666666', false),
('repppppp-pppp-pppp-pppp-pppppppppppt', 'topiiiii-iiii-iiii-iiii-iiiiiiiiiiiil', 'The B-Corp model has worked well for us. It provides a framework for balancing profit with purpose while maintaining accountability to stakeholders.', '11111111-1111-1111-1111-111111111111', false)
ON CONFLICT (id) DO NOTHING;

-- Create sample events
INSERT INTO events (id, title, description, location, virtual_link, start_date, end_date, capacity, registration_required, registration_url, status, created_by) VALUES
('evvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', 'Shared Wealth Principles Workshop', 'Learn about implementing shared wealth principles in your business', 'San Francisco, CA', NULL, '2024-02-15 09:00:00', '2024-02-15 17:00:00', 50, true, 'https://sharedwealth.com/workshop-feb15', 'upcoming', '11111111-1111-1111-1111-111111111111'),
('evvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvw', 'Sustainability in Tech: Online Panel', 'Panel discussion on sustainable technology practices', NULL, 'https://zoom.us/j/123456789', '2024-02-20 14:00:00', '2024-02-20 15:30:00', 200, true, 'https://sharedwealth.com/webinar-feb20', 'upcoming', '22222222-2222-2222-2222-222222222222'),
('evvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvx', 'Community Banking Innovation Summit', 'Annual summit for community banking innovation', 'Portland, OR', NULL, '2024-03-10 08:00:00', '2024-03-12 18:00:00', 300, true, 'https://sharedwealth.com/summit-mar10', 'upcoming', '44444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

-- Create sample activity feed entries
INSERT INTO activity_feed (id, user_id, activity_type, is_read) VALUES
('actttttt-tttt-tttt-tttt-tttttttttttt', '11111111-1111-1111-1111-111111111111', 'company_joined', false),
('actttttt-tttt-tttt-tttt-tttttttttttu', '22222222-2222-2222-2222-222222222222', 'project_started', false),
('actttttt-tttt-tttt-tttt-tttttttttttv', '33333333-3333-3333-3333-333333333333', 'meeting_completed', false),
('actttttt-tttt-tttt-tttt-tttttttttttw', '44444444-4444-4444-4444-444444444444', 'application_approved', false),
('actttttt-tttt-tttt-tttt-tttttttttttx', '55555555-5555-5555-5555-555555555555', 'forum_post', false)
ON CONFLICT (id) DO NOTHING;

-- Create sample messages
INSERT INTO messages (id, sender_id, recipient_id, content, message_type, is_read, read_at) VALUES
('msgmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Hi Jane! I saw your post about solar panel initiatives. We''d love to collaborate on this project.', 'text', false, NULL),
('msgmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmn', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'That sounds great, John! Let''s schedule a meeting to discuss the details.', 'text', true, '2024-01-15 10:30:00'),
('msgmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmo', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Sarah, I''d like to discuss potential investment opportunities in community banking.', 'text', false, NULL)
ON CONFLICT (id) DO NOTHING;

-- Create sample user connections (following relationships)
INSERT INTO user_connections (id, follower_id, following_id, connection_type, status) VALUES
('connnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'follow', 'active'),
('connnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnno', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'follow', 'active'),
('connnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnp', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'colleague', 'active'),
('connnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnq', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', 'mentor', 'active')
ON CONFLICT (id) DO NOTHING;

-- Create sample post reactions
INSERT INTO post_reactions (id, post_id, post_type, user_id, reaction_type) VALUES
('reactttt-tttt-tttt-tttt-tttttttttttt', 'topiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'forum_topic', '22222222-2222-2222-2222-222222222222', 'like'),
('reactttt-tttt-tttt-tttt-tttttttttttu', 'topiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'forum_topic', '33333333-3333-3333-3333-333333333333', 'love'),
('reactttt-tttt-tttt-tttt-tttttttttttv', 'topiiiii-iiii-iiii-iiii-iiiiiiiiiiiij', 'forum_topic', '44444444-4444-4444-4444-444444444444', 'like'),
('reactttt-tttt-tttt-tttt-tttttttttttw', 'topiiiii-iiii-iiii-iiii-iiiiiiiiiiiil', 'forum_topic', '66666666-6666-6666-6666-666666666666', 'like')
ON CONFLICT (id) DO NOTHING;

-- Create sample bookmarks
INSERT INTO bookmarks (id, user_id, bookmarked_id, bookmarked_type) VALUES
('bookkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '11111111-1111-1111-1111-111111111111', 'topiiiii-iiii-iiii-iiii-iiiiiiiiiiiij', 'forum_topic'),
('bookkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkl', '22222222-2222-2222-2222-222222222222', 'topiiiii-iiii-iiii-iiii-iiiiiiiiiiiil', 'forum_topic'),
('bookkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkm', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'company'),
('bookkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkn', '44444444-4444-4444-4444-444444444444', 'evvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', 'event')
ON CONFLICT (id) DO NOTHING;
