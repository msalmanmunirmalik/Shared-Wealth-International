#!/usr/bin/env node

/**
 * Populate Render Database with Company Accounts
 * This script creates 30 companies and associated user accounts in the Render PostgreSQL instance
 */

import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Render PostgreSQL connection details
const renderDbConfig = {
  host: 'dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com',
  port: 5432,
  database: 'shared_wealth_db',
  user: 'shared_wealth_db_user',
  password: process.env.RENDER_DB_PASSWORD, // You'll need to set this
  ssl: {
    rejectUnauthorized: false
  }
};

// Company data (30 companies)
const companies = [
  { name: "Supernova Eco", industry: "Renewable Energy", sector: "Clean Technology", location: "San Francisco, CA", website: "https://supernovaeco.com", size: "medium" },
  { name: "GreenTech Solutions", industry: "Environmental Technology", sector: "Sustainability", location: "Austin, TX", website: "https://greentechsolutions.com", size: "small" },
  { name: "Ocean Cleanup Co", industry: "Marine Conservation", sector: "Environmental", location: "Seattle, WA", website: "https://oceancleanup.com", size: "startup" },
  { name: "Solar Dynamics", industry: "Solar Energy", sector: "Renewable Energy", location: "Phoenix, AZ", website: "https://solardynamics.com", size: "large" },
  { name: "Wind Power Systems", industry: "Wind Energy", sector: "Renewable Energy", location: "Denver, CO", website: "https://windpowersystems.com", size: "medium" },
  { name: "Hydro Innovations", industry: "Hydroelectric Power", sector: "Renewable Energy", location: "Portland, OR", website: "https://hydroinnovations.com", size: "small" },
  { name: "BioFuel Technologies", industry: "Biofuel Production", sector: "Clean Technology", location: "Minneapolis, MN", website: "https://biofueltech.com", size: "startup" },
  { name: "Carbon Capture Inc", industry: "Carbon Capture", sector: "Climate Technology", location: "Boston, MA", website: "https://carboncapture.com", size: "medium" },
  { name: "Electric Vehicle Co", industry: "Electric Vehicles", sector: "Transportation", location: "Detroit, MI", website: "https://evcompany.com", size: "large" },
  { name: "Smart Grid Solutions", industry: "Smart Grid Technology", sector: "Energy Infrastructure", location: "Chicago, IL", website: "https://smartgridsolutions.com", size: "medium" },
  { name: "Water Purification Systems", industry: "Water Treatment", sector: "Environmental", location: "Miami, FL", website: "https://waterpurification.com", size: "small" },
  { name: "Waste Management Pro", industry: "Waste Management", sector: "Environmental Services", location: "Los Angeles, CA", website: "https://wastemanagementpro.com", size: "large" },
  { name: "Sustainable Agriculture", industry: "Sustainable Farming", sector: "Agriculture", location: "Des Moines, IA", website: "https://sustainableagriculture.com", size: "medium" },
  { name: "Green Building Materials", industry: "Construction Materials", sector: "Sustainable Construction", location: "Atlanta, GA", website: "https://greenbuildingmaterials.com", size: "small" },
  { name: "Energy Storage Solutions", industry: "Energy Storage", sector: "Energy Technology", location: "Salt Lake City, UT", website: "https://energystoragesolutions.com", size: "startup" },
  { name: "Climate Analytics", industry: "Climate Data", sector: "Data Analytics", location: "New York, NY", website: "https://climateanalytics.com", size: "medium" },
  { name: "Renewable Energy Consulting", industry: "Energy Consulting", sector: "Professional Services", location: "Washington, DC", website: "https://renewableenergyconsulting.com", size: "small" },
  { name: "Eco-Friendly Packaging", industry: "Packaging", sector: "Manufacturing", location: "Nashville, TN", website: "https://ecofriendlypackaging.com", size: "medium" },
  { name: "Sustainable Transportation", industry: "Transportation", sector: "Mobility", location: "Portland, ME", website: "https://sustainabletransportation.com", size: "startup" },
  { name: "Green Finance Solutions", industry: "Financial Services", sector: "Sustainable Finance", location: "San Diego, CA", website: "https://greenfinancesolutions.com", size: "small" },
  { name: "Environmental Monitoring", industry: "Environmental Monitoring", sector: "Environmental Technology", location: "Boulder, CO", website: "https://environmentalmonitoring.com", size: "medium" },
  { name: "Clean Air Technologies", industry: "Air Quality", sector: "Environmental Technology", location: "Philadelphia, PA", website: "https://cleanairtechnologies.com", size: "small" },
  { name: "Sustainable Tourism", industry: "Tourism", sector: "Sustainable Tourism", location: "Honolulu, HI", website: "https://sustainabletourism.com", size: "startup" },
  { name: "Green Chemistry", industry: "Chemical Engineering", sector: "Sustainable Chemistry", location: "Houston, TX", website: "https://greenchemistry.com", size: "medium" },
  { name: "Renewable Energy Storage", industry: "Energy Storage", sector: "Renewable Energy", location: "Las Vegas, NV", website: "https://renewableenergystorage.com", size: "large" },
  { name: "Sustainable Fashion", industry: "Fashion", sector: "Sustainable Fashion", location: "San Francisco, CA", website: "https://sustainablefashion.com", size: "small" },
  { name: "Green Technology Ventures", industry: "Venture Capital", sector: "Investment", location: "Menlo Park, CA", website: "https://greentechventures.com", size: "medium" },
  { name: "Environmental Education", industry: "Education", sector: "Environmental Education", location: "Berkeley, CA", website: "https://environmentaleducation.com", size: "small" },
  { name: "Sustainable Energy Systems", industry: "Energy Systems", sector: "Energy Technology", location: "Cambridge, MA", website: "https://sustainableenergysystems.com", size: "medium" },
  { name: "Green Infrastructure", industry: "Infrastructure", sector: "Sustainable Infrastructure", location: "Portland, OR", website: "https://greeninfrastructure.com", size: "large" }
];

