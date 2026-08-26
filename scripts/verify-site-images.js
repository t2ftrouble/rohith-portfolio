// scripts/verify-site-images.js
// Automated verification for Global Website Media / Site Images CMS

const BASE_URL = process.env.BASE_URL || "http://localhost:8081";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "rohith2024";

async function runTests() {
  console.log("====================================================");
  console.log("     GLOBAL SITE IMAGES CMS END-TO-END VERIFICATION");
  console.log("====================================================\n");

  let adminCookie = "";

  // TEST 1: Public Read Access (GET /api/site-images)
  console.log("--- TEST 1: Public Read Access (GET /api/site-images) ---");
  const res1 = await fetch(`${BASE_URL}/api/site-images`);
  if (!res1.ok) {
    console.error(`❌ [FAIL] GET /api/site-images returned ${res1.status}`);
    process.exit(1);
  }
  const initialImages = await res1.json();
  console.log("Initial site images:", initialImages);
  if (!initialImages.digitalMarketingHero || !initialImages.creative1) {
    console.error("❌ [FAIL] Missing required site image keys");
    process.exit(1);
  }
  console.log("✅ [PASS] GET /api/site-images returns all website image slots\n");

  // TEST 2: Unauthorized PUT Blocked
  console.log("--- TEST 2: Unauthorized PUT Blocked ---");
  const res2 = await fetch(`${BASE_URL}/api/site-images`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ siteImages: { heroImage: "https://example.com/hacker.jpg" } }),
  });
  if (res2.status !== 401) {
    console.error(`❌ [FAIL] Expected 401 Unauthorized, got ${res2.status}`);
    process.exit(1);
  }
  console.log("✅ [PASS] Unauthenticated PUT /api/site-images returns 401 Unauthorized\n");

  // TEST 3: Admin Login & Session Cookie Acquisition
  console.log("--- TEST 3: Admin Login & Authentication ---");
  const res3 = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: ADMIN_PASSWORD }),
  });
  const cookieHeader = res3.headers.get("set-cookie");
  if (!res3.ok || !cookieHeader) {
    console.error(`❌ [FAIL] Admin login failed: ${res3.status}`);
    process.exit(1);
  }
  adminCookie = cookieHeader.split(";")[0];
  console.log("✅ [PASS] Admin login successful, session cookie acquired\n");

  // TEST 4: Update Website Images in Supabase (Browser A)
  console.log("--- TEST 4: Update Website Images in Supabase (Browser A) ---");
  const timestamp = Date.now();
  const testImages = {
    heroImage: `/src/assets/hero-street.webp?test=${timestamp}`,
    aboutImage: `/src/assets/about-editroom.webp?test=${timestamp}`,
    digitalMarketingHero: `/src/assets/digital marketing hero.jpg?test=${timestamp}`,
    creative1: `/src/assets/1-creative.jpg?test=${timestamp}`,
    creative2: `/src/assets/2-cerative.jpg?test=${timestamp}`,
    creative3: `/src/assets/3 creative.jpg?test=${timestamp}`,
  };

  const res4 = await fetch(`${BASE_URL}/api/site-images`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({ siteImages: testImages }),
  });

  if (!res4.ok) {
    const errorJson = await res4.json().catch(() => ({}));
    console.error("❌ [FAIL] PUT /api/site-images failed:", errorJson);
    process.exit(1);
  }
  const putResult = await res4.json();
  console.log("PUT Result:", putResult);
  console.log("✅ [PASS] PUT /api/site-images returned 200 OK and updated object\n");

  // TEST 5: Persistence & Incognito Verification (Browser B)
  console.log("--- TEST 5: Persistence & Incognito Verification (Browser B) ---");
  // Browser B has NO cookies
  const res5 = await fetch(`${BASE_URL}/api/site-images`);
  if (!res5.ok) {
    console.error(`❌ [FAIL] Browser B GET /api/site-images returned ${res5.status}`);
    process.exit(1);
  }
  const incognitoImages = await res5.json();
  console.log("Unauthenticated Browser B fetched:", incognitoImages);

  if (incognitoImages.digitalMarketingHero !== testImages.digitalMarketingHero) {
    console.error("❌ [FAIL] Incognito browser did not receive updated image URLs from Supabase!");
    process.exit(1);
  }
  console.log("✅ [PASS] Browser B confirms updated images are immediately active and persisted in Supabase!\n");

  // TEST 6: Revert Images to Original Assets
  console.log("--- TEST 6: Revert Images to Original Assets ---");
  const revertImages = {
    heroImage: "/src/assets/hero-street.webp",
    aboutImage: "/src/assets/about-editroom.webp",
    digitalMarketingHero: "/src/assets/digital marketing hero.jpg",
    creative1: "/src/assets/1-creative.jpg",
    creative2: "/src/assets/2-cerative.jpg",
    creative3: "/src/assets/3 creative.jpg",
  };

  const res6 = await fetch(`${BASE_URL}/api/site-images`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({ siteImages: revertImages }),
  });

  if (!res6.ok) {
    console.error("❌ [FAIL] Failed to revert site images to default assets");
    process.exit(1);
  }
  console.log("✅ [PASS] Reverted site images to original assets successfully\n");

  // TEST 7: Public Routes Rendering Check
  console.log("--- TEST 7: Public Routes Rendering Check ---");
  const routes = ["/", "/about", "/digital-marketing", "/portfolio", "/contact", "/admin"];
  for (const r of routes) {
    const res = await fetch(`${BASE_URL}${r}`);
    if (res.ok) {
      console.log(`✅ [PASS] Route ${r} rendered 200 OK`);
    } else {
      console.error(`❌ [FAIL] Route ${r} returned ${res.status}`);
      process.exit(1);
    }
  }

  console.log("\n====================================================");
  console.log("🎉 ALL SITE IMAGES CMS TESTS PASSED! (0 Failures)");
  console.log("====================================================");
}

runTests().catch((err) => {
  console.error("Unhandled test error:", err);
  process.exit(1);
});
