import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'https://sharedwealth.net/api';

const userAccounts = [
  { email: 'luis@ktalise.com', firstName: 'Luis', lastName: 'Mauch', company: 'Beplay', country: 'Brazil' },
  { email: 'stephen@carsis.consulting', firstName: 'Stephen', lastName: 'Hunt', company: 'Carsis Consulting', country: 'UK' },
  { email: 'sam@consortiaco.io', firstName: 'Sam', lastName: 'Marchetti', company: 'Consortio', country: 'Ireland' },
  { email: 'ken@africasgift.org', firstName: 'Ken', lastName: 'Dunn OBE', company: 'Eternal Flame', country: 'Lesotho' },
  { email: 'eupolisgrupa@gmail.com', firstName: 'Ranko', lastName: 'Milic', company: 'Eupolisgrupa', country: 'Croatia' },
  { email: 'emanuele.dalcarlo@fairbnb.coop', firstName: 'Emanuele', lastName: 'Dal Carlo', company: 'Fairbnb', country: 'Italy' },
  { email: 'nabikuja@gmail.com', firstName: 'Marie-Claire', lastName: 'N Kuja', company: 'Givey Ktd', country: 'Cameroon' },
  { email: 'lee.hawkins@asafgroup.org', firstName: 'Lee', lastName: 'Hawkins', company: 'Kula Eco Pads', country: 'Indonesia' },
  { email: 'james@locoso.co', firstName: 'James', lastName: 'Perry', company: 'LocoSoco PLC', country: 'UK' },
  { email: 'amjid@mediacultured.org', firstName: 'Amjid', lastName: '', company: 'Media Cultured', country: 'UK' },
  { email: 'babatundeoralusi@gmail.com', firstName: 'Hon Hareter', lastName: 'Babatune Oralusi', company: 'NCDF', country: 'Nigeria' },
  { email: 'ajinkya.dhariya@padcarelabs.com', firstName: 'Ajinkya', lastName: 'Dhariya', company: 'PadCare', country: 'India' },
  { email: 'ike.udechuku@pathwaypoints.com', firstName: 'Ike', lastName: 'Udechuku', company: 'Pathways Points', country: 'UK' },
  { email: 'neil@givey.com', firstName: 'Neil', lastName: 'Mehta', company: 'Purview Ltd', country: 'UK' },
  { email: 'jonas@researchautomators.com', firstName: 'Jonas', lastName: 'Ortman', company: 'Research Automators', country: 'Sweden' },
  { email: 'execdir@seghana.net', firstName: 'Edwin', lastName: 'Zu-Cudjoe', company: 'SE Ghana', country: 'Ghana' },
  { email: 'thesoundsenseproject@gmail.com', firstName: 'Chris', lastName: 'McCannon', company: 'SEi Caledonia', country: 'UK' },
  { email: 'amed@seiime.com', firstName: 'Amad', lastName: 'Nabi', company: 'SEi Middle East', country: 'Iraq' },
  { email: 'sei.mariabel@gmail.com', firstName: 'Mariabel', lastName: 'Dutari', company: 'SEi Tuatha', country: 'Ireland' },
  { email: 'strolltheworld@gmail.com', firstName: 'Howard', lastName: 'Weinstein', company: 'Solar Ear', country: 'Brazil' },
  { email: 'alex@sparkscot.com', firstName: 'Alex', lastName: 'Fleming', company: 'Spark', country: 'UK' },
  { email: 'irma@supernovaeco.com', firstName: 'Irma', lastName: 'Chantily', company: 'Supanova', country: 'Indonesia' },
  { email: 'gugs@lifesciences-healthcare.com', firstName: 'Gagan', lastName: 'Lushai', company: 'Sustainable Roots', country: 'UK' },
  { email: 'andy.agathangelou@transparencytaskforce.org', firstName: 'Andy', lastName: 'Agathangelou', company: 'TTF', country: 'UK' },
  { email: 'loraine@purview.co.uk', firstName: 'Loraine', lastName: 'Politi', company: 'Terratai', country: 'India' },
  { email: 'shakeelalpha@gmail.com', firstName: 'Dr Muhammad', lastName: 'Shakeel', company: 'Universiti Malaya', country: 'Malaysia' },
  { email: 'matt@terratai.com', firstName: 'Matt', lastName: 'Lovett', company: 'Unyte Group', country: 'Indonesia' },
  { email: 'james.jamie@unyte.co.uk', firstName: 'Jamie', lastName: 'Bartley', company: 'Unyte Group', country: 'UK' },
  { email: 'washking@washkinggh.com', firstName: 'Dieudonne', lastName: '', company: 'Washking', country: 'Ghana' },
  { email: 'brianallanson@gmail.com', firstName: 'Brian', lastName: 'Allanson', company: 'Whitby Shared Wealth', country: 'UK' }
];

async function createAllAccounts() {
  console.log('🚀 Creating all 30 user accounts on Render database...\n');
  
  const password = 'Sharedwealth123';
  let created = 0;
  let alreadyExists = 0;
  let failed = 0;

  for (const account of userAccounts) {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: account.email,
          password: password,
          firstName: account.firstName,
          lastName: account.lastName || 'Director'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Created: ${account.email} (${account.company})`);
        created++;
      } else if (data.message && data.message.includes('already exists')) {
        console.log(`⚠️  Already exists: ${account.email}`);
        alreadyExists++;
      } else {
        console.log(`❌ Failed: ${account.email} - ${data.message}`);
        failed++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.log(`❌ Error creating ${account.email}:`, error.message);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 ACCOUNT CREATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Created:        ${created}`);
  console.log(`⚠️  Already Existed: ${alreadyExists}`);
  console.log(`❌ Failed:         ${failed}`);
  console.log(`📊 Total:          ${userAccounts.length}`);
  console.log('='.repeat(60));
  console.log('\n🔐 Universal Password: Sharedwealth123');
  console.log('🌐 Login URL: https://sharedwealth.net\n');
}

createAllAccounts().catch(console.error);
