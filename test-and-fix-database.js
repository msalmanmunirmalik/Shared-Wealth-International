import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function testAndFixDatabase() {
  console.log('🔧 Testing and fixing database schema...');
  
  try {
    // Test if we can create a simple company record directly
    const testCompany = {
      name: 'Test Company',
      description: 'This is a test company to verify database schema is working properly.',
      industry: 'Technology',
      size: 'small',
      location: 'Test Country',
      website: 'https://testcompany.com'
    };

    // Try to create a company using a working user account
    const loginResponse = await fetch('https://sharedwealth.net/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'luis@ktalise.com',
        password: 'Sharedwealth123'
      })
    });

    const loginResult = await loginResponse.json();
    
    if (!loginResult.session?.access_token) {
      console.log('❌ Failed to login for testing');
      return;
    }

    const token = loginResult.session.access_token;
    console.log('✅ Logged in successfully for testing');

    // Try to create the test company
    const companyResponse = await fetch('https://sharedwealth.net/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testCompany)
    });

    const companyResult = await companyResponse.json();
    
    if (companyResult.success) {
      console.log('✅ Database schema is working! Test company created successfully');
      console.log(`   Company ID: ${companyResult.data.id}`);
      
      // Clean up - delete the test company
      const deleteResponse = await fetch(`https://sharedwealth.net/api/companies/${companyResult.data.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (deleteResponse.ok) {
        console.log('✅ Test company cleaned up successfully');
      }
      
    } else {
      console.log('❌ Database schema issue detected');
      console.log(`   Error: ${companyResult.message}`);
      
      // Try to get more detailed error information
      if (companyResult.errors) {
        console.log('   Validation errors:', companyResult.errors);
      }
    }

  } catch (error) {
    console.log(`❌ Database test failed: ${error.message}`);
  }
}

testAndFixDatabase().catch(console.error);
