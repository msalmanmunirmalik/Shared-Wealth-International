#!/usr/bin/env node

/**
 * Populate Render Database with Company Accounts
 * This script creates 30 companies and associated user accounts in the Render PostgreSQL instance
 * Uses the database connection details from the Render service
 */

import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Render PostgreSQL connection details (from the service we analyzed)
const renderDbConfig = {
  host: 'dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com',
  port: 5432,
  database: 'shared_wealth_db',
  user: 'shared_wealth_db_user',
  password: process.env.RENDER_DB_PASSWORD || process.env.DATABASE_URL?.split('@')[0]?.split('://')[1]?.split(':')[1] || 'default_password',
  ssl: {
    rejectUnauthorized: false
  }
};

// Company data (30 companies)
const companies = [
  { name: "Supernova Eco", industry: "Renewable Energy", sector: "Clean Technology", location: "San Francisco, CA", website: "https://supernovaeco.com", description: "Leading renewable energy solutions provider" },
  { name: "Quantum Finance", industry: "Financial Services", sector: "Fintech", location: "New York, NY", website: "https://quantumfinance.com", description: "Advanced financial technology solutions" },
  { name: "GreenTech Innovations", industry: "Environmental Technology", sector: "Sustainability", location: "Austin, TX", website: "https://greentechinnovations.com", description: "Sustainable technology solutions" },
  { name: "DataFlow Systems", industry: "Information Technology", sector: "Software", location: "Seattle, WA", website: "https://dataflowsystems.com", description: "Enterprise data management solutions" },
  { name: "BioMed Solutions", industry: "Healthcare", sector: "Biotechnology", location: "Boston, MA", website: "https://biomedsolutions.com", description: "Advanced biomedical research and solutions" },
  { name: "CyberSecure Corp", industry: "Cybersecurity", sector: "Information Security", location: "Washington, DC", website: "https://cybersecurecorp.com", description: "Enterprise cybersecurity solutions" },
  { name: "AgriTech Plus", industry: "Agriculture", sector: "Agricultural Technology", location: "Des Moines, IA", website: "https://agritechplus.com", description: "Smart agriculture technology solutions" },
  { name: "LogiChain Global", industry: "Logistics", sector: "Supply Chain", location: "Memphis, TN", website: "https://logichainglobal.com", description: "Global logistics and supply chain management" },
  { name: "EduTech Solutions", industry: "Education", sector: "Educational Technology", location: "Denver, CO", website: "https://edutechsolutions.com", description: "Innovative educational technology platforms" },
  { name: "RetailMax Systems", industry: "Retail", sector: "E-commerce", location: "Los Angeles, CA", website: "https://retailmaxsystems.com", description: "Advanced retail management systems" },
  { name: "Manufacturing Pro", industry: "Manufacturing", sector: "Industrial Technology", location: "Detroit, MI", website: "https://manufacturingpro.com", description: "Smart manufacturing solutions" },
  { name: "RealEstate Tech", industry: "Real Estate", sector: "Property Technology", location: "Miami, FL", website: "https://realestatetech.com", description: "Real estate technology and analytics" },
  { name: "EnergyGrid Solutions", industry: "Energy", sector: "Energy Management", location: "Houston, TX", website: "https://energygridsolutions.com", description: "Smart energy grid management systems" },
  { name: "TransportTech", industry: "Transportation", sector: "Transportation Technology", location: "Chicago, IL", website: "https://transporttech.com", description: "Advanced transportation solutions" },
  { name: "MediaStream Corp", industry: "Media", sector: "Digital Media", location: "Los Angeles, CA", website: "https://mediastreamcorp.com", description: "Digital media streaming and content delivery" },
  { name: "HealthTech Innovations", industry: "Healthcare", sector: "Health Technology", location: "San Diego, CA", website: "https://healthtechinnovations.com", description: "Digital health and wellness solutions" },
  { name: "FoodTech Systems", industry: "Food & Beverage", sector: "Food Technology", location: "Portland, OR", website: "https://foodtechsystems.com", description: "Smart food production and distribution" },
  { name: "SportsTech Solutions", industry: "Sports", sector: "Sports Technology", location: "Atlanta, GA", website: "https://sportstechsolutions.com", description: "Sports analytics and performance technology" },
  { name: "TravelTech Global", industry: "Travel", sector: "Travel Technology", location: "Orlando, FL", website: "https://traveltechglobal.com", description: "Global travel and tourism technology" },
  { name: "Entertainment Plus", industry: "Entertainment", sector: "Digital Entertainment", location: "Las Vegas, NV", website: "https://entertainmentplus.com", description: "Digital entertainment and gaming solutions" },
  { name: "ConstructionTech", industry: "Construction", sector: "Construction Technology", location: "Phoenix, AZ", website: "https://constructiontech.com", description: "Smart construction and building technology" },
  { name: "InsuranceTech", industry: "Insurance", sector: "Insurance Technology", location: "Hartford, CT", website: "https://insurancetech.com", description: "Digital insurance and risk management" },
  { name: "LegalTech Solutions", industry: "Legal Services", sector: "Legal Technology", location: "San Francisco, CA", website: "https://legaltechsolutions.com", description: "Legal technology and case management" },
  { name: "ConsultingTech", industry: "Consulting", sector: "Business Consulting", location: "New York, NY", website: "https://consultingtech.com", description: "Business consulting and advisory services" },
  { name: "MarketingTech", industry: "Marketing", sector: "Digital Marketing", location: "Chicago, IL", website: "https://marketingtech.com", description: "Digital marketing and advertising technology" },
  { name: "HRTech Solutions", industry: "Human Resources", sector: "HR Technology", location: "Dallas, TX", website: "https://hrtechsolutions.com", description: "Human resources management technology" },
  { name: "SalesTech Pro", industry: "Sales", sector: "Sales Technology", location: "San Jose, CA", website: "https://salestechpro.com", description: "Sales automation and CRM solutions" },
  { name: "CustomerTech", industry: "Customer Service", sector: "Customer Experience", location: "Salt Lake City, UT", website: "https://customertech.com", description: "Customer experience and support technology" },
  { name: "AnalyticsTech", industry: "Analytics", sector: "Data Analytics", location: "Minneapolis, MN", website: "https://analyticstech.com", description: "Advanced data analytics and business intelligence" },
  { name: "CloudTech Solutions", industry: "Cloud Computing", sector: "Cloud Services", location: "Seattle, WA", website: "https://cloudtechsolutions.com", description: "Cloud computing and infrastructure solutions" }
];

