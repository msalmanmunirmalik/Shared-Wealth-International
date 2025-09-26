#!/usr/bin/env node

/**
 * Company User Account Creation Script
 * Creates user accounts for all Shared Wealth International partner companies
 * Password: Sharedwealth123
 */

import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sharedwealth',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Company data from the provided list
const companies = [
  {
    company_name: 'SEi Caledonia',
    contact_person: 'Chris McCannon',
    email: 'thesoundsenseproject@gmail.com',
    phone: '44 7857 262810',
    website: 'NA',
    country: 'UK'
  },
  {
    company_name: 'Pathways Points',
    contact_person: 'Ike Udechuku',
    email: 'ike.udechuku@pathwaypoints.com',
    phone: '',
    website: 'https://www.pathwaypoints.com/',
    country: 'UK'
  },
  {
    company_name: 'Eternal Flame',
    contact_person: 'Ken Dunn OBE',
    email: 'ken@africasgift.org',
    phone: '44 7528 529766',
    website: 'https://eternalflameworldwide.com/',
    country: 'Lesotho'
  },
  {
    company_name: 'SE Ghana',
    contact_person: 'Edwin Zu-Cudjoe',
    email: 'execdir@seghana.net',
    phone: '233 24 404 6334',
    website: 'https://seghana.net/',
    country: 'Ghana'
  },
  {
    company_name: 'NCDF',
    contact_person: 'Hon Hareter Babatune Oralusi',
    email: 'babatundeoralusi@gmail.com',
    phone: '234 701 112 2002',
    website: 'https://ncdfgroup.com/',
    country: 'Nigeria'
  },
  {
    company_name: 'Research Automators',
    contact_person: 'Jonas Ortman',
    email: 'jonas@researchautomators.com',
    phone: '46 0855693653',
    website: 'https://researchautomators.com/',
    country: 'Sweden'
  },
  {
    company_name: 'Sustainable Roots',
    contact_person: 'Gagan Lushai',
    email: 'gugs@lifesciences-healthcare.com',
    phone: '44 7837 181388',
    website: 'https://sustainable-roots.com/',
    country: 'UK'
  },
  {
    company_name: 'Washking',
    contact_person: 'Dieudonne',
    email: 'washking@washkinggh.com',
    phone: '233 24 088 6645',
    website: 'https://www.washkinggh.com/',
    country: 'Ghana'
  },
  {
    company_name: 'Letstern',
    contact_person: 'Dr Salman Malik',
    email: 'msalmanmunirmalik@outlook.com',
    phone: '39 348 602 5147',
    website: 'https://letstern.com/',
    country: 'Italy'
  },
  {
    company_name: 'Solar Ear',
    contact_person: 'Howard Weinstein',
    email: 'strolltheworld@gmail.com',
    phone: '55 11 99911 0050',
    website: 'https://solarear.com.br/',
    country: 'Brazil'
  },
  {
    company_name: 'TTF',
    contact_person: 'Andy Agathangelou',
    email: 'andy.agathangelou@transparencytaskforce.org',
    phone: '',
    website: 'https://transparencytaskforce.org/',
    country: 'UK'
  },
  {
    company_name: 'SEi Tuatha',
    contact_person: 'Mariabel Dutari',
    email: 'sei.mariabel@gmail.com',
    phone: '507 6026 0459',
    website: 'https://www.sei-tuatha.com/',
    country: 'Ireland'
  },
  {
    company_name: 'LocoSoco PLC',
    contact_person: 'James Perry',
    email: 'james@locoso.co',
    phone: '44 7900 070073',
    website: 'https://locoso.co/',
    country: 'UK'
  },
  {
    company_name: 'Supanova',
    contact_person: 'Irma Chantily',
    email: 'irma@supernovaeco.com',
    phone: '62 813 1676 8841',
    website: 'https://supernovaeco.com/',
    country: 'Indonesia'
  },
  {
    company_name: 'Whitby Shared Wealth',
    contact_person: 'Brian Allanson',
    email: 'brianallanson@gmail.com',
    phone: '44 7973 851908',
    website: 'NA',
    country: 'UK'
  },
  {
    company_name: 'Fairbnb',
    contact_person: 'Emanuele Dal Carlo',
    email: 'emanuele.dalcarlo@fairbnb.coop',
    phone: '39 348 401 3971',
    website: 'https://fairbnb.coop/',
    country: 'Italy'
  },
  {
    company_name: 'Eupolisgrupa',
    contact_person: 'Ranko Milic',
    email: 'eupolisgrupa@gmail.com',
    phone: '385 98 170 1533',
    website: 'https://eupolisgrupa.hr/',
    country: 'Croatia'
  },
  {
    company_name: 'Carsis Consulting',
    contact_person: 'Stephen Hunt',
    email: 'stephen@carsis.consulting',
    phone: '44 7468 513840',
    website: 'https://carsis.consulting/',
    country: 'UK'
  },
  {
    company_name: 'SEi Middle East',
    contact_person: 'Amad Nabi',
    email: 'amed@seiime.com',
    phone: '44 7312 862242',
    website: 'https://seiime.com/',
    country: 'Iraq'
  },
  {
    company_name: 'Media Cultured',
    contact_person: 'Amjid',
    email: 'amjid@mediacultured.org',
    phone: '44 7980 786796',
    website: 'https://www.mediacultured.org/',
    country: 'UK'
  },
  {
    company_name: 'Consortio',
    contact_person: 'Sam Marchetti',
    email: 'sam@consortiaco.io',
    phone: '353 85 127 3099',
    website: 'https://www.consortiaco.io/',
    country: 'Ireland'
  },
  {
    company_name: 'Spark',
    contact_person: 'Alex Fleming',
    email: 'alex@sparkscot.com',
    phone: '44 7833 325262',
    website: 'http://www.sparkscot.com/',
    country: 'UK'
  },
  {
    company_name: 'Kula Eco Pads',
    contact_person: 'Lee Hawkins',
    email: 'lee.hawkins@asafgroup.org',
    phone: '',
    website: 'https://www.asafgroup.org/',
    country: 'Indonesia'
  },
  {
    company_name: 'Givey Ktd',
    contact_person: 'Marie-Claire N Kuja',
    email: 'nabikuja@gmail.com',
    phone: '',
    website: 'https://www.kujaecopads.com/',
    country: 'Cameroon'
  },
  {
    company_name: 'Purview Ltd',
    contact_person: 'Neil Mehta',
    email: 'neil@givey.com',
    phone: '',
    website: 'https://www.givey.com/',
    country: 'UK'
  },
  {
    company_name: 'Terratai',
    contact_person: 'Loraine Politi',
    email: 'loraine@purview.co.uk',
    phone: '44 7538 192071',
    website: 'https://purviewservices.com/',
    country: 'India'
  },
  {
    company_name: 'Unyte Group',
    contact_person: 'Matt Lovett',
    email: 'matt@terratai.com',
    phone: '',
    website: 'https://terratai.com/',
    country: 'Indonesia'
  },
  {
    company_name: 'Unyte Group',
    contact_person: 'Jamie Bartley',
    email: 'james.jamie@unyte.co.uk',
    phone: '',
    website: 'https://unyte.co.uk/',
    country: 'UK'
  },
  {
    company_name: 'Universiti Malaya',
    contact_person: 'Dr Muhammad Shakeel',
    email: 'shakeelalpha@gmail.com',
    phone: '',
    website: 'https://www.um.edu.my/',
    country: 'Malaysia'
  },
  {
    company_name: 'Beplay',
    contact_person: 'Luis Mauch',
    email: 'luis@ktalise.com',
    phone: '55 11 98339-5663',
    website: 'https://beplay.io/',
    country: 'Brazil'
  },
  {
    company_name: 'PadCare',
    contact_person: 'Ajinkya Dhariya',
    email: 'ajinkya.dhariya@padcarelabs.com',
    phone: '',
    website: 'https://www.padcarelabs.com/',
    country: 'India'
  }
];

