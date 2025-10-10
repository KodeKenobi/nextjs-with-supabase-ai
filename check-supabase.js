const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Checking Supabase connection...');
console.log('URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Key:', supabaseKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  try {
    console.log('🔍 Testing basic connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('companies').select('count').limit(1);
    
    if (error) {
      console.log('❌ Database error:', error.message);
      console.log('Error code:', error.code);
      console.log('Error details:', error.details);
      console.log('Error hint:', error.hint);
    } else {
      console.log('✅ Database connection successful');
      console.log('Companies count:', data?.length || 0);
    }
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
  }
}

checkConnection();
