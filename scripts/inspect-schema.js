import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function inspectSchema() {
  console.log('Testing what tables exist in Supabase...');

  // Test admin_sessions
  const { data: sData, error: sErr } = await supabaseAdmin.from('admin_sessions').select('*').limit(1);
  console.log('admin_sessions table:', sErr ? sErr.message : 'EXISTS');

  // Test projects
  const { data: pData, error: pErr } = await supabaseAdmin.from('projects').select('*').limit(1);
  console.log('projects table:', pErr ? pErr.message : 'EXISTS');

  // Let's check if we can run SQL via postgres rpc or postgres rest
  // Or check if there is an rpc function
  const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc('get_schema_version').catch(() => ({}));
  console.log('RPC test:', rpcErr ? rpcErr.message : 'OK');
}

inspectSchema().catch(console.error);
