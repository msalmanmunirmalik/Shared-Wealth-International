import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://sharedwealth.net/api';

// Helper to generate unique email
const generateUniqueEmail = () => {
    return `testcompany_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@example.com`;
};

const testCompanies = [
    {
        name: 'GreenTech Solutions',
        description: 'Sustainable technology solutions for a better future',
        industry: 'Technology',
        sector: 'Clean Energy',
        size: '50-200',
        location: 'San Francisco, CA',
        website: 'https://greentech-solutions.com'
    },
    {
        name: 'EcoFriendly Manufacturing',
        description: 'Environmentally conscious manufacturing processes',
        industry: 'Manufacturing',
        sector: 'Sustainability',
        size: '200-500',
        location: 'Portland, OR',
        website: 'https://ecofriendly-mfg.com'
    },
    {
        name: 'Social Impact Ventures',
        description: 'Investment firm focused on social and environmental impact',
        industry: 'Finance',
        sector: 'Impact Investing',
        size: '10-50',
        location: 'New York, NY',
        website: 'https://socialimpact-ventures.com'
    },
    {
        name: 'Community Development Corp',
        description: 'Building stronger communities through sustainable development',
        industry: 'Real Estate',
        sector: 'Community Development',
        size: '100-500',
        location: 'Chicago, IL',
        website: 'https://community-dev-corp.com'
    },
    {
        name: 'Renewable Energy Partners',
        description: 'Leading provider of renewable energy solutions',
        industry: 'Energy',
        sector: 'Renewable Energy',
        size: '500+',
        location: 'Austin, TX',
        website: 'https://renewable-energy-partners.com'
    }
];

async function createTestCompanies() {
    console.log('🌱 Creating test companies via signup...');
    console.log('============================================================\n');

    const results = [];

    for (let i = 0; i < testCompanies.length; i++) {
        const company = testCompanies[i];
        const email = generateUniqueEmail();
        const password = 'TestPassword123!';
        
        console.log(`${i + 1}. Creating: ${company.name}`);
        console.log(`   Email: ${email}`);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    firstName: 'Test',
                    lastName: 'User',
                    phone: '1234567890',
                    role: 'user',
                    companyName: company.name,
                    position: 'Founder',
                    bio: `Test user for ${company.name}`,
                    location: company.location,
                    website: company.website,
                    linkedin: '',
                    twitter: '',
                    profileImage: ''
                }),
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                console.log(`   ✅ Created successfully`);
                console.log(`   User ID: ${result.data.userId}`);
                results.push({
                    name: company.name,
                    email: email,
                    status: 'success',
                    userId: result.data.userId
                });
            } else {
                console.log(`   ❌ Failed: ${result.message || JSON.stringify(result)}`);
                results.push({
                    name: company.name,
                    email: email,
                    status: 'failed',
                    error: result.message || JSON.stringify(result)
                });
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            results.push({
                name: company.name,
                email: email,
                status: 'error',
                error: error.message
            });
        }
        
        console.log(''); // Empty line for readability
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('============================================================');
    console.log('📊 Results Summary:');
    console.log('============================================================');
    
    const successful = results.filter(r => r.status === 'success');
    const failed = results.filter(r => r.status !== 'success');
    
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    
    if (successful.length > 0) {
        console.log('\n✅ Successfully created companies:');
        successful.forEach(r => console.log(`   - ${r.name} (${r.email})`));
    }
    
    if (failed.length > 0) {
        console.log('\n❌ Failed to create companies:');
        failed.forEach(r => console.log(`   - ${r.name}: ${r.error}`));
    }
    
    console.log('\n============================================================');
    
    if (successful.length > 0) {
        console.log('🎉 Test companies created successfully!');
        console.log('You can now run the E2E test script.');
    } else {
        console.log('❌ No companies were created. Please check the errors above.');
    }
}

createTestCompanies();
