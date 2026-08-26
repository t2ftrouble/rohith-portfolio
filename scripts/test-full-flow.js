async function testFullFlow() {
  const baseUrl = 'http://localhost:8081';
  console.log('=== STEP 1: Test GET /api/admin/verify before login ===');
  const verifyRes1 = await fetch(`${baseUrl}/api/admin/verify`);
  const verifyData1 = await verifyRes1.json();
  console.log('Before login verify status:', verifyData1);

  console.log('\n=== STEP 2: Test POST /api/admin/login ===');
  const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'rohith2024' }),
  });
  const setCookie = loginRes.headers.get('set-cookie');
  console.log('Login status:', loginRes.status);
  console.log('Set-Cookie:', setCookie);
  const cookieToSend = setCookie ? setCookie.split(';')[0] : '';

  console.log('\n=== STEP 3: Test GET /api/admin/verify with cookie ===');
  const verifyRes2 = await fetch(`${baseUrl}/api/admin/verify`, {
    headers: { 'Cookie': cookieToSend }
  });
  const verifyData2 = await verifyRes2.json();
  console.log('After login verify result:', verifyData2);

  console.log('\n=== STEP 4: Fetch projects list ===');
  const getRes = await fetch(`${baseUrl}/api/projects`);
  const { projects } = await getRes.json();
  console.log(`Fetched ${projects.length} projects:`, projects.map(p => ({ slug: p.slug, title: p.title, image: p.image?.slice(0, 50) })));

  const targetProject = projects.find(p => p.slug === 'one-last-day');
  if (!targetProject) throw new Error('One Last Day project not found');

  console.log('\n=== STEP 5: Test PUT /api/projects/' + targetProject.id + ' (Updating One Last Day) ===');
  const timestamp = new Date().toISOString();
  const updatePayload = {
    project: {
      slug: targetProject.slug,
      number: targetProject.number,
      title: targetProject.title,
      type: targetProject.type,
      role: targetProject.role,
      description: targetProject.description,
      process: targetProject.process,
      visuals: targetProject.visuals,
      image: targetProject.image,
      category: targetProject.category,
      year: targetProject.year,
      status: targetProject.status,
      hasVideo: targetProject.has_video,
      videoId: targetProject.video_id,
      posterImage: targetProject.poster_image,
      showBeforeAfter: targetProject.show_before_after,
      beforeImage: targetProject.before_image,
      afterImage: targetProject.after_image,
      galleryImages: targetProject.gallery_images,
      fullCredits: targetProject.full_credits,
      client: targetProject.client,
      emotionalDescriptor: "A story about letting go. [Verified " + timestamp.slice(11, 19) + "]",
      whatIFelt: targetProject.what_i_felt
    }
  };

  const putRes = await fetch(`${baseUrl}/api/projects/${targetProject.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieToSend
    },
    body: JSON.stringify(updatePayload)
  });

  console.log('PUT response status:', putRes.status);
  const putData = await putRes.json();
  console.log('PUT response data:', putData);

  console.log('\n=== STEP 6: Verify Persistence from Database ===');
  const checkRes = await fetch(`${baseUrl}/api/projects`);
  const checkData = await checkRes.json();
  const updated = checkData.projects.find(p => p.slug === 'one-last-day');
  console.log('Updated in Supabase:', {
    title: updated.title,
    emotional_descriptor: updated.emotional_descriptor,
    image: updated.image,
    poster_image: updated.poster_image,
    before_image: updated.before_image,
    after_image: updated.after_image,
    gallery_images: updated.gallery_images
  });

  if (updated.emotional_descriptor === updatePayload.project.emotionalDescriptor) {
    console.log('\n✅ VERIFICATION SUCCESS: Data genuinely saved to Supabase and persisted!');
  } else {
    console.error('\n❌ VERIFICATION FAILED: Data did not match update payload');
  }
}

testFullFlow().catch(console.error);
