import { createClient } from '@supabase/supabase-js';

const baseUrl = 'http://localhost:8081';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const originalSocialLinks = {
  youtube: "https://www.youtube.com/@trouble_rohii",
  instagram: "https://www.instagram.com/trouble_rohii/",
  linkedin: "https://www.linkedin.com/in/rohith-vijayaragavan-8b0996314/"
};

async function verifySocialLinks() {
  console.log('====================================================');
  console.log('     SOCIAL LINKS CMS END-TO-END VERIFICATION');
  console.log('====================================================\n');

  let failedTests = 0;
  function pass(msg) {
    console.log(`✅ [PASS] ${msg}`);
  }
  function fail(msg, err) {
    failedTests++;
    console.error(`❌ [FAIL] ${msg}`, err || '');
  }

  try {
    // --- TEST 1: Public Read of Social Links ---
    console.log('--- TEST 1: Public Read Access (GET /api/social-links) ---');
    const getRes = await fetch(`${baseUrl}/api/social-links`);
    const getData = await getRes.json();
    console.log('Initial social links:', getData);
    if (getRes.status === 200 && getData.youtube && getData.instagram && getData.linkedin) {
      pass('GET /api/social-links returns all 3 channels successfully');
    } else {
      fail('GET /api/social-links failed: ' + JSON.stringify(getData));
    }

    // --- TEST 2: Unauthorized PUT blocked ---
    console.log('\n--- TEST 2: Unauthorized PUT Blocked ---');
    const unauthPut = await fetch(`${baseUrl}/api/social-links`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ socialLinks: { youtube: 'https://youtube.com/test' } })
    });
    if (unauthPut.status === 401) {
      pass('Unauthenticated PUT /api/social-links returns 401 Unauthorized');
    } else {
      fail('Unauthenticated PUT was not blocked, status=' + unauthPut.status);
    }

    // --- TEST 3: Admin Login & Session Cookie ---
    console.log('\n--- TEST 3: Admin Login & Authentication ---');
    const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'rohith2024' }),
    });
    const setCookie = loginRes.headers.get('set-cookie');
    const cookie = setCookie ? setCookie.split(';')[0] : '';
    if (loginRes.status === 200 && cookie) {
      pass('Admin login successful, session cookie acquired');
    } else {
      fail('Admin login failed');
    }

    // --- TEST 4: URL Validation on Invalid Inputs ---
    console.log('\n--- TEST 4: Validation for Invalid URLs ---');
    const invalidPut = await fetch(`${baseUrl}/api/social-links`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      body: JSON.stringify({
        socialLinks: {
          youtube: 'not-a-valid-url-format',
          instagram: 'https://instagram.com/test',
          linkedin: 'https://linkedin.com/test',
        }
      })
    });
    if (invalidPut.status === 400) {
      pass('Invalid URL format correctly rejected with 400 Bad Request');
    } else {
      fail('Invalid URL was not rejected with 400, status=' + invalidPut.status);
    }

    // --- TEST 5: Update Social Links (Browser A / Admin) ---
    console.log('\n--- TEST 5: Update Social Links in Supabase (Browser A) ---');
    const tempSocialLinks = {
      youtube: "https://www.youtube.com/@trouble_rohii_updated",
      instagram: "https://www.instagram.com/trouble_rohii_updated/",
      linkedin: "https://www.linkedin.com/in/rohith-updated/"
    };

    const updateRes = await fetch(`${baseUrl}/api/social-links`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      body: JSON.stringify({ socialLinks: tempSocialLinks })
    });
    const updateData = await updateRes.json();
    if (updateRes.status === 200 && updateData.success) {
      pass('PUT /api/social-links returned 200 OK and updated object');
    } else {
      fail('PUT /api/social-links failed: ' + JSON.stringify(updateData));
    }

    // --- TEST 6: Verify Persistence from Database / Incognito Browser B ---
    console.log('\n--- TEST 6: Persistence & Incognito Verification (Browser B) ---');
    const checkRes = await fetch(`${baseUrl}/api/social-links`); // Unauthenticated
    const checkData = await checkRes.json();
    console.log('Unauthenticated Browser B fetched:', checkData);
    if (
      checkData.youtube === tempSocialLinks.youtube &&
      checkData.instagram === tempSocialLinks.instagram &&
      checkData.linkedin === tempSocialLinks.linkedin
    ) {
      pass('Browser B confirms updated links are immediately active and persisted in Supabase!');
    } else {
      fail('Browser B data does not match updated payload');
    }

    // --- TEST 7: Revert Back to Original URLs ---
    console.log('\n--- TEST 7: Revert Social Links to Original Values ---');
    const revertRes = await fetch(`${baseUrl}/api/social-links`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
      body: JSON.stringify({ socialLinks: originalSocialLinks })
    });
    const revertData = await revertRes.json();
    if (revertRes.status === 200 && revertData.success) {
      pass('Reverted social links to original values successfully');
    } else {
      fail('Revert failed: ' + JSON.stringify(revertData));
    }

    // --- TEST 8: Public Routes Accessibility ---
    console.log('\n--- TEST 8: Public Routes Rendering Check ---');
    const routes = ['/', '/portfolio', '/contact', '/admin'];
    for (const r of routes) {
      const res = await fetch(`${baseUrl}${r}`);
      if (res.status === 200) {
        pass(`Route ${r} rendered 200 OK`);
      } else {
        fail(`Route ${r} failed: ${res.status}`);
      }
    }

  } catch (err) {
    fail('Unexpected error:', err);
  }

  console.log('\n====================================================');
  if (failedTests === 0) {
    console.log('🎉 ALL SOCIAL LINKS TESTS PASSED! (0 Failures)');
  } else {
    console.error(`⚠️ FAILED WITH ${failedTests} ERRORS`);
  }
  console.log('====================================================');
}

verifySocialLinks().catch(console.error);
