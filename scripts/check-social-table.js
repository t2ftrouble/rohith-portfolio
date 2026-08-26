import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupSocialLinksTable() {
  console.log('--- Setting up social_links table in Supabase ---');

  // Check if social_links table exists by trying to select from it
  const { data, error } = await supabaseAdmin.from('social_links').select('*').limit(1);

  if (error && error.code === '42P01') {
    console.log('Table social_links does not exist. We need to create it.');
  } else if (!error) {
    console.log('Table social_links already exists! Rows:', data);
  } else {
    console.log('Query result:', { data, error });
  }
}

setupSocialLinksTable().catch(console.error);
