import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Let's test if we can execute SQL query via Supabase pg / sql endpoint or if we need to create the table
async function testSql() {
  console.log('Testing SQL endpoint on Supabase...');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: 'SELECT 1;' }),
    });
    console.log('exec_sql status:', res.status);
    const data = await res.text();
    console.log('exec_sql response:', data);
  } catch (e) {
    console.error('SQL test error:', e);
  }
}

testSql().catch(console.error);
