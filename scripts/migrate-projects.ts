// Migration script to move existing projects to Supabase
// This script should be run once after setting up Supabase
// Run with: npx tsx scripts/migrate-projects.ts

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Existing project data
const defaultProjects = [
  {
    slug: "one-last-day",
    number: "01",
    title: "One Last Day",
    type: "Short Film",
    role: "Story • Screenplay • Director • Editor • DI",
    year: "2023",
    status: "Released",
    description: "A heartfelt story of silence, regret and final goodbyes. This was Rohith V's first short film attempt, made without prior filmmaking experience. Shot entirely on iPhone with zero budget. The project became a major learning experience through experimentation, mistakes, storytelling, direction, editing and teamwork.",
    process: [
      "Story and screenplay development",
      "Direction on set",
      "Shot planning and scene composition",
      "Visual storytelling and blocking",
      "Editing and post-production through final cut",
      "DI (Digital Intermediate)"
    ],
    visuals: "Film video, poster, film stills, editing/VFX breakdown",
    image: "project-one-last-day.webp",
    hasVideo: true,
    videoId: "tUnBO1O66Fc",
    fullCredits: "Written / Story / Screenplay / Directed / Edited / DI: Rohith V\n\nCast:\nYash Vijay as Deva\nVarsha\n\nAssistant Director / Script Supervisor:\nYashwanth VK\n\nAssistant Directors:\nRamu\nYukesh\n\nDOP:\nYashwanth VK\nBhuvana\n\nMusic:\nDanny\nGovarthan\n\nDubbing:\nDharshan Karthi as Loran\nYukendiran — VO\n\nCrew:\nRitesh\nYabees\nSalvador Madhavan\n\nSpecial Thanks:\nRegan\nFarwys\n\nShot with: iPhone\nBudget: Zero\nLanguage: Tamil with English essence",
    category: "FILMMAKING",
    emotionalDescriptor: "A story about letting go.",
    whatIFelt: "My first film was about learning through mistakes. Every limitation became creative opportunity. The silence in the film reflects how I learned to let frames breathe."
  },
  {
    slug: "toothpaste",
    number: "02",
    title: "Toothpaste",
    type: "Short Film",
    role: "Story • Direction • Editing",
    year: "2024",
    status: "Completed",
    description: "A suspenseful and mind-bending short film that turns an everyday morning routine into something unsettling. Shot entirely on iPhone and created with friends in 2024. The project explores suspense, visual storytelling and an unexpected twist using minimal resources.",
    process: [
      "Story development",
      "Direction on set",
      "Editing and post-production"
    ],
    visuals: "Video, poster, film stills",
    image: "project-toothpaste.webp",
    hasVideo: true,
    videoId: "JBkb8iHCOh4",
    fullCredits: "Story / Direction / Editing: Rohith V\n\nDOP: Yashwanth VK\n\nAssistant Directors:\nYukesh\nYash Vijay\n\nCast:\nRamu\nYashwanth VK\n\nMusic: Govarthan",
    category: "FILMMAKING",
    emotionalDescriptor: "An idea turned into a visual experience.",
    whatIFelt: "The everyday can become unsettling with the right perspective. This film taught me that suspense lives in the details we usually ignore."
  },
  {
    slug: "kadalar",
    number: "03",
    title: "Kadalar",
    type: "Pilot Film",
    role: "CG Artist — Selected CGI Contribution",
    description: "Pilot film directed by Siva Murugan. Contributed to selected CGI work including Candle CGI and News CGI. Some CGI had already been worked on by another CG artist before this contribution.",
    process: [
      "Candle CGI contribution",
      "News CGI contribution",
      "CG-based visual development",
      "Post-production support"
    ],
    visuals: "Images, actual before/after CGI images, VFX material",
    image: "project-kadalar.webp",
    fullCredits: "Director: Siva Murugan\n\nCG Artist — Selected CGI Contribution: Rohith V\n\n(Contributed to Candle CGI and News CGI)",
    category: "VFX / CG",
    emotionalDescriptor: "Where the frame carries the feeling.",
    whatIFelt: "Collaborating on a pilot film showed me how CGI should serve the story, not just look cool. Every effect had to have emotional weight."
  },
  {
    slug: "radhal",
    number: "04",
    title: "Radhal",
    type: "Pilot Film",
    role: "Assistant Writer — Script & Screenplay",
    status: "In Pre-Production",
    description: "Upcoming pilot film project. Currently serving as Assistant Writer for script and screenplay development. The screenplay is currently being developed.",
    process: [
      "Story structure development",
      "Scene development",
      "Narrative planning",
      "Script and screenplay assistance"
    ],
    visuals: "Screenplay material, pre-production material",
    image: "project-radhal.webp",
    fullCredits: "Status: In Pre-Production\n\nRole: Assistant Writer — Script & Screenplay",
    category: "FILMMAKING",
    emotionalDescriptor: "A story that stays after the frame ends.",
    whatIFelt: "Screenwriting taught me that every line must earn its place. This ongoing project is about patience and finding the right word at the right moment."
  }
];

async function migrateProjects() {
  console.log('Starting project migration...');
  
  // Insert projects into database
  for (const project of defaultProjects) {
    const projectData = {
      slug: project.slug,
      number: project.number,
      title: project.title,
      type: project.type,
      role: project.role,
      year: project.year || null,
      status: project.status || null,
      category: project.category,
      description: project.description,
      process: project.process,
      visuals: project.visuals,
      image: project.image, // Using existing asset path
      poster_image: null,
      has_video: project.hasVideo || false,
      video_id: project.videoId || null,
      show_before_after: project.slug === 'one-last-day',
      before_image: null,
      after_image: null,
      full_credits: project.fullCredits || null,
      gallery_images: [],
      client: null,
      emotional_descriptor: project.emotionalDescriptor || null,
      what_i_felt: project.whatIFelt || null,
    };
    
    const { error } = await supabase
      .from('projects')
      .insert(projectData);
    
    if (error) {
      console.error(`Failed to migrate ${project.slug}:`, error);
    } else {
      console.log(`Migrated ${project.slug}`);
    }
  }
  
  console.log('Migration complete!');
  console.log('Note: Asset images are using local paths. Upload them to Supabase Storage via Admin panel.');
}

// Run migration
migrateProjects().catch(console.error);