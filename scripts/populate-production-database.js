#!/usr/bin/env node

/**
 * Populate Production Database with Real Company Accounts
 * This script creates user accounts for all companies listed in COMPANY_ACCOUNTS_SUMMARY.md
 */

import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Production database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'shared_wealth_db',
  user: process.env.DB_USER || 'shared_wealth_db_user',
  password: process.env.DB_PASSWORD || process.env.RENDER_DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
};

// Company accounts from COMPANY_ACCOUNTS_SUMMARY.md
const companies = [
  { name: 'Beplay', email: 'luis@ktalise.com', firstName: 'Luis', lastName: 'Mauch', country: 'Brazil' },
  { name: 'Carsis Consulting', email: 'stephen@carsis.consulting', firstName: 'Stephen', lastName: 'Hunt', country: 'UK' },
  { name: 'Consortio', email: 'sam@consortiaco.io', firstName: 'Sam', lastName: 'Marchetti', country: 'Ireland' },
  { name: 'Eternal Flame', email: 'ken@africasgift.org', firstName: 'Ken', lastName: 'Dunn OBE', country: 'Lesotho' },
  { name: 'Eupolisgrupa', email: 'eupolisgrupa@gmail.com', firstName: 'Ranko', lastName: 'Milic', country: 'Croatia' },
  { name: 'Fairbnb', email: 'emanuele.dalcarlo@fairbnb.coop', firstName: 'Emanuele', lastName: 'Dal Carlo', country: 'Italy' },
  { name: 'Givey Ktd', email: 'nabikuja@gmail.com', firstName: 'Marie-Claire', lastName: 'N Kuja', country: 'Cameroon' },
  { name: 'Kula Eco Pads', email: 'lee.hawkins@asafgroup.org', firstName: 'Lee', lastName: 'Hawkins', country: 'Indonesia' },
  { name: 'LocoSoco PLC', email: 'james@locoso.co', firstName: 'James', lastName: 'Perry', country: 'UK' },
  { name: 'Media Cultured', email: 'amjid@mediacultured.org', firstName: 'Amjid', lastName: '', country: 'UK' },
  { name: 'NCDF', email: 'babatundeoralusi@gmail.com', firstName: 'Hon Hareter', lastName: 'Babatune Oralusi', country: 'Nigeria' },
  { name: 'PadCare', email: 'ajinkya.dhariya@padcarelabs.com', firstName: 'Ajinkya', lastName: 'Dhariya', country: 'India' },
  { name: 'Pathways Points', email: 'ike.udechuku@pathwaypoints.com', firstName: 'Ike', lastName: 'Udechuku', country: 'UK' },
  { name: 'Purview Ltd', email: 'neil@givey.com', firstName: 'Neil', lastName: 'Mehta', country: 'UK' },
  { name: 'Research Automators', email: 'jonas@researchautomators.com', firstName: 'Jonas', lastName: 'Ortman', country: 'Sweden' },
  { name: 'SE Ghana', email: 'execdir@seghana.net', firstName: 'Edwin', lastName: 'Zu-Cudjoe', country: 'Ghana' },
  { name: 'SEi Caledonia', email: 'thesoundsenseproject@gmail.com', firstName: 'Chris', lastName: 'McCannon', country: 'UK' },
  { name: 'SEi Middle East', email: 'amed@seiime.com', firstName: 'Amad', lastName: 'Nabi', country: 'Iraq' },
  { name: 'SEi Tuatha', email: 'sei.mariabel@gmail.com', firstName: 'Mariabel', lastName: 'Dutari', country: 'Ireland' },
  { name: 'Solar Ear', email: 'strolltheworld@gmail.com', firstName: 'Howard', lastName: 'Weinstein', country: 'Brazil' },
  { name: 'Spark', email: 'alex@sparkscot.com', firstName: 'Alex', lastName: 'Fleming', country: 'UK' },
  { name: 'Supanova', email: 'irma@supernovaeco.com', firstName: 'Irma', lastName: 'Chantily', country: 'Indonesia' },
  { name: 'Sustainable Roots', email: 'gugs@lifesciences-healthcare.com', firstName: 'Gagan', lastName: 'Lushai', country: 'UK' },
  { name: 'TTF', email: 'andy.agathangelou@transparencytaskforce.org', firstName: 'Andy', lastName: 'Agathangelou', country: 'UK' },
  { name: 'Terratai', email: 'loraine@purview.co.uk', firstName: 'Loraine', lastName: 'Politi', country: 'India' },
  { name: 'Universiti Malaya', email: 'shakeelalpha@gmail.com', firstName: 'Dr Muhammad', lastName: 'Shakeel', country: 'Malaysia' },
  { name: 'Unyte Group', email: 'matt@terratai.com', firstName: 'Matt', lastName: 'Lovett', country: 'Indonesia' },
  { name: 'Unyte Group', email: 'james.jamie@unyte.co.uk', firstName: 'Jamie', lastName: 'Bartley', country: 'UK' },
  { name: 'Washking', email: 'washking@washkinggh.com', firstName: 'Dieudonne', lastName: '', country: 'Ghana' },
  { name: 'Whitby Shared Wealth', email: 'brianallanson@gmail.com', firstName: 'Brian', lastName: 'Allanson', country: 'UK' }
];

