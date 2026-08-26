import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const defaultSocialLinks = {
  youtube: "https://www.youtube.com/@trouble_rohii",
  instagram: "https://www.instagram.com/trouble_rohii/",
  linkedin: "https://www.linkedin.com/in/rohith-vijayaragavan-8b0996314/",
  updatedAt: new Date().toISOString()
};

async function testStorageConfig() {
  console.log('Testing storing social-links.json in Supabase Storage portfolio-media...');

  const jsonBuffer = Buffer.from(JSON.stringify(defaultSocialLinks, null, 2), 'utf-8');

  const { data, error } = await supabaseAdmin.storage
    .from('portfolio-media')
    .upload('config/social-links.json', jsonBuffer, {
      contentType: 'application/json',
      upsert: true
    });

  if (error) {
    console.error('Upload error:', error);
    return;
  }

  console.log('Upload success:', data);

  // Read back
  const { data: fileData, error: downloadError } = await supabaseAdmin.storage
    .from('portfolio-media')
    .download('config/social-links.json');

  if (downloadError) {
    console.error('Download error:', downloadError);
    return;
  }

  const text = await fileData.text();
  console.log('Downloaded content:', JSON.parse(text));

  // Test public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('portfolio-media')
    .getPublicUrl('config/social-links.json');
  console.log('Public URL:', publicUrl);

  const fetchRes = await fetch(publicUrl);
  console.log('Fetch public URL status:', fetchRes.status);
  const fetchedJson = await fetchRes.json();
  console.log('Public fetch JSON:', fetchedJson);
}

testStorageConfig().catch(console.error);
