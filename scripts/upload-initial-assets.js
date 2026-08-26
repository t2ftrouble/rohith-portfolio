import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const assetsToUpload = [
  { localFile: 'project-one-last-day.webp', storagePath: 'covers/project-one-last-day.webp', contentType: 'image/webp' },
  { localFile: 'project-toothpaste.webp', storagePath: 'covers/project-toothpaste.webp', contentType: 'image/webp' },
  { localFile: 'project-kadalar.webp', storagePath: 'covers/project-kadalar.webp', contentType: 'image/webp' },
  { localFile: 'project-radhal.webp', storagePath: 'covers/project-radhal.webp', contentType: 'image/webp' },
  { localFile: 'one-last-day-poster.webp', storagePath: 'posters/one-last-day-poster.webp', contentType: 'image/webp' },
  { localFile: 'one-last-day-before-cg.webp', storagePath: 'vfx/one-last-day-before-cg.webp', contentType: 'image/webp' },
  { localFile: 'one-last-day-after-cg.webp', storagePath: 'vfx/one-last-day-after-cg.webp', contentType: 'image/webp' },
];

async function uploadAssets() {
  console.log('--- Uploading assets to Supabase Storage portfolio-media ---');
  const urlMap = {};

  for (const asset of assetsToUpload) {
    const filePath = path.join(process.cwd(), 'src', 'assets', asset.localFile);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const { data, error } = await supabaseAdmin.storage
      .from('portfolio-media')
      .upload(asset.storagePath, fileBuffer, {
        contentType: asset.contentType,
        upsert: true,
      });

    if (error) {
      console.error(`Failed to upload ${asset.localFile}:`, error);
    } else {
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('portfolio-media')
        .getPublicUrl(asset.storagePath);
      console.log(`Uploaded ${asset.localFile} -> ${publicUrl}`);
      urlMap[asset.localFile] = publicUrl;
    }
  }

  console.log('\n--- Updating project rows with Supabase Storage URLs ---');
  
  // 1. One Last Day
  const oneLastDayUpdates = {
    image: urlMap['project-one-last-day.webp'] || 'project-one-last-day.webp',
    poster_image: urlMap['one-last-day-poster.webp'] || 'one-last-day-poster.webp',
    show_before_after: true,
    before_image: urlMap['one-last-day-before-cg.webp'] || 'one-last-day-before-cg.webp',
    after_image: urlMap['one-last-day-after-cg.webp'] || 'one-last-day-after-cg.webp',
    gallery_images: [
      urlMap['project-one-last-day.webp'] || 'project-one-last-day.webp',
      urlMap['one-last-day-poster.webp'] || 'one-last-day-poster.webp'
    ]
  };
  await supabaseAdmin.from('projects').update(oneLastDayUpdates).eq('slug', 'one-last-day');
  console.log('Updated One Last Day in database');

  // 2. Toothpaste
  const toothpasteUpdates = {
    image: urlMap['project-toothpaste.webp'] || 'project-toothpaste.webp',
    poster_image: null,
    show_before_after: false,
    before_image: null,
    after_image: null,
    gallery_images: [
      urlMap['project-toothpaste.webp'] || 'project-toothpaste.webp'
    ]
  };
  await supabaseAdmin.from('projects').update(toothpasteUpdates).eq('slug', 'toothpaste');
  console.log('Updated Toothpaste in database');

  // 3. Kadalar
  const kadalarUpdates = {
    image: urlMap['project-kadalar.webp'] || 'project-kadalar.webp',
    poster_image: null,
    show_before_after: false,
    before_image: null,
    after_image: null,
    gallery_images: [
      urlMap['project-kadalar.webp'] || 'project-kadalar.webp'
    ]
  };
  await supabaseAdmin.from('projects').update(kadalarUpdates).eq('slug', 'kadalar');
  console.log('Updated Kadalar in database');

  // 4. Radhal
  const radhalUpdates = {
    image: urlMap['project-radhal.webp'] || 'project-radhal.webp',
    poster_image: null,
    show_before_after: false,
    before_image: null,
    after_image: null,
    gallery_images: [
      urlMap['project-radhal.webp'] || 'project-radhal.webp'
    ]
  };
  await supabaseAdmin.from('projects').update(radhalUpdates).eq('slug', 'radhal');
  console.log('Updated Radhal in database');

  console.log('\n--- Verification complete! ---');
}

uploadAssets().catch(console.error);
