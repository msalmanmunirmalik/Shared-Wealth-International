import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Company data from COMPANY_ACCOUNTS_SUMMARY.md
const companies = [
  { name: 'Beplay', contact: 'Luis Mauch', email: 'luis@ktalise.com', country: 'Brazil' },
  { name: 'Carsis Consulting', contact: 'Stephen Hunt', email: 'stephen@carsis.consulting', country: 'UK' },
  { name: 'Consortio', contact: 'Sam Marchetti', email: 'sam@consortiaco.io', country: 'Ireland' },
  { name: 'Eternal Flame', contact: 'Ken Dunn OBE', email: 'ken@africasgift.org', country: 'Lesotho' },
  { name: 'Eupolisgrupa', contact: 'Ranko Milic', email: 'eupolisgrupa@gmail.com', country: 'Croatia' },
  { name: 'Fairbnb', contact: 'Emanuele Dal Carlo', email: 'emanuele.dalcarlo@fairbnb.coop', country: 'Italy' },
  { name: 'Givey Ktd', contact: 'Marie-Claire N Kuja', email: 'nabikuja@gmail.com', country: 'Cameroon' },
  { name: 'Kula Eco Pads', contact: 'Lee Hawkins', email: 'lee.hawkins@asafgroup.org', country: 'Indonesia' },
  { name: 'LocoSoco PLC', contact: 'James Perry', email: 'james@locoso.co', country: 'UK' },
  { name: 'Media Cultured', contact: 'Amjid', email: 'amjid@mediacultured.org', country: 'UK' },
  { name: 'NCDF', contact: 'Hon Hareter Babatune Oralusi', email: 'babatundeoralusi@gmail.com', country: 'Nigeria' },
  { name: 'PadCare', contact: 'Ajinkya Dhariya', email: 'ajinkya.dhariya@padcarelabs.com', country: 'India' },
  { name: 'Pathways Points', contact: 'Ike Udechuku', email: 'ike.udechuku@pathwaypoints.com', country: 'UK' },
  { name: 'Purview Ltd', contact: 'Neil Mehta', email: 'neil@givey.com', country: 'UK' },
  { name: 'Research Automators', contact: 'Jonas Ortman', email: 'jonas@researchautomators.com', country: 'Sweden' },
  { name: 'SE Ghana', contact: 'Edwin Zu-Cudjoe', email: 'execdir@seghana.net', country: 'Ghana' },
  { name: 'SEi Caledonia', contact: 'Chris McCannon', email: 'thesoundsenseproject@gmail.com', country: 'UK' },
  { name: 'SEi Middle East', contact: 'Amad Nabi', email: 'amed@seiime.com', country: 'Iraq' },
  { name: 'SEi Tuatha', contact: 'Mariabel Dutari', email: 'sei.mariabel@gmail.com', country: 'Ireland' },
  { name: 'Solar Ear', contact: 'Howard Weinstein', email: 'strolltheworld@gmail.com', country: 'Brazil' },
  { name: 'Spark', contact: 'Alex Fleming', email: 'alex@sparkscot.com', country: 'UK' },
  { name: 'Supanova', contact: 'Irma Chantily', email: 'irma@supernovaeco.com', country: 'Indonesia' },
  { name: 'Sustainable Roots', contact: 'Gagan Lushai', email: 'gugs@lifesciences-healthcare.com', country: 'UK' },
  { name: 'TTF', contact: 'Andy Agathangelou', email: 'andy.agathangelou@transparencytaskforce.org', country: 'UK' },
  { name: 'Terratai', contact: 'Loraine Politi', email: 'loraine@purview.co.uk', country: 'India' },
  { name: 'Universiti Malaya', contact: 'Dr Muhammad Shakeel', email: 'shakeelalpha@gmail.com', country: 'Malaysia' },
  { name: 'Unyte Group', contact: 'Matt Lovett', email: 'matt@terratai.com', country: 'Indonesia' },
  { name: 'Unyte Group', contact: 'Jamie Bartley', email: 'james.jamie@unyte.co.uk', country: 'UK' },
  { name: 'Washking', contact: 'Dieudonne', email: 'washking@washkinggh.com', country: 'Ghana' },
  { name: 'Whitby Shared Wealth', contact: 'Brian Allanson', email: 'brianallanson@gmail.com', country: 'UK' }
];

async function properDatabaseSetup() {
  console.log('🔧 Setting up proper database connection...');
  
  // Render PostgreSQL connection details from your dashboard
  const client = new Client({
    host: 'dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com',
    port: 5432,
    database: 'shared_wealth_db',
    user: 'shared_wealth_db_user',
    password: 'Sharedwealth123', // Your database password
    ssl: {
      rejectUnauthorized: false,
      require: true
    }
  });

  try {
    console.log('🔌 Connecting to your Render PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected to Render database successfully!');

    // Check existing tables
    console.log('🔍 Checking existing database tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Existing tables:', tablesResult.rows.map(row => row.table_name));

    // Create companies table if it doesn't exist
    console.log('🏗️ Creating companies table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        industry VARCHAR(100),
        sector VARCHAR(100),
        size VARCHAR(50) CHECK (size IN ('startup', 'small', 'medium', 'large')),
        location VARCHAR(255),
        website VARCHAR(255),
        logo_url VARCHAR(500),
        logo_file_path VARCHAR(500),
        countries TEXT[],
        employees INTEGER,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        is_shared_wealth_licensed BOOLEAN DEFAULT false,
        license_number VARCHAR(100),
        license_date DATE,
        applicant_role VARCHAR(100),
        applicant_position VARCHAR(100),
        applicant_user_id UUID REFERENCES users(id),
        created_by_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Companies table ready');

    // Create user_companies table if it doesn't exist
    console.log('🏗️ Creating user_companies table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'director')),
        position VARCHAR(100),
        is_primary BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, company_id)
      );
    `);
    console.log('✅ User companies table ready');

    // Create indexes for performance
    console.log('🚀 Creating database indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
      CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
      CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);
    `);
    console.log('✅ Database indexes created');

    console.log('\n🏢 Creating company records and linking users...');
    let successCount = 0;
    let errorCount = 0;

    for (const company of companies) {
      try {
        console.log(`\n📝 Processing: ${company.name} (${company.contact})`);
        
        // Get user ID
        const userResult = await client.query('SELECT id FROM users WHERE email = $1', [company.email]);
        
        if (userResult.rows.length === 0) {
          console.log(`⚠️ User not found: ${company.email}`);
          errorCount++;
          continue;
        }

        const userId = userResult.rows[0].id;
        console.log(`✅ Found user: ${company.email} (ID: ${userId})`);

        // Create company record
        const companyResult = await client.query(`
          INSERT INTO companies (name, description, industry, sector, size, location, website, status, applicant_user_id, created_by_admin)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (name) DO UPDATE SET
            description = EXCLUDED.description,
            status = 'approved',
            updated_at = CURRENT_TIMESTAMP
          RETURNING id
        `, [
          company.name,
          `${company.name} is a partner company of Shared Wealth International, committed to equitable wealth distribution and inclusive business practices. We work together to create a more just and sustainable economy.`,
          'Social Enterprise',
          'Various',
          'medium',
          company.country,
          `https://${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
          'approved',
          userId,
          true
        ]);

        const companyId = companyResult.rows[0].id;
        console.log(`✅ Company ready: ${company.name} (ID: ${companyId})`);

        // Create user-company relationship
        const linkResult = await client.query(`
          INSERT INTO user_companies (user_id, company_id, role, position, is_primary, status)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (user_id, company_id) DO UPDATE SET
            role = 'director',
            position = 'Company Director',
            status = 'active',
            updated_at = CURRENT_TIMESTAMP
          RETURNING id
        `, [
          userId,
          companyId,
          'director',
          'Company Director',
          true,
          'active'
        ]);

        console.log(`✅ User linked to company: ${company.email} -> ${company.name}`);
        successCount++;

      } catch (error) {
        console.log(`❌ Error processing ${company.name}: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log(`✅ Successfully processed: ${successCount} companies`);
    console.log(`❌ Failed: ${errorCount} companies`);
    console.log(`📊 Total processed: ${companies.length} companies`);
    console.log('\n🚀 Your dashboard should now show all companies and network data!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

properDatabaseSetup().catch(console.error);