async function populateDatabase() {
  const client = new Client(renderDbConfig);
  
  try {
    console.log('🔌 Connecting to Render PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to Render PostgreSQL');

    // Check if data already exists
    const existingUsers = await client.query('SELECT COUNT(*) FROM users');
    const existingCompanies = await client.query('SELECT COUNT(*) FROM companies');
    
    if (existingUsers.rows[0].count > 1 || existingCompanies.rows[0].count > 0) {
      console.log('⚠️  Database already contains data. Skipping population.');
      console.log(`Users: ${existingUsers.rows[0].count}, Companies: ${existingCompanies.rows[0].count}`);
      return;
    }

    console.log('🏗️  Creating companies and users...');
    
    let createdUsers = 0;
    let createdCompanies = 0;
    let createdRelationships = 0;

    for (const company of companies) {
      try {
        // Create company
        const companyId = uuidv4();
        const companyResult = await client.query(`
          INSERT INTO companies (
            id, name, industry, sector, location, website, size, 
            status, is_shared_wealth_licensed, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
          RETURNING id
        `, [
          companyId,
          company.name,
          company.industry,
          company.sector,
          company.location,
          company.website,
          company.size,
          'approved',
          true
        ]);
        
        createdCompanies++;

        // Create user for the company
        const userId = uuidv4();
        const userEmail = `${company.name.toLowerCase().replace(/\s+/g, '')}@sharedwealth.com`;
        const passwordHash = await bcrypt.hash('Sharedwealth123', 10);
        
        const userResult = await client.query(`
          INSERT INTO users (
            id, email, password_hash, role, first_name, last_name, 
            is_active, email_verified, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
          RETURNING id
        `, [
          userId,
          userEmail,
          passwordHash,
          'director',
          'Company',
          'Director',
          true,
          true
        ]);
        
        createdUsers++;

        // Create user-company relationship
        const relationshipId = uuidv4();
        await client.query(`
          INSERT INTO user_companies (
            id, user_id, company_id, role, position, status, 
            is_primary, is_verified, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        `, [
          relationshipId,
          userId,
          companyId,
          'director',
          'Company Director',
          'active',
          true,
          true
        ]);
        
        createdRelationships++;

        console.log(`✅ Created: ${company.name} (${userEmail})`);

      } catch (error) {
        console.error(`❌ Error creating ${company.name}:`, error.message);
      }
    }

    console.log('\n📊 Population Summary:');
    console.log(`✅ Companies created: ${createdCompanies}`);
    console.log(`✅ Users created: ${createdUsers}`);
    console.log(`✅ Relationships created: ${createdRelationships}`);

    // Verify the data
    console.log('\n🔍 Verifying data...');
    const finalUserCount = await client.query('SELECT COUNT(*) FROM users');
    const finalCompanyCount = await client.query('SELECT COUNT(*) FROM companies');
    const finalRelationshipCount = await client.query('SELECT COUNT(*) FROM user_companies');

    console.log(`📋 Final counts:`);
    console.log(`  - Users: ${finalUserCount.rows[0].count}`);
    console.log(`  - Companies: ${finalCompanyCount.rows[0].count}`);
    console.log(`  - User-Company relationships: ${finalRelationshipCount.rows[0].count}`);

    // Show sample data
    console.log('\n📋 Sample companies:');
    const sampleCompanies = await client.query(`
      SELECT c.name, c.industry, c.location, u.email 
      FROM companies c 
      JOIN user_companies uc ON c.id = uc.company_id 
      JOIN users u ON uc.user_id = u.id 
      LIMIT 5
    `);
    
    sampleCompanies.rows.forEach(row => {
      console.log(`  - ${row.name} (${row.industry}) - ${row.email}`);
    });

    console.log('\n🎉 Database population completed successfully!');
    console.log('🔑 Default password for all users: Sharedwealth123');

  } catch (error) {
    console.error('🚨 Database population failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from Render PostgreSQL');
  }
}

// Run the population
if (import.meta.url === `file://${process.argv[1]}`) {
  populateDatabase().catch(console.error);
}

export { populateDatabase };
