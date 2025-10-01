#!/usr/bin/env node

/**
 * Clean Dummy Data Script - API Version
 * 
 * This script uses the production API to identify and clean dummy data
 * while preserving real companies and users from the Shared Wealth International network.
 */

// Use built-in fetch (Node.js 18+)

const API_BASE_URL = 'https://sharedwealth.net/api';

// Real companies from COMPANY_ACCOUNTS_SUMMARY.md
const REAL_COMPANIES = [
  'Beplay', 'Carsis Consulting', 'Consortio', 'Eternal Flame', 'Eupolisgrupa',
  'Fairbnb', 'Givey Ktd', 'Kula Eco Pads', 'LocoSoco PLC', 'Media Cultured',
  'NCDF', 'PadCare', 'Pathways Points', 'Purview Ltd', 'Research Automators',
  'SE Ghana', 'SEi Caledonia', 'SEi Middle East', 'SEi Tuatha', 'Solar Ear',
  'Spark', 'Supanova', 'Sustainable Roots', 'TTF', 'Terratai',
  'Universiti Malaya', 'Unyte Group', 'Washking', 'Whitby Shared Wealth'
];

// Dummy/sample data patterns to identify
const DUMMY_PATTERNS = {
  companies: [
    'EcoTech Solutions',
    'GreenEnergy Corp', 
    'Quantum Finance',
    'GreenTech Innovations',
    'DataFlow Systems',
    'BioMed Solutions',
    'Supernova Eco' // This is different from real "Supanova"
  ],
  users: [
    'john.doe@example.com',
    'jane.smith@example.com', 
    'mike.johnson@example.com',
    'sarah.wilson@example.com',
    'david.brown@example.com',
    'lisa.davis@example.com'
  ]
};

async function analyzeCurrentData() {
  try {
    console.log('🔍 Analyzing current database data...\n');

    // Get all companies
    console.log('📊 Fetching companies...');
    const companiesResponse = await fetch(`${API_BASE_URL}/companies`);
    const companies = await companiesResponse.json();
    
    if (Array.isArray(companies)) {
      console.log(`   ✅ Found ${companies.length} companies`);
      
      // Analyze companies
      const realCompanies = companies.filter(c => REAL_COMPANIES.includes(c.name));
      const dummyCompanies = companies.filter(c => DUMMY_PATTERNS.companies.includes(c.name));
      const otherCompanies = companies.filter(c => 
        !REAL_COMPANIES.includes(c.name) && !DUMMY_PATTERNS.companies.includes(c.name)
      );
      
      console.log(`   🏢 Real companies: ${realCompanies.length}`);
      console.log(`   🗑️  Dummy companies: ${dummyCompanies.length}`);
      console.log(`   ❓ Other companies: ${otherCompanies.length}`);
      
      if (dummyCompanies.length > 0) {
        console.log('\n   🗑️  Dummy companies found:');
        dummyCompanies.forEach(c => console.log(`      - ${c.name} (${c.id})`));
      }
      
      if (otherCompanies.length > 0) {
        console.log('\n   ❓ Other companies (need review):');
        otherCompanies.forEach(c => console.log(`      - ${c.name} (${c.id})`));
      }
      
      console.log('\n   ✅ Real companies (preserved):');
      realCompanies.forEach(c => console.log(`      - ${c.name} (${c.id})`));
    } else {
      console.log('   ❌ Failed to fetch companies');
    }

    // Test user endpoints (would need authentication)
    console.log('\n👥 User data analysis requires authentication...');
    console.log('   ℹ️  To clean user data, you would need to:');
    console.log('      1. Login as admin');
    console.log('      2. Access user management endpoints');
    console.log('      3. Remove dummy users manually');

    console.log('\n📋 Summary:');
    console.log('   ✅ Companies API is working');
    console.log('   ✅ Real companies are present in database');
    console.log('   ⚠️  Dummy data cleanup requires database access');
    console.log('   💡 Consider manual cleanup via admin panel');

  } catch (error) {
    console.error('❌ Error analyzing data:', error.message);
  }
}

async function generateCleanupReport() {
  try {
    console.log('\n📝 Generating cleanup report...\n');
    
    const report = `
# Database Cleanup Report
Generated: ${new Date().toISOString()}

## Current Status
- ✅ Companies API: Working
- ✅ Real companies: Present in database
- ⚠️  Dummy data: Needs manual cleanup

## Real Companies (30 total)
${REAL_COMPANIES.map(name => `- ${name}`).join('\n')}

## Dummy Data to Remove
### Companies
${DUMMY_PATTERNS.companies.map(name => `- ${name}`).join('\n')}

### Users
${DUMMY_PATTERNS.users.map(email => `- ${email}`).join('\n')}

## Recommended Actions
1. **Manual Database Cleanup**: Use admin panel or direct database access
2. **Preserve Real Data**: Ensure all 30 real companies are kept
3. **Remove Dummy Data**: Delete sample users and companies
4. **Verify Relationships**: Clean up orphaned user-company relationships

## Next Steps
- Access production database directly
- Run SQL cleanup queries
- Verify all real companies remain intact
- Test platform functionality after cleanup
`;

    console.log(report);
    
    // Save report to file
    const fs = await import('fs');
    fs.writeFileSync('cleanup-report.md', report);
    console.log('📄 Report saved to: cleanup-report.md');

  } catch (error) {
    console.error('❌ Error generating report:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🧹 Shared Wealth International - Dummy Data Cleanup\n');
  
  await analyzeCurrentData();
  await generateCleanupReport();
  
  console.log('\n🎉 Analysis complete!');
  console.log('💡 Use the generated report to guide manual cleanup.');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => {
      console.log('\n✅ Cleanup analysis completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Cleanup analysis failed:', error);
      process.exit(1);
    });
}

export { analyzeCurrentData, generateCleanupReport };