const defaultPassword = 'Sharedwealth123';

async function populateDatabase() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔌 Connecting to production database...');
    await client.connect();
    console.log('✅ Connected to production database successfully');

    console.log('👥 Creating company accounts...');

    // Create admin user first
    const adminId = uuidv4();
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    
    await client.query(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        updated_at = NOW()
    `, [adminId, 'admin@sharedwealth.com', adminPasswordHash, 'Admin', 'User', 'admin', true]);

    console.log('✅ Admin user created/updated: admin@sharedwealth.com / admin123');

    let companiesCreated = 0;
    let usersCreated = 0;

    for (const company of companies) {
      try {
        // Create company record
        const companyId = uuidv4();
        await client.query(`
          INSERT INTO companies (id, name, industry, sector, location, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
          ON CONFLICT (name) DO UPDATE SET
            location = EXCLUDED.location,
            updated_at = NOW()
        `, [companyId, company.name, 'Social Enterprise', 'Business Services', company.country]);

        // Create user for company
        const userId = uuidv4();
        const passwordHash = await bcrypt.hash(defaultPassword, 10);
        
        await client.query(`
          INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_verified, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          ON CONFLICT (email) DO UPDATE SET
            password_hash = EXCLUDED.password_hash,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            role = EXCLUDED.role,
            updated_at = NOW()
        `, [userId, company.email, passwordHash, company.firstName, company.lastName, 'director', true]);

        // Create user-company relationship
        await client.query(`
          INSERT INTO user_companies (user_id, company_id, is_primary, created_at, updated_at)
          VALUES ($1, $2, $3, NOW(), NOW())
          ON CONFLICT (user_id, company_id) DO UPDATE SET
            is_primary = EXCLUDED.is_primary,
            updated_at = NOW()
        `, [userId, companyId, true]);

        companiesCreated++;
        usersCreated++;

        console.log(`✅ Created/Updated: ${company.name} - ${company.email}`);

      } catch (error) {
        console.error(`❌ Error creating ${company.name}:`, error.message);
      }
    }

    console.log(`\n📊 Database population summary:`);
    console.log(`   🏢 Companies created/updated: ${companiesCreated}`);
    console.log(`   👤 Users created/updated: ${usersCreated}`);

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
    console.log('\n🔐 Login credentials:');
    console.log('   Admin: admin@sharedwealth.com / admin123');
    console.log(`   Company Directors: {email} / ${defaultPassword}`);
    console.log('\n📧 Test with: irma@supernovaeco.com / Sharedwealth123');

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
