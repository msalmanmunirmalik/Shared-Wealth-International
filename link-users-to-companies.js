import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'https://sharedwealth.net/api';

// User-Company mappings from COMPANY_ACCOUNTS_SUMMARY.md
const userCompanyMappings = [
  { email: 'luis@ktalise.com', companyName: 'Beplay', position: 'Director' },
  { email: 'stephen@carsis.consulting', companyName: 'Carsis Consulting', position: 'Director' },
  { email: 'sam@consortiaco.io', companyName: 'Consortio', position: 'Director' },
  { email: 'ken@africasgift.org', companyName: 'Eternal Flame', position: 'Director' },
  { email: 'eupolisgrupa@gmail.com', companyName: 'Eupolisgrupa', position: 'Director' },
  { email: 'emanuele.dalcarlo@fairbnb.coop', companyName: 'Fairbnb', position: 'Director' },
  { email: 'nabikuja@gmail.com', companyName: 'Givey Ktd', position: 'Director' },
  { email: 'lee.hawkins@asafgroup.org', companyName: 'Kula Eco Pads', position: 'Director' },
  { email: 'james@locoso.co', companyName: 'LocoSoco PLC', position: 'Director' },
  { email: 'amjid@mediacultured.org', companyName: 'Media Cultured', position: 'Director' },
  { email: 'babatundeoralusi@gmail.com', companyName: 'NCDF', position: 'Director' },
  { email: 'ajinkya.dhariya@padcarelabs.com', companyName: 'PadCare', position: 'Director' },
  { email: 'ike.udechuku@pathwaypoints.com', companyName: 'Pathways Points', position: 'Director' },
  { email: 'neil@givey.com', companyName: 'Purview Ltd', position: 'Director' },
  { email: 'jonas@researchautomators.com', companyName: 'Research Automators', position: 'Director' },
  { email: 'execdir@seghana.net', companyName: 'SE Ghana', position: 'Director' },
  { email: 'thesoundsenseproject@gmail.com', companyName: 'SEi Caledonia', position: 'Director' },
  { email: 'amed@seiime.com', companyName: 'SEi Middle East', position: 'Director' },
  { email: 'sei.mariabel@gmail.com', companyName: 'SEi Tuatha', position: 'Director' },
  { email: 'strolltheworld@gmail.com', companyName: 'Solar Ear', position: 'Director' },
  { email: 'alex@sparkscot.com', companyName: 'Spark', position: 'Director' },
  { email: 'irma@supernovaeco.com', companyName: 'Supanova', position: 'Director' },
  { email: 'gugs@lifesciences-healthcare.com', companyName: 'Sustainable Roots', position: 'Director' },
  { email: 'andy.agathangelou@transparencytaskforce.org', companyName: 'TTF', position: 'Director' },
  { email: 'loraine@purview.co.uk', companyName: 'Terratai', position: 'Director' },
  { email: 'shakeelalpha@gmail.com', companyName: 'Universiti Malaya', position: 'Director' },
  { email: 'matt@terratai.com', companyName: 'Unyte Group', position: 'Director' },
  { email: 'james.jamie@unyte.co.uk', companyName: 'Unyte Group', position: 'Director' },
  { email: 'washking@washkinggh.com', companyName: 'Washking', position: 'Director' },
  { email: 'brianallanson@gmail.com', companyName: 'Whitby Shared Wealth', position: 'Director' }
];

async function linkUsersToCompanies() {
  console.log('🔗 Linking users to their companies...\n');
  
  try {
    // Step 1: Get all companies to create a name-to-id map
    console.log('📋 Step 1: Fetching all companies...');
    const companiesResponse = await fetch(`${API_URL}/companies`);
    const companiesData = await companiesResponse.json();
    const companies = companiesData.data || companiesData;
    
    const companyMap = {};
    companies.forEach(company => {
      companyMap[company.name] = company.id;
    });
    
    console.log(`✅ Loaded ${companies.length} companies\n`);

    // Step 2: Get all users to create an email-to-id map
    console.log('📋 Step 2: Getting user IDs...');
    
    // We'll need to sign in as each user to get their ID, or create an endpoint
    // For now, let's create the relationships directly via an API endpoint
    
    console.log('📋 Step 3: Creating user-company relationships...\n');
    
    let created = 0;
    let alreadyExists = 0;
    let failed = 0;

    for (const mapping of userCompanyMappings) {
      try {
        // Sign in as the user to get their ID and token
        const signinResponse = await fetch(`${API_URL}/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: mapping.email,
            password: 'Sharedwealth123'
          })
        });

        if (!signinResponse.ok) {
          console.log(`❌ Failed to sign in as ${mapping.email}`);
          failed++;
          continue;
        }

        const signinData = await signinResponse.json();
        const userId = signinData.session.user.id;
        const token = signinData.session.access_token;
        const companyId = companyMap[mapping.companyName];

        if (!companyId) {
          console.log(`⚠️  Company not found: ${mapping.companyName} for ${mapping.email}`);
          failed++;
          continue;
        }

        // Create user-company relationship via API endpoint
        const linkResponse = await fetch(`${API_URL}/setup/link-user-company`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            companyId: companyId,
            position: mapping.position,
            role: 'director'
          })
        });

        const linkData = await linkResponse.json();
        
        if (linkResponse.ok) {
          if (linkData.data?.alreadyExists) {
            console.log(`⚠️  ${mapping.email} → ${mapping.companyName} (already linked)`);
            alreadyExists++;
          } else {
            console.log(`✅ ${mapping.email} → ${mapping.companyName} (linked)`);
            created++;
          }
        } else {
          console.log(`❌ Failed to link ${mapping.email}: ${linkData.message}`);
          failed++;
        }

        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.log(`❌ Error processing ${mapping.email}:`, error.message);
        failed++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 USER-COMPANY LINKING SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Identified:     ${created}`);
    console.log(`⚠️  Already Exists: ${alreadyExists}`);
    console.log(`❌ Failed:         ${failed}`);
    console.log(`📊 Total:          ${userCompanyMappings.length}`);
    console.log('='.repeat(60));
    
    // Return the data for creating relationships
    return { created, failed, alreadyExists };

  } catch (error) {
    console.error('❌ Linking failed:', error.message);
  }
}

linkUsersToCompanies().catch(console.error);
