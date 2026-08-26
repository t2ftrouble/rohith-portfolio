import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const pubKey = process.env.SUPABASE_PUBLISHABLE_KEY;

console.log('SUPABASE_URL:', url);
console.log('Service Key:', serviceKey ? 'EXISTS (length: ' + serviceKey.length + ')' : 'MISSING');
console.log('Publishable Key:', pubKey ? 'EXISTS (length: ' + pubKey.length + ')' : 'MISSING');

const adminSupabase = createClient(url, serviceKey);
const pubSupabase = createClient(url, pubKey);

async function main() {
  console.log('\n--- 1. Testing Admin Client (Service Role) - Projects ---');
  const { data: adminProjects, error: adminErr } = await adminSupabase.from('projects').select('*');
  console.log('Admin projects count:', adminProjects?.length);
  if (adminErr) console.error('Admin projects error:', adminErr);
  else console.log('Admin projects titles:', adminProjects?.map(p => ({ id: p.id, slug: p.slug, title: p.title, image: p.image, poster_image: p.poster_image, before_image: p.before_image, after_image: p.after_image, gallery_images: p.gallery_images })));

  console.log('\n--- 2. Testing Public Client - Projects ---');
  const { data: pubProjects, error: pubErr } = await pubSupabase.from('projects').select('*');
  console.log('Public projects count:', pubProjects?.length);
  if (pubErr) console.error('Public projects error:', pubErr);

  console.log('\n--- 3. Testing Admin Sessions Table ---');
  const { data: sessions, error: sessErr } = await adminSupabase.from('admin_sessions').select('*');
  console.log('Sessions count:', sessions?.length);
  if (sessErr) console.error('Sessions error:', sessErr);

  console.log('\n--- 4. Testing Storage Buckets ---');
  const { data: buckets, error: bErr } = await adminSupabase.storage.listBuckets();
  console.log('Storage buckets:', buckets?.map(b => b.name));
  if (bErr) console.error('Storage buckets error:', bErr);

  if (buckets?.some(b => b.name === 'portfolio-media')) {
    const { data: files, error: fErr } = await adminSupabase.storage.from('portfolio-media').list();
    console.log('portfolio-media root files:', files);
  }
}

main().catch(console.error);
