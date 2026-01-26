const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Brand colors - Memento Academy
const COLORS = {
  white: '#FFFFFF',
  cyan: '#00D9FF',      // Memento brand cyan
  teal: '#14B8A6',      // Teal accent
  navy: {
    dark: '#0A1628',    // Very dark navy
    medium: '#1A2B3D',  // Medium navy
    light: '#243B53'    // Lighter navy
  },
};

const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 675;

const LOGO_SOURCE = path.join(__dirname, 'images', 'logo.png');
const LOGO_PATH = path.join(__dirname, 'images', 'logo.png');
const OUTPUT_DIR = path.join(__dirname, 'images', 'content'); // Saving to content folder directly

// Check/Create dirs
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function prepareLogo() {
  if (fs.existsSync(LOGO_PATH)) return;
  if (!fs.existsSync(LOGO_SOURCE)) return;

  try {
    const metadata = await sharp(LOGO_SOURCE).metadata();
    const solidCyan = await sharp({
        create: {
          width: metadata.width,
          height: metadata.height,
          channels: 4,
          background: COLORS.cyan
        }
      }).png().toBuffer();

    await sharp(solidCyan)
      .composite([{ input: LOGO_SOURCE, blend: 'dest-in' }])
      .toFile(LOGO_PATH);
  } catch (err) {
    console.error('Error generating logo:', err);
  }
}

async function generateCommunityImage(options) {
  const { filename, title, subtitle, label, style = 'blue' } = options;
  
  // Choose background gradient based on style
  let backgroundBuffer;
  
  // Simple gradient generation via SVG if no base image
  const svgGradient = `
    <svg width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${COLORS.navy.dark};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${style === 'purple' ? COLORS.navy.light : COLORS.navy.medium};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="url(#grad)"/>
      <circle cx="${style === 'purple' ? IMAGE_WIDTH : 0}" cy="0" r="600" fill="${style === 'purple' ? COLORS.teal : COLORS.cyan}" opacity="0.1"/>
    </svg>
  `;
  backgroundBuffer = Buffer.from(svgGradient);

  // SVG Overlay for text
  const svgOverlay = `
    <svg width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <!-- Label/Badge -->
      <rect x="80" y="80" width="${label.length * 14 + 60}" height="50" fill="${COLORS.cyan}" fill-opacity="0.15" rx="25"/>
      <text x="${80 + (label.length * 14 + 60) / 2}" y="115"
            font-family="'DejaVu Sans', Verdana, sans-serif"
            font-size="22" font-weight="700"
            fill="${COLORS.cyan}" text-anchor="middle">${label.toUpperCase()}</text>

      <!-- Main Title -->
      <text x="80" y="320"
            font-family="'DejaVu Sans', Verdana, sans-serif"
            font-size="80" font-weight="900"
            fill="${COLORS.white}" letter-spacing="-2">${title}</text>
            
      <!-- Subtitle -->
      <text x="80" y="400"
            font-family="'DejaVu Sans', Verdana, sans-serif"
            font-size="40" font-weight="500"
            fill="${COLORS.white}" opacity="0.8">${subtitle}</text>

      <!-- Footer -->
      <text x="80" y="${IMAGE_HEIGHT - 60}"
            font-family="'DejaVu Sans', Verdana, sans-serif"
            font-size="28" font-weight="700"
            fill="${COLORS.white}" opacity="0.9">Memento Academy</text>
            
      <text x="80" y="${IMAGE_HEIGHT - 25}"
            font-family="'DejaVu Sans', Verdana, sans-serif"
            font-size="20" font-weight="400"
            fill="${COLORS.white}" opacity="0.6">github.com/orgs/Memento-Academy/discussions</text>
    </svg>
  `;

  const outputPath = path.join(OUTPUT_DIR, `${filename}.png`);

  try {
     // Prepare Logo
     let logoBuffer = null;
     if (fs.existsSync(LOGO_PATH)) {
        logoBuffer = await sharp(LOGO_PATH)
          .resize(180, 180, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
          .png()
          .toBuffer();
     }

     const composites = [
        { input: Buffer.from(svgOverlay), top: 0, left: 0 }
     ];

     if (logoBuffer) {
        composites.push({ input: logoBuffer, top: IMAGE_HEIGHT - 220, left: IMAGE_WIDTH - 220 });
     }

     await sharp(backgroundBuffer)
       .composite(composites)
       .png()
       .toFile(outputPath);

     console.log(`✓ Generated: ${filename}.png`);

  } catch (error) {
     console.error(`Error generating ${filename}:`, error);
  }
}

async function generateAll() {
  await prepareLogo();

  const images = [
    // English
    {
       filename: 'community-announcements-en',
       title: 'Community Updates',
       subtitle: 'Stay up to date with Memento',
       label: 'Announcements',
       style: 'blue'
    },
    {
       filename: 'community-rules-en',
       title: 'Rules & Intro',
       subtitle: 'Start your journey here',
       label: 'Community',
       style: 'purple'
    },
    {
       filename: 'community-discussion-en',
       title: 'Join the Discussion',
       subtitle: 'Share your ideas & questions',
       label: 'Forum',
       style: 'blue'
    },
    // Spanish
    {
       filename: 'community-announcements-es',
       title: 'Actualizaciones',
       subtitle: 'Novedades de Memento Academy',
       label: 'Anuncios',
       style: 'blue'
    },
    {
       filename: 'community-rules-es',
       title: 'Reglas e Intro',
       subtitle: 'Empieza tu camino aquí',
       label: 'Comunidad',
       style: 'purple'
    },
    {
       filename: 'community-discussion-es',
       title: 'Únete al Debate',
       subtitle: 'Comparte ideas y preguntas',
       label: 'Foro',
       style: 'blue'
    }
  ];

  for (const img of images) {
    await generateCommunityImage(img);
  }
}

generateAll();
