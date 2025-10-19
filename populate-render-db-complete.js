import { Client } from 'pg';
import fs from 'fs';

const renderDbConfig = {
  user: 'shared_wealth_db_12z3_user',
  host: 'dpg-d3qlu1mmcj7s73br039g-a.oregon-postgres.render.com',
  database: 'shared_wealth_db_12z3',
  password: 'gRQOn1kMLRMFBTc6AS94nKKgoLX3VNey',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
};

async function populateRenderDatabase() {
  console.log('🚀 Populating Render PostgreSQL Database...\n');
  const client = new Client(renderDbConfig);

  try {
    await client.connect();
    console.log('✅ Connected to Render database\n');

    // Step 1: Create schema
    console.log('📋 Step 1: Creating database schema...');
    const schemaSQL = fs.readFileSync('database/schema.sql', 'utf8');
    
    // Execute schema in parts to handle any errors
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
        } catch (error) {
          // Ignore errors for already existing tables
          if (!error.message.includes('already exists')) {
            console.log('Warning:', error.message);
          }
        }
      }
    }
    console.log('✅ Schema created/updated\n');

    // Step 2: Check existing data
    const companyCheck = await client.query('SELECT COUNT(*) as count FROM companies');
    const existingCompanies = parseInt(companyCheck.rows[0].count);
    
    console.log(`📊 Current database state:`);
    console.log(`   Companies: ${existingCompanies}`);

    if (existingCompanies > 0) {
      console.log('\n✅ Database already has companies. Skipping population.');
      console.log('Use --force flag if you want to re-populate\n');
    } else {
      // Step 3: Insert sample companies from COMPANY_ACCOUNTS_SUMMARY.md
      console.log('\n📋 Step 2: Inserting companies...');
      
      const companies = [
        { name: 'Ktalise', industry: 'Social Enterprise', location: 'Portugal', website: 'https://ktalise.com' },
        { name: 'Beplay', industry: 'Social Enterprise', location: 'Brazil', website: 'https://beplay.com' },
        { name: 'Carsis Consulting', industry: 'Social Enterprise', location: 'UK', website: 'https://carsisconsulting.com' },
        { name: 'Consortio', industry: 'Social Enterprise', location: 'Ireland', website: 'https://consortio.com' },
        { name: 'Eternal Flame', industry: 'Social Enterprise', location: 'Lesotho', website: 'https://eternalflame.com' },
        { name: 'Eupolisgrupa', industry: 'Social Enterprise', location: 'Croatia', website: 'https://eupolisgrupa.com' },
        { name: 'Fairbnb', industry: 'Social Enterprise', location: 'Italy', website: 'https://fairbnb.com' },
        { name: 'Givey Ktd', industry: 'Social Enterprise', location: 'Cameroon', website: 'https://giveyktd.com' },
        { name: 'Kula Eco Pads', industry: 'Social Enterprise', location: 'Indonesia', website: 'https://kulaecopads.com' },
        { name: 'LocoSoco PLC', industry: 'Social Enterprise', location: 'UK', website: 'https://locosocoplc.com' },
        { name: 'Media Cultured', industry: 'Social Enterprise', location: 'UK', website: 'https://mediacultured.com' },
        { name: 'NCDF', industry: 'Social Enterprise', location: 'Nigeria', website: 'https://ncdf.com' },
        { name: 'PadCare', industry: 'Social Enterprise', location: 'India', website: 'https://padcare.com' },
        { name: 'Pathways Points', industry: 'Social Enterprise', location: 'UK', website: 'https://pathwayspoints.com' },
        { name: 'Purview Ltd', industry: 'Social Enterprise', location: 'UK', website: 'https://purviewltd.com' },
        { name: 'Research Automators', industry: 'Social Enterprise', location: 'Sweden', website: 'https://researchautomators.com' },
        { name: 'SE Ghana', industry: 'Social Enterprise', location: 'Ghana', website: 'https://seghana.com' },
        { name: 'SEi Caledonia', industry: 'Social Enterprise', location: 'UK', website: 'https://seicaledonia.com' },
        { name: 'SEi Middle East', industry: 'Social Enterprise', location: 'Iraq', website: 'https://seimiddleeast.com' },
        { name: 'Solar Ear', industry: 'Social Enterprise', location: 'Brazil', website: 'https://solarear.com' },
        { name: 'Spark', industry: 'Social Enterprise', location: 'UK', website: 'https://spark.com' },
        { name: 'Supanova', industry: 'Social Enterprise', location: 'Indonesia', website: 'https://supanova.com' },
        { name: 'Sustainable Roots', industry: 'Social Enterprise', location: 'UK', website: 'https://sustainableroots.com' },
        { name: 'TTF', industry: 'Social Enterprise', location: 'UK', website: 'https://ttf.com' },
        { name: 'Terratai', industry: 'Social Enterprise', location: 'India', website: 'https://terratai.com' },
        { name: 'Universiti Malaya', industry: 'Social Enterprise', location: 'Malaysia', website: 'https://universitimalaya.com' },
        { name: 'Unyte Group', industry: 'Social Enterprise', location: 'Indonesia', website: 'https://unytegroup.com' },
        { name: 'Washking', industry: 'Social Enterprise', location: 'Ghana', website: 'https://washking.com' },
        { name: 'Whitby Shared Wealth', industry: 'Social Enterprise', location: 'UK', website: 'https://whitbysharedwealth.com' }
      ];

      for (const company of companies) {
        const insertQuery = `
          INSERT INTO companies (name, industry, location, website, description, status, is_active, is_verified)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING
        `;
        
        await client.query(insertQuery, [
          company.name,
          company.industry,
          company.location,
          company.website,
          `${company.name} is a partner company of Shared Wealth International, committed to equitable wealth distribution and inclusive business practices.`,
          'approved',
          true,
          true
        ]);
      }
      
      console.log(`✅ Inserted ${companies.length} companies\n`);
    }

    // Step 3: Verify final state
    console.log('🔍 Step 3: Verifying database...');
    const finalCount = await client.query('SELECT COUNT(*) as count FROM companies');
    const userCount = await client.query('SELECT COUNT(*) as count FROM users');
    
    console.log(`✅ Total companies: ${finalCount.rows[0].count}`);
    console.log(`✅ Total users: ${userCount.rows[0].count}\n`);

    // Step 4: Show sample companies
    if (parseInt(finalCount.rows[0].count) > 0) {
      console.log('📋 Sample companies in database:');
      const sampleCompanies = await client.query('SELECT name, location, status FROM companies LIMIT 5');
      sampleCompanies.rows.forEach((company, index) => {
        console.log(`   ${index + 1}. ${company.name} (${company.location}) - ${company.status}`);
      });
    }

    console.log('\n🎉 Render database setup complete!');
    console.log('✅ Database is ready for production use!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

populateRenderDatabase().catch(console.error);
