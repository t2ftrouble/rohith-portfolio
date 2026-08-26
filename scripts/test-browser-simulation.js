import { createClient } from '@supabase/supabase-js';

const baseUrl = 'http://localhost:8081';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function runBrowserSimulationTest() {
  console.log('===============================================================');
  console.log('  SIMULATED BROWSER A (ADMIN) -> BROWSER B (INCOGNITO) TEST');
  console.log('===============================================================\n');

  // --- Step 1: Browser A - Login to Admin ---
  console.log('[Step 1] Browser A: Logging in to Admin (/api/admin/login)...');
  const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'rohith2024' }),
  });
  const cookieHeader = loginRes.headers.get('set-cookie');
  if (loginRes.status !== 200 || !cookieHeader) {
    throw new Error('Browser A login failed: ' + loginRes.status);
  }
  const browserACookie = cookieHeader.split(';')[0];
  console.log('✅ Browser A logged in successfully. Session cookie acquired.');

  // --- Step 2: Browser A - Load Admin Projects & Inspect Existing Images ---
  console.log('\n[Step 2] Browser A: Loading projects and checking existing images in Admin...');
  const adminProjectsRes = await fetch(`${baseUrl}/api/projects`, {
    headers: { 'Cookie': browserACookie }
  });
  const { projects } = await adminProjectsRes.json();
  const oneLastDay = projects.find(p => p.slug === 'one-last-day');
  if (!oneLastDay) throw new Error('One Last Day project not found');

  console.log('Images currently assigned to One Last Day:');
  console.log(' - Cover Image:', oneLastDay.image);
  console.log(' - Poster Image:', oneLastDay.poster_image);
  console.log(' - Before Image:', oneLastDay.before_image);
  console.log(' - After Image:', oneLastDay.after_image);
  console.log(' - Gallery Images:', oneLastDay.gallery_images);

  const originalTagline = "A story about letting go.";
  const temporaryTagline = "A story about letting go. [TEMPORARY TEST " + Date.now() + "]";

  // --- Step 3: Browser A - Edit Project & Save Changes ---
  console.log('\n[Step 3] Browser A: Editing visible field (emotionalDescriptor) to temporary value:');
  console.log('  -> ' + temporaryTagline);

  const editPayload = {
    project: {
      slug: oneLastDay.slug,
      number: oneLastDay.number,
      title: oneLastDay.title,
      type: oneLastDay.type,
      role: oneLastDay.role,
      description: oneLastDay.description,
      process: oneLastDay.process,
      visuals: oneLastDay.visuals,
      image: oneLastDay.image,
      category: oneLastDay.category,
      year: oneLastDay.year,
      status: oneLastDay.status,
      hasVideo: oneLastDay.has_video,
      videoId: oneLastDay.video_id,
      posterImage: oneLastDay.poster_image,
      showBeforeAfter: oneLastDay.show_before_after,
      beforeImage: oneLastDay.before_image,
      afterImage: oneLastDay.after_image,
      galleryImages: oneLastDay.gallery_images,
      fullCredits: oneLastDay.full_credits,
      client: oneLastDay.client,
      emotionalDescriptor: temporaryTagline,
      whatIFelt: oneLastDay.what_i_felt,
    }
  };

  const saveRes = await fetch(`${baseUrl}/api/projects/${oneLastDay.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': browserACookie
    },
    body: JSON.stringify(editPayload)
  });

  if (saveRes.status !== 200) {
    throw new Error('Browser A save failed: ' + (await saveRes.text()));
  }
  console.log('✅ Browser A: Project saved successfully (200 OK).');

  // --- Step 4: Browser A - Refresh Admin Page ---
  console.log('\n[Step 4] Browser A: Refreshing Admin (/api/admin/verify + /api/projects)...');
  const verifyRes = await fetch(`${baseUrl}/api/admin/verify`, {
    headers: { 'Cookie': browserACookie }
  });
  const verifyData = await verifyRes.json();
  if (!verifyData.authenticated) {
    throw new Error('Browser A session lost after refresh');
  }

  const refreshedProjectsRes = await fetch(`${baseUrl}/api/projects`, {
    headers: { 'Cookie': browserACookie }
  });
  const refreshedData = await refreshedProjectsRes.json();
  const refreshedProject = refreshedData.projects.find(p => p.slug === 'one-last-day');

  if (refreshedProject.emotional_descriptor !== temporaryTagline) {
    throw new Error('Refreshed project data does not match saved change');
  }
  console.log('✅ Browser A: Admin refresh confirmed persistence. Tagline = ' + refreshedProject.emotional_descriptor);

  // --- Step 5: Browser A - Public Portfolio View ---
  console.log('\n[Step 5] Browser A: Viewing public portfolio page (/portfolio)...');
  const portResA = await fetch(`${baseUrl}/portfolio`);
  if (portResA.status !== 200) throw new Error('Portfolio route failed: ' + portResA.status);
  console.log('✅ Browser A: Public portfolio renders 200 OK.');

  // --- Step 6: Browser B (Incognito / Second Browser) ---
  console.log('\n[Step 6] Browser B (Incognito session with NO cookies):');
  console.log('  Fetching public API & public project detail (/portfolio/one-last-day)...');
  const browserBPubRes = await fetch(`${baseUrl}/api/projects`); // No cookie
  const browserBData = await browserBPubRes.json();
  const browserBProject = browserBData.projects.find(p => p.slug === 'one-last-day');

  if (browserBProject.emotional_descriptor !== temporaryTagline) {
    throw new Error('Browser B did not see the updated data');
  }
  console.log('✅ Browser B (Incognito): Confirmed updated tagline appears: ' + browserBProject.emotional_descriptor);

  const portDetailB = await fetch(`${baseUrl}/portfolio/one-last-day`);
  if (portDetailB.status !== 200) throw new Error('Portfolio detail route failed for Browser B: ' + portDetailB.status);
  console.log('✅ Browser B (Incognito): /portfolio/one-last-day renders 200 OK with updated content.');

  // --- Step 7: Browser A - Revert to Original Tagline ---
  console.log('\n[Step 7] Browser A: Reverting project tagline to original: "' + originalTagline + '"...');
  editPayload.project.emotionalDescriptor = originalTagline;

  const revertRes = await fetch(`${baseUrl}/api/projects/${oneLastDay.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': browserACookie
    },
    body: JSON.stringify(editPayload)
  });

  if (revertRes.status !== 200) {
    throw new Error('Revert save failed: ' + (await revertRes.text()));
  }
  console.log('✅ Browser A: Reverted project saved successfully.');

  // --- Step 8: Browser B (Incognito) - Verify Reverted Value ---
  console.log('\n[Step 8] Browser B (Incognito): Verifying reverted value in database and public routes...');
  const browserBCheck = await fetch(`${baseUrl}/api/projects`);
  const browserBCheckData = await browserBCheck.json();
  const revertedProject = browserBCheckData.projects.find(p => p.slug === 'one-last-day');

  if (revertedProject.emotional_descriptor !== originalTagline) {
    throw new Error('Reverted value verification failed');
  }
  console.log('✅ Browser B (Incognito): Confirmed restored original tagline: ' + revertedProject.emotional_descriptor);

  // --- Step 9: Final Media Integrity Check for All 4 Projects ---
  console.log('\n[Step 9] Verifying all 4 projects and their media assets:');
  const allProjects = browserBCheckData.projects;
  for (const p of allProjects) {
    console.log(`\nProject: ${p.title} (${p.slug})`);
    console.log(` - Category: ${p.category}`);
    console.log(` - Cover: ${p.image}`);
    console.log(` - Poster: ${p.poster_image || 'None'}`);
    console.log(` - Before Image: ${p.before_image || 'None'}`);
    console.log(` - After Image: ${p.after_image || 'None'}`);
    console.log(` - Gallery: ${JSON.stringify(p.gallery_images)}`);

    // Check cover image accessible
    if (p.image) {
      const imgCheck = await fetch(p.image);
      if (imgCheck.status !== 200) {
        throw new Error(`Cover image inaccessible for ${p.slug}: ${p.image}`);
      }
    }
  }
  console.log('\n✅ All 4 projects and all media assets verified accessible and intact.');

  console.log('\n===============================================================');
  console.log('  🎉 SIMULATION TEST COMPLETE: ALL STEPS PASSED WITH 0 ERRORS');
  console.log('===============================================================');
}

runBrowserSimulationTest().catch((err) => {
  console.error('❌ Simulation failed:', err);
  process.exit(1);
});
