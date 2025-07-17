-- Database Migration for Shared Wealth International Platform
-- Run this in Supabase Studio SQL Editor
-- This migration only adds sample data (tables and policies should already exist)

-- Insert sample network companies (only if they dont already exist)
INSERT INTO network_companies (name, sector, country, description, website, employees, shared_value, impact_score, joined_date, logo, highlights, location, status) 
VALUES
  ('LocoSoco', Retail Technology,United Kingdom', 'Sustainable retail platform connecting local businesses with conscious consumers',https://locosoco.co.uk,45€20.8, 8.2, '2020011, '/logos/locosoco.png', ARRAY['Sustainable Retail,Local Business'], 'London, UK, active'),
  (EcoTech Solutions',Clean Technology,United Kingdom',Green technology solutions for sustainable business operations',https://ecotechsolutions.com,78€50.2, 7.8, '20202, /logos/ecotech.png', ARRAY['Green Tech,Sustainability'],Manchester, UK, tive'),
  ('Shared Wealth Ventures', 'Financial Services,United Kingdom', 'Investment platform focused on community wealth building, tps://sharedwealthventures.com, 120, '€120.5, 9.1, '202031logos/sharedwealth.png', ARRAY['Community Investment', 'Wealth Building'],Birmingham, UK, ctive),
  ('GreenBuildCo,Construction,United Kingdom', 'Sustainable construction and green building materials', 'https://greenbuildco.com,95€80.7, 7.5, '2020-41/logos/greenbuild.png', ARRAY['Green Construction', 'Sustainable Materials], eeds, UK, e'),
  ('Community First Bank', Banking,United Kingdom', 'Ethical banking services for local communities', https://communityfirstbank.co.uk, 20, '€250.3, 8.9, '2020/logos/communityfirst.png', ARRAY[Ethical Banking', Community Finance], Liverpool, UK', active')
ON CONFLICT (name) DO NOTHING;

-- Create indexes if they don't exist (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_network_companies_status ON network_companies(status);
CREATE INDEX IF NOT EXISTS idx_network_companies_name ON network_companies(name);
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id); 