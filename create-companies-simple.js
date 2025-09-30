import { Client } from 'pg';

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

async function createCompaniesSimple() {
  console.log('🔧 Creating companies with simple insert...');
  
  const client = new Client({
    connectionString: 'postgresql://shared_wealth_db_user:fQ36Pb3VRDUHD6UsiqmeLCNG0KLXtYSd@dpg-d3ballbe5dus73cddqs0-a.oregon-postgres.render.com/shared_wealth_db?sslmode=require'
  });

  try {
    await client.connect();
    console.log('✅ Connected to Render database successfully!');

    console.log('🏢 Creating company records and linking users...');
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

        // Check if company already exists
        const existingCompany = await client.query('SELECT id FROM companies WHERE name = $1', [company.name]);
        
        let companyId;
        if (existingCompany.rows.length > 0) {
          companyId = existingCompany.rows[0].id;
          console.log(`⚠️ Company already exists: ${company.name} (ID: ${companyId})`);
        } else {
          // Create company record
          const companyResult = await client.query(`
            INSERT INTO companies (name, description, industry, location, website, is_active, is_verified)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
          `, [
            company.name,
            `${company.name} is a partner company of Shared Wealth International, committed to equitable wealth distribution and inclusive business practices.`,
            'Social Enterprise',
            company.country,
            `https://${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
            true,
            true
          ]);

          companyId = companyResult.rows[0].id;
          console.log(`✅ Created company: ${company.name} (ID: ${companyId})`);
        }

        // Check if user-company relationship already exists
        const existingLink = await client.query(
          'SELECT id FROM user_companies WHERE user_id = $1 AND company_id = $2', 
          [userId, companyId]
        );
        
        if (existingLink.rows.length > 0) {
          console.log(`⚠️ User-company link already exists: ${company.email} -> ${company.name}`);
        } else {
          // Create user-company relationship
          const linkResult = await client.query(`
            INSERT INTO user_companies (user_id, company_id, is_primary)
            VALUES ($1, $2, $3)
            RETURNING id
          `, [
            userId,
            companyId,
            true
          ]);

          console.log(`✅ Created user-company link: ${company.email} -> ${company.name}`);
        }

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

createCompaniesSimple().catch(console.error);