async function populateDatabase() {
  const client = new Client(renderDbConfig);
  
  try {
    console.log('🔌 Connecting to Render PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to Render PostgreSQL successfully');

    console.log('👥 Creating 30 companies and user accounts...');

    // Create admin user first
    const adminId = uuidv4();
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    
    await client.query(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, [adminId, 'admin@sharedwealth.com', adminPasswordHash, 'Admin', 'User', 'admin', true]);

    console.log('✅ Admin user created: admin@sharedwealth.com / admin123');

    let companiesCreated = 0;
    let usersCreated = 0;
    let relationshipsCreated = 0;

    for (const company of companies) {
      try {
        // Create company
        const companyId = uuidv4();
        await client.query(`
          INSERT INTO companies (id, name, industry, sector, location, website, description, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          ON CONFLICT (name) DO NOTHING
        `, [companyId, company.name, company.industry, company.sector, company.location, company.website, company.description]);

        // Create user for company
        const userId = uuidv4();
        const email = `${company.name.toLowerCase().replace(/\s+/g, '')}@sharedwealth.com`;
        const passwordHash = await bcrypt.hash('Sharedwealth123', 10);
        
        await client.query(`
          INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_verified, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          ON CONFLICT (email) DO NOTHING
        `, [userId, email, passwordHash, 'Company', 'Director', 'director', true]);

        // Create user-company relationship
        await client.query(`
          INSERT INTO user_companies (user_id, company_id, is_primary, created_at, updated_at)
          VALUES ($1, $2, $3, NOW(), NOW())
          ON CONFLICT (user_id, company_id) DO NOTHING
        `, [userId, companyId, true]);

        companiesCreated++;
        usersCreated++;
        relationshipsCreated++;

        console.log(`✅ Created: ${company.name} - ${email}`);

      } catch (error) {
        console.error(`❌ Error creating ${company.name}:`, error.message);
      }
    }

    console.log(`\n📊 Database population summary:`);
    console.log(`   🏢 Companies created: ${companiesCreated}`);
    console.log(`   👤 Users created: ${usersCreated}`);
    console.log(`   🔗 Relationships created: ${relationshipsCreated}`);

    // Verify data
    console.log('\n🔍 Verifying data...');
    const companiesCount = await client.query('SELECT COUNT(*) FROM companies');
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    const relationshipsCount = await client.query('SELECT COUNT(*) FROM user_companies');

    console.log(`📋 Database contents:`);
    console.log(`   🏢 Companies: ${companiesCount.rows[0].count}`);
    console.log(`   👤 Users: ${usersCount.rows[0].count}`);
    console.log(`   🔗 User-Company relationships: ${relationshipsCount.rows[0].count}`);

    console.log('\n🎉 Database population completed successfully!');
    console.log('\n🔐 Default credentials:');
    console.log('   Admin: admin@sharedwealth.com / admin123');
    console.log('   Company Directors: {company}@sharedwealth.com / Sharedwealth123');

  } catch (error) {
    console.error('❌ Failed to populate database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the population
populateDatabase().catch(console.error);
