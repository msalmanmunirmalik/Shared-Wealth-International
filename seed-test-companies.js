import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: 'postgresql://shared_wealth_db_user:fQ36Pb3VRDUHD6UsiqmeLCNG0KLXtYSd@dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com/shared_wealth_db',
  ssl: {
    rejectUnauthorized: false
  }
});

const testCompanies = [
  {
    name: 'GreenTech Solutions',
    description: 'Sustainable technology solutions for a better future',
    industry: 'Technology',
    sector: 'Clean Energy',
    size: '50-200',
    location: 'San Francisco, CA',
    website: 'https://greentech-solutions.com',
    status: 'approved'
  },
  {
    name: 'EcoFriendly Manufacturing',
    description: 'Environmentally conscious manufacturing processes',
    industry: 'Manufacturing',
    sector: 'Sustainability',
    size: '200-500',
    location: 'Portland, OR',
    website: 'https://ecofriendly-mfg.com',
    status: 'approved'
  },
  {
    name: 'Social Impact Ventures',
    description: 'Investment firm focused on social and environmental impact',
    industry: 'Finance',
    sector: 'Impact Investing',
    size: '10-50',
    location: 'New York, NY',
    website: 'https://socialimpact-ventures.com',
    status: 'approved'
  },
  {
    name: 'Community Development Corp',
    description: 'Building stronger communities through sustainable development',
    industry: 'Real Estate',
    sector: 'Community Development',
    size: '100-500',
    location: 'Chicago, IL',
    website: 'https://community-dev-corp.com',
    status: 'approved'
  },
  {
    name: 'Renewable Energy Partners',
    description: 'Leading provider of renewable energy solutions',
    industry: 'Energy',
    sector: 'Renewable Energy',
    size: '500+',
    location: 'Austin, TX',
    website: 'https://renewable-energy-partners.com',
    status: 'approved'
  }
];

async function seedTestCompanies() {
  console.log('🌱 Seeding test companies...');
  
  let client;
  
  try {
    client = await pool.connect();
    console.log('✅ Connected to database');
    
    // Check if companies already exist
    const existingResult = await client.query('SELECT COUNT(*) FROM companies');
    const existingCount = parseInt(existingResult.rows[0].count);
    
    if (existingCount > 0) {
      console.log(`⚠️ Found ${existingCount} existing companies. Skipping seed.`);
      return;
    }
    
    // Insert test companies
    for (let i = 0; i < testCompanies.length; i++) {
      const company = testCompanies[i];
      console.log(`\n${i + 1}. Creating: ${company.name}`);
      
      try {
        const result = await client.query(`
          INSERT INTO companies (
            name, description, industry, sector, size, location, website, status, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
          RETURNING id, name
        `, [
          company.name,
          company.description,
          company.industry,
          company.sector,
          company.size,
          company.location,
          company.website,
          company.status
        ]);
        
        console.log(`✅ Created: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
      } catch (error) {
        console.error(`❌ Error creating ${company.name}:`, error.message);
      }
    }
    
    // Verify the seed
    const verifyResult = await client.query('SELECT COUNT(*) FROM companies WHERE status = $1', ['approved']);
    console.log(`\n🎉 Seed completed! Total approved companies: ${verifyResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

seedTestCompanies();
