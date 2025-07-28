// Simple script to fix the activity_feed table
// This script will be run in the browser console

console.log('🔧 Running database fix for activity_feed table...');

// First, let's check if the activity_feed table exists and has the right structure
async function checkAndFixDatabase() {
  try {
    // Import the existing Supabase client
    const { supabase } = await import('./src/integrations/supabase/client.js');
    
    console.log('📊 Checking current database structure...');
    
    // Try to query the activity_feed table
    const { data: existingData, error: queryError } = await supabase
      .from('activity_feed')
      .select('*')
      .limit(1);
    
    if (queryError) {
      console.log('❌ Activity feed table has issues:', queryError.message);
      console.log('📋 Manual fix required:');
      console.log('1. Go to your Supabase Dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the SQL from fix_activity_feed.sql');
      console.log('4. Run the script');
      return;
    }
    
    console.log('✅ Activity feed table exists and is accessible');
    
    // Test the relationship by trying to join with companies
    const { data: testData, error: joinError } = await supabase
      .from('activity_feed')
      .select(`
        *,
        company:companies(name, logo_url)
      `)
      .limit(1);
    
    if (joinError) {
      console.log('❌ Foreign key relationship issue:', joinError.message);
      console.log('📋 Manual fix required:');
      console.log('1. Go to your Supabase Dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the SQL from fix_activity_feed.sql');
      console.log('4. Run the script');
      return;
    }
    
    console.log('✅ Foreign key relationships are working correctly');
    console.log('🎉 Database is properly configured!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
    console.log('📋 Manual fix required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL from fix_activity_feed.sql');
    console.log('4. Run the script');
  }
}

// Run the check
checkAndFixDatabase(); 