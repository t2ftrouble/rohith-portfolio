import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(url, serviceKey);

async function testUpdate() {
  const { data: projects, error: listErr } = await supabaseAdmin.from('projects').select('*');
  if (listErr || !projects || projects.length === 0) {
    console.error('No projects found:', listErr);
    return;
  }

  const p = projects[0];
  console.log('Testing update on project id:', p.id, 'title:', p.title);

  // Let's simulate what ProjectForm sends and how api.projects.$id transforms it
  const projectFormData = {
    slug: p.slug,
    number: p.number,
    title: p.title,
    type: p.type,
    role: p.role,
    description: p.description,
    process: p.process,
    visuals: p.visuals,
    image: p.image,
    category: p.category,
    hasVideo: p.has_video,
    videoId: p.video_id || '',
    year: p.year || '2023',
    status: p.status || 'Released',
    fullCredits: p.full_credits || '',
    client: p.client || '',
    posterImage: p.poster_image || '',
    showBeforeAfter: p.show_before_after || false,
    beforeImage: p.before_image || '',
    afterImage: p.after_image || '',
    emotionalDescriptor: p.emotional_descriptor || '',
    whatIFelt: p.what_i_felt || '',
  };

  // Transformation in api.projects.$id.ts:
  const supabaseProject = {};
  for (const [key, value] of Object.entries(projectFormData)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    supabaseProject[snakeKey] = value;
  }

  console.log('Transformed update payload:', supabaseProject);

  const result = await supabaseAdmin.from('projects').update(supabaseProject).eq('id', p.id).select().single();
  console.log('Update result data:', result.data?.id, result.data?.title);
  console.log('Update error:', result.error);
}

testUpdate().catch(console.error);
