async function testApi() {
  const baseUrl = 'http://localhost:8081';
  console.log('--- 1. Testing GET /api/projects ---');
  const getRes = await fetch(`${baseUrl}/api/projects`);
  console.log('GET status:', getRes.status);
  const getData = await getRes.json();
  console.log('GET projects count:', getData.projects?.length);
  if (!getData.projects || getData.projects.length === 0) {
    console.error('No projects returned');
    return;
  }
  const firstProject = getData.projects[0];
  console.log('First project ID:', firstProject.id, 'Title:', firstProject.title);

  console.log('\n--- 2. Testing POST /api/admin/login ---');
  const loginRes = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'rohith2024' })
  });
  console.log('Login status:', loginRes.status);
  const loginHeaders = Object.fromEntries(loginRes.headers.entries());
  console.log('Login response headers:', loginHeaders);
  const setCookie = loginRes.headers.get('set-cookie');
  console.log('Set-Cookie header:', setCookie);
  const loginData = await loginRes.json();
  console.log('Login data:', loginData);

  console.log('\n--- 3. Testing PUT /api/projects/' + firstProject.id + ' with Cookie ---');
  const cookieToSend = setCookie ? setCookie.split(';')[0] : '';
  console.log('Cookie to send:', cookieToSend);

  const putRes = await fetch(`${baseUrl}/api/projects/${firstProject.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieToSend
    },
    body: JSON.stringify({
      project: {
        title: firstProject.title,
        slug: firstProject.slug,
        number: firstProject.number,
        type: firstProject.type,
        role: firstProject.role,
        description: firstProject.description,
        process: firstProject.process,
        visuals: firstProject.visuals,
        image: firstProject.image,
        category: firstProject.category,
        year: firstProject.year,
        status: firstProject.status,
        videoId: firstProject.video_id,
        fullCredits: firstProject.full_credits,
        galleryImages: firstProject.gallery_images || [],
        client: firstProject.client,
        posterImage: firstProject.poster_image,
        showBeforeAfter: firstProject.show_before_after,
        beforeImage: firstProject.before_image,
        afterImage: firstProject.after_image,
        emotionalDescriptor: firstProject.emotional_descriptor,
        whatIFelt: firstProject.what_i_felt
      }
    })
  });
  console.log('PUT status:', putRes.status);
  const putText = await putRes.text();
  console.log('PUT response:', putText);
}

testApi().catch(console.error);
