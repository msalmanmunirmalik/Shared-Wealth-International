import { AuthService } from './server/services/authService.js';
import { CompanyService } from './server/services/companyService.js';
import { NetworkService } from './server/services/networkService.js';

async function testApiEndpoints() {
  try {
    console.log('🔍 Testing API endpoints...');
    
    // Test 1: Basic signup
    console.log('\n📝 Test 1: Basic Signup');
    console.log('=' .repeat(40));
    
    try {
      const signupResult = await AuthService.signUp({
        email: 'api.test.fixed@example.com',
        password: 'ApiTest123',
        firstName: 'API',
        lastName: 'Test',
        role: 'user'
      });
      
      if (signupResult.success) {
        console.log('✅ Basic signup works');
        console.log('  - User ID:', signupResult.data?.userId);
        
        // Test 2: Get user companies
        console.log('\n📝 Test 2: Get User Companies');
        console.log('=' .repeat(40));
        
        try {
          const userCompanies = await CompanyService.getUserCompanies(signupResult.data!.userId);
          console.log('✅ Get user companies works');
          console.log('  - Companies found:', userCompanies.data?.length || 0);
        } catch (error) {
          console.log('❌ Get user companies failed:', error.message);
        }
        
        // Test 3: Get user network
        console.log('\n📝 Test 3: Get User Network');
        console.log('=' .repeat(40));
        
        try {
          const userNetwork = await NetworkService.getUserNetwork(signupResult.data!.userId);
          console.log('✅ Get user network works');
          console.log('  - Network companies found:', userNetwork.data?.length || 0);
        } catch (error) {
          console.log('❌ Get user network failed:', error.message);
        }
        
        // Test 4: Get user applications
        console.log('\n📝 Test 4: Get User Applications');
        console.log('=' .repeat(40));
        
        try {
          const userApplications = await CompanyService.getUserApplications(signupResult.data!.userId);
          console.log('✅ Get user applications works');
          console.log('  - Applications found:', userApplications.data?.length || 0);
        } catch (error) {
          console.log('❌ Get user applications failed:', error.message);
        }
        
      } else {
        console.log('❌ Basic signup failed:', signupResult.message);
      }
    } catch (error) {
      console.log('❌ Signup test failed:', error.message);
    }
    
    // Test 5: Signup with company
    console.log('\n📝 Test 5: Signup with Company');
    console.log('=' .repeat(40));
    
    try {
      const signupWithCompany = await AuthService.signUp({
        email: 'api.company.test.fixed@example.com',
        password: 'ApiCompanyTest123',
        firstName: 'API',
        lastName: 'Company',
        role: 'user',
        companyName: 'API Test Company',
        position: 'CEO'
      });
      
      if (signupWithCompany.success) {
        console.log('✅ Signup with company works');
        console.log('  - User ID:', signupWithCompany.data?.userId);
      } else {
        console.log('❌ Signup with company failed:', signupWithCompany.message);
      }
    } catch (error) {
      console.log('❌ Signup with company test failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing API endpoints:', error);
  }
}

testApiEndpoints();