const PASSWORD = 'Sharedwealth123';

async function createUserAccount(company) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [company.email]
    );

    if (existingUser.rows.length > 0) {
      console.log(`⚠️  User already exists: ${company.email}`);
      await client.query('ROLLBACK');
      return { success: false, message: 'User already exists', email: company.email };
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(PASSWORD, 12);

    // Extract first and last name from contact person
    const nameParts = company.contact_person.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Insert user into database
    const userResult = await client.query(
      `INSERT INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        phone, 
        role, 
        is_active, 
        is_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id, email, first_name, last_name`,
      [
        company.email,
        passwordHash,
        firstName,
        lastName,
        company.phone || null,
        'director', // All company contacts are directors
        true, // is_active
        true  // email_verified
      ]
    );

    const newUser = userResult.rows[0];

    // Check if company already exists
    const existingCompany = await client.query(
      'SELECT id FROM companies WHERE name = $1',
      [company.company_name]
    );

    let companyId;
    if (existingCompany.rows.length > 0) {
      companyId = existingCompany.rows[0].id;
      console.log(`📋 Using existing company: ${company.company_name}`);
    } else {
      // Create new company
      const companyResult = await client.query(
      `INSERT INTO companies (
        name, 
        description, 
        industry, 
        location, 
        website, 
        status, 
        applicant_user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id, name`,
      [
        company.company_name,
        `Contact: ${company.contact_person}`,
        'Social Enterprise', // Default industry
        company.country,
        company.website === 'NA' ? null : company.website,
        'approved', // Auto-approve company accounts
        newUser.id
      ]
      );
      companyId = companyResult.rows[0].id;
      console.log(`🏢 Created company: ${company.company_name}`);
    }

    // Link user to company
    await client.query(
      `INSERT INTO user_companies (
        user_id, 
        company_id, 
        role, 
        is_primary
      ) VALUES ($1, $2, $3, $4)`,
      [
        newUser.id,
        companyId,
        'Contact Person',
        true // is_primary
      ]
    );

    await client.query('COMMIT');
    console.log(`✅ Created account: ${newUser.email} (${company.company_name})`);
    
    return { 
      success: true, 
      user: newUser, 
      email: company.email,
      company: company.company_name
    };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Error creating account for ${company.email}:`, error.message);
    return { 
      success: false, 
      error: error.message, 
      email: company.email 
    };
  } finally {
    client.release();
  }
}

async function main() {
  console.log('🚀 Creating Shared Wealth International Company Accounts');
  console.log('=====================================================');
  console.log(`📊 Total companies to process: ${companies.length}`);
  console.log(`🔐 Password for all accounts: ${PASSWORD}`);
  console.log('');

  const results = {
    successful: [],
    failed: [],
    existing: []
  };

  // Process each company
  for (const company of companies) {
    const result = await createUserAccount(company);
    
    if (result.success) {
      results.successful.push(result);
    } else if (result.message === 'User already exists') {
      results.existing.push(result);
    } else {
      results.failed.push(result);
    }
  }

  // Summary
  console.log('');
  console.log('📊 ACCOUNT CREATION SUMMARY');
  console.log('===========================');
  console.log(`✅ Successfully created: ${results.successful.length}`);
  console.log(`⚠️  Already existed: ${results.existing.length}`);
  console.log(`❌ Failed to create: ${results.failed.length}`);
  console.log('');

  if (results.successful.length > 0) {
    console.log('✅ SUCCESSFULLY CREATED ACCOUNTS:');
    results.successful.forEach(result => {
      console.log(`   • ${result.email} (${result.company})`);
    });
    console.log('');
  }

  if (results.existing.length > 0) {
    console.log('⚠️  ALREADY EXISTING ACCOUNTS:');
    results.existing.forEach(result => {
      console.log(`   • ${result.email}`);
    });
    console.log('');
  }

  if (results.failed.length > 0) {
    console.log('❌ FAILED ACCOUNTS:');
    results.failed.forEach(result => {
      console.log(`   • ${result.email}: ${result.error}`);
    });
    console.log('');
  }

  // Verify total active users
  try {
    const client = await pool.connect();
    const activeUsers = await client.query(
      'SELECT COUNT(*) as count FROM users WHERE is_active = true'
    );
    console.log(`📈 Total active users in database: ${activeUsers.rows[0].count}`);
    client.release();
  } catch (error) {
    console.error('Error counting active users:', error.message);
  }

  console.log('');
  console.log('🎉 Account creation process completed!');
  console.log('🔐 All accounts use password: Sharedwealth123');
  console.log('👥 All users have "director" role and are active');
  
  await pool.end();
}

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// Run the script
main().catch(console.error);
