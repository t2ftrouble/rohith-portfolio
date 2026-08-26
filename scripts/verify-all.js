import { createClient } from '@supabase/supabase-js';

const baseUrl = 'http://localhost:8081';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verifyAll() {
  console.log('====================================================');
  console.log('     COMPREHENSIVE END-TO-END VERIFICATION');
  console.log('====================================================\n');

  let failedTests = 0;

  function pass(msg) {
    console.log(`✅ [PASS] ${msg}`);
  }
  function fail(msg, err) {
    failedTests++;
    console.error(`❌ [FAIL] ${msg}`, err || '');
  }

  // --- TEST SUITE 1: API & AUTH FLOW ---
  console.log('--- TEST SUITE 1: Admin Authentication & Session ---');
  try {
    // 1.1 Unauthenticated verify
    const unauthRes = await fetch(`${baseUrl}/api/admin/verify`);
    const unauthData = await unauthRes.json();
    if (unauthData.authenticated === false) {
      pass('Unauthenticated verify correctly returns false');
    } else {
      fail('Unauthenticated verify returned true');
    }

    // 1.2 Invalid password login
    const badLoginRes = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrongpassword' }),
    });
    if (badLoginRes.status === 401) {
      pass('Invalid password correctly returns 401 Unauthorized');
    } else {
      fail('Invalid password did not return 401, status=' + badLoginRes.status);
    }

    // 1.3 Valid password login
    const goodLoginRes = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'rohith2024' }),
    });
    const setCookie = goodLoginRes.headers.get('set-cookie');
    const goodLoginData = await goodLoginRes.json();
    if (goodLoginRes.status === 200 && goodLoginData.success && setCookie) {
      pass('Valid password returns 200 and sets admin_session cookie');
    } else {
      fail('Login failed: ' + JSON.stringify(goodLoginData));
    }

    const cookie = setCookie ? setCookie.split(';')[0] : '';

    // 1.4 Verify session with cookie
    const authVerifyRes = await fetch(`${baseUrl}/api/admin/verify`, {
      headers: { 'Cookie': cookie },
    });
    const authVerifyData = await authVerifyRes.json();
    if (authVerifyData.authenticated === true) {
      pass('Session token verify returns true with cookie');
    } else {
      fail('Session token verify returned false with cookie');
    }

    // --- TEST SUITE 2: SUPABASE PERSISTENCE & CRUD ---
    console.log('\n--- TEST SUITE 2: Project Update & Persistence ---');
    const projectsRes = await fetch(`${baseUrl}/api/projects`);
    const { projects } = await projectsRes.json();

    if (Array.isArray(projects) && projects.length === 4) {
      pass(`GET /api/projects returns all 4 projects from Supabase`);
    } else {
      fail(`GET /api/projects expected 4 projects, got ${projects?.length}`);
    }

    const oldDay = projects.find(p => p.slug === 'one-last-day');
    const testTagline = `A story about letting go. [Supabase Verified ${Date.now()}]`;

    const updateRes = await fetch(`${baseUrl}/api/projects/${oldDay.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      body: JSON.stringify({
        project: {
          slug: oldDay.slug,
          number: oldDay.number,
          title: oldDay.title,
          type: oldDay.type,
          role: oldDay.role,
          description: oldDay.description,
          process: oldDay.process,
          visuals: oldDay.visuals,
          image: oldDay.image,
          category: oldDay.category,
          year: oldDay.year,
          status: oldDay.status,
          hasVideo: oldDay.has_video,
          videoId: oldDay.video_id,
          posterImage: oldDay.poster_image,
          showBeforeAfter: oldDay.show_before_after,
          beforeImage: oldDay.before_image,
          afterImage: oldDay.after_image,
          galleryImages: oldDay.gallery_images,
          fullCredits: oldDay.full_credits,
          client: oldDay.client,
          emotionalDescriptor: testTagline,
          whatIFelt: oldDay.what_i_felt,
        },
      }),
    });

    const updateData = await updateRes.json();
    if (updateRes.status === 200 && updateData.project) {
      pass('PUT /api/projects/$id returned 200 OK and updated object');
    } else {
      fail('PUT /api/projects/$id failed: ' + JSON.stringify(updateData));
    }

    // Verify direct in Supabase table
    const { data: dbProject, error: dbErr } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', oldDay.id)
      .single();

    if (!dbErr && dbProject.emotional_descriptor === testTagline) {
      pass('Supabase database row directly confirms persisted update: ' + dbProject.emotional_descriptor);
    } else {
      fail('Supabase database direct read failed to match update: ' + dbErr?.message);
    }

    // --- TEST SUITE 3: IMAGE ASSET ACCESSIBILITY ---
    console.log('\n--- TEST SUITE 3: Supabase Storage & Media Asset Loading ---');
    const mediaUrls = [
      dbProject.image,
      dbProject.poster_image,
      dbProject.before_image,
      dbProject.after_image,
      ...(dbProject.gallery_images || []),
    ].filter(Boolean);

    for (const url of mediaUrls) {
      const imgRes = await fetch(url);
      if (imgRes.status === 200) {
        pass(`Storage asset accessible (200 OK): ${url.split('/').slice(-2).join('/')}`);
      } else {
        fail(`Storage asset failed (${imgRes.status}): ${url}`);
      }
    }

    // --- TEST SUITE 4: PUBLIC SSR ROUTES ---
    console.log('\n--- TEST SUITE 4: Public Route Accessibility ---');
    const routesToTest = [
      '/',
      '/portfolio',
      '/portfolio/one-last-day',
      '/portfolio/toothpaste',
      '/portfolio/kadalar',
      '/portfolio/radhal',
      '/about',
      '/contact',
      '/digital-marketing',
      '/admin',
    ];

    for (const r of routesToTest) {
      const pageRes = await fetch(`${baseUrl}${r}`);
      if (pageRes.status === 200) {
        pass(`Route ${r} returned 200 OK`);
      } else {
        fail(`Route ${r} returned ${pageRes.status}`);
      }
    }

    // --- TEST SUITE 5: LOGOUT ---
    console.log('\n--- TEST SUITE 5: Logout & Invalidation ---');
    const logoutRes = await fetch(`${baseUrl}/api/admin/logout`, {
      method: 'POST',
      headers: { 'Cookie': cookie },
    });
    if (logoutRes.status === 200) {
      pass('POST /api/admin/logout succeeded');
    }

    const postLogoutVerify = await fetch(`${baseUrl}/api/admin/verify`, {
      headers: { 'Cookie': cookie },
    });
    const postLogoutData = await postLogoutVerify.json();
    if (postLogoutData.authenticated === false) {
      pass('After logout, session token is successfully invalidated in database');
    } else {
      fail('Session token was still valid after logout');
    }

  } catch (err) {
    fail('Unexpected exception during verification:', err);
  }

  console.log('\n====================================================');
  if (failedTests === 0) {
    console.log('🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY! (0 Failures)');
  } else {
    console.error(`⚠️ VERIFICATION FAILED WITH ${failedTests} ERRORS`);
  }
  console.log('====================================================');
}

verifyAll().catch(console.error);
