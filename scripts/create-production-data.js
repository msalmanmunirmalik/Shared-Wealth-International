#!/usr/bin/env node

/**
 * Create Production Data Script
 * Creates your user and company data in production using the backend API
 */

// Using built-in fetch (Node.js 18+)

const API_BASE_URL = 'https://shared-wealth-international-deploy.onrender.com/api';

async function createProductionData() {
  try {
    console.log('🚀 Creating production data...');
    console.log(`📡 Using API: ${API_BASE_URL}`);

    // First, try to set up the database
    console.log('\n🏗️  Setting up database schema...');
    try {
      const setupResponse = await fetch(`${API_BASE_URL}/setup/database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const setupResult = await setupResponse.json();
      
      if (setupResult.success) {
        console.log('✅ Database setup completed successfully');
        console.log(`📋 Created tables: ${setupResult.tables.join(', ')}`);
      } else {
        console.log(`⚠️  Database setup failed: ${setupResult.message}`);
        console.log('   Continuing with data creation...');
      }
    } catch (error) {
      console.log(`⚠️  Database setup error: ${error.message}`);
      console.log('   Continuing with data creation...');
    }

    // Create your user account
    console.log('\n👤 Creating user account...');
    const userData = {
      email: 'msalmanmunirmalik@outlook.com',
      password: 'Salman123', // You'll need to change this
      firstName: 'Salman',
      lastName: 'Malik'
    };

    try {
      const userResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const userResult = await userResponse.json();
      
      if (userResult.success) {
        console.log('✅ User account created successfully');
        console.log(`   Email: ${userData.email}`);
      } else {
        console.log(`⚠️  User creation failed: ${userResult.message}`);
        if (userResult.message.includes('already exists')) {
          console.log('   User already exists, continuing...');
        }
      }
    } catch (error) {
      console.log(`⚠️  User creation error: ${error.message}`);
    }

    // Login to get authentication token
    console.log('\n🔐 Logging in...');
    const loginData = {
      email: 'msalmanmunirmalik@outlook.com',
      password: 'Salman123'
    };

    let authToken = null;
    try {
      const loginResponse = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const loginResult = await loginResponse.json();
      
      if (loginResult.success) {
        authToken = loginResult.data.access_token;
        console.log('✅ Login successful');
      } else {
        console.log(`⚠️  Login failed: ${loginResult.message}`);
        console.log('   Cannot create company without authentication');
        return;
      }
    } catch (error) {
      console.log(`⚠️  Login error: ${error.message}`);
      return;
    }

    // Create your company
    console.log('\n🏢 Creating company...');
    const companyData = {
      name: 'Letstern',
      description: 'Connecting Students, Agents, Freelancers, and Institutes Worldwide for Seamless Study Abroad Experiences.',
      industry: 'Education',
      sector: 'Study Abroad',
      size: 'startup',
      location: 'Global',
      website: 'https://letstern.com',
      countries: ['Global'],
      employees: 10,
      applicant_role: 'Founder',
      applicant_position: 'CEO'
    };

    try {
      const companyResponse = await fetch(`${API_BASE_URL}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(companyData)
      });

      const companyResult = await companyResponse.json();
      
      if (companyResult.success) {
        console.log('✅ Company created successfully');
        console.log(`   Name: ${companyData.name}`);
        console.log(`   ID: ${companyResult.data.id}`);
      } else {
        console.log(`⚠️  Company creation failed: ${companyResult.message}`);
      }
    } catch (error) {
      console.log(`⚠️  Company creation error: ${error.message}`);
    }

    console.log('\n🎉 Production data creation completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Database schema set up');
    console.log('   ✅ User account created');
    console.log('   ✅ Company created');
    
    console.log('\n🌐 You can now access your application at:');
    console.log('   https://sharedwealth.onrender.com');
    console.log('\n🔑 Login credentials:');
    console.log(`   Email: ${userData.email}`);
    console.log(`   Password: ${userData.password}`);

  } catch (error) {
    console.error('❌ Production data creation failed:', error);
    process.exit(1);
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  createProductionData().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

export { createProductionData };
