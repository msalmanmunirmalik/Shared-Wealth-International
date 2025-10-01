import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.VITE_API_URL || 'https://sharedwealth.net/api';

async function testCompleteSignupFlow() {
  console.log('\n🚀 Testing Complete Signup Flow');
  console.log('='.repeat(60));
  
  try {
    // Test 1: File Upload
    console.log('\n1️⃣ Testing file upload endpoint...');
    const formData = new FormData();
    const blob = new Blob(['test file content'], { type: 'image/jpeg' });
    formData.append('file', blob, 'test-profile.jpg');
    formData.append('uploadType', 'images');
    
    const uploadResponse = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
      body: formData
    });
    
    const uploadData = await uploadResponse.json();
    console.log('✅ File upload response:', uploadData);
    
    if (!uploadData.success) {
      throw new Error('File upload failed: ' + JSON.stringify(uploadData));
    }
    
    // Test 2: Get Companies (should return empty array)
    console.log('\n2️⃣ Testing companies endpoint...');
    const companiesResponse = await fetch(`${API_URL}/companies`);
    const companiesData = await companiesResponse.json();
    console.log('✅ Companies response:', companiesData);
    
    if (!companiesData.success) {
      throw new Error('Companies endpoint failed: ' + JSON.stringify(companiesData));
    }
    
    // Test 3: Signup with full profile
    console.log('\n3️⃣ Testing signup with complete profile...');
    const uniqueEmail = `test-${Date.now()}@example.com`;
    
    const signupResponse = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        role: 'user',
        position: 'CEO',
        companyName: 'Test Company ' + Date.now(),
        bio: 'Test bio',
        location: 'Test Location',
        website: 'https://example.com',
        linkedin: 'https://linkedin.com/in/testuser',
        twitter: 'https://twitter.com/testuser',
        profileImage: uploadData.data.publicUrl
      })
    });
    
    const signupData = await signupResponse.json();
    console.log('✅ Signup response:', signupData);
    
    if (!signupData.success && !signupData.data?.token) {
      console.error('❌ Signup failed:', signupData);
      throw new Error('Signup failed: ' + JSON.stringify(signupData));
    }
    
    // Test 4: Test authenticated endpoints
    if (signupData.data?.token) {
      console.log('\n4️⃣ Testing authenticated endpoints...');
      
      const userCompaniesResponse = await fetch(`${API_URL}/companies/user`, {
        headers: {
          'Authorization': `Bearer ${signupData.data.token}`
        }
      });
      
      const userCompaniesData = await userCompaniesResponse.json();
      console.log('✅ User companies response:', userCompaniesData);
      
      const activitiesResponse = await fetch(`${API_URL}/dashboard/activities?limit=5`, {
        headers: {
          'Authorization': `Bearer ${signupData.data.token}`
        }
      });
      
      const activitiesData = await activitiesResponse.json();
      console.log('✅ Dashboard activities response:', activitiesData);
    }
    
    console.log('\n✅ All tests passed!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testCompleteSignupFlow();

