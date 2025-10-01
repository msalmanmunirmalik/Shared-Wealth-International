import { AuthService } from './server/services/authService.js';

async function testSignupService() {
  try {
    console.log('🔄 Testing signup service...');
    
    const userData = {
      email: 'test.service@example.com',
      password: 'TestService123',
      firstName: 'Test',
      lastName: 'Service',
      role: 'user',
      companyName: 'Test Service Company',
      position: 'CEO'
    };
    
    console.log('📝 Calling AuthService.signUp...');
    const result = await AuthService.signUp(userData);
    
    console.log('📊 Result:', result);
    
    if (result.success) {
      console.log('✅ Signup successful!');
      console.log('  - User ID:', result.data?.userId);
      console.log('  - Token:', result.data?.token ? 'Present' : 'Missing');
    } else {
      console.log('❌ Signup failed:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing signup service:', error);
  }
}

testSignupService();
