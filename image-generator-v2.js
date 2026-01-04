const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Brand colors - Memento Academy
const COLORS = {
  white: '#FFFFFF',
  cyan: '#00D9FF',      // Memento brand cyan
  teal: '#14B8A6',      // Teal accent
  navy: {
    dark: '#0A1628',    // Very dark navy (from image)
    medium: '#1A2B3D',  // Medium navy
    light: '#243B53'    // Lighter navy
  },
  gray: {
    50: '#FAFAFA',
    100: '#F4F4F5'
  }
};

const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 675;

const LOGO_SOURCE = path.join(__dirname, 'images', 'logo.png');
const LOGO_PATH = path.join(__dirname, 'images', 'logo-cyan.png');
const OUTPUT_DIR = path.join(__dirname, 'images', 'generated');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Create Cyan Logo if it doesn't exist
 */
async function prepareLogo() {
  if (fs.existsSync(LOGO_PATH)) {
    console.log('Using existing logo-cyan.png');
    return;
  }
  
  if (!fs.existsSync(LOGO_SOURCE)) {
    console.warn('Warning: Source logo.png not found. Skipping logo generation.');
    return;
  }

  try {
    console.log('Generating logo-cyan.png from source...');
    const metadata = await sharp(LOGO_SOURCE).metadata();
    
    // Create cyan overlay
    const solidCyan = await sharp({
        create: {
          width: metadata.width,
          height: metadata.height,
          channels: 4,
          background: COLORS.cyan
        }
      })
      .png()
      .toBuffer();

    // Composite
    await sharp(solidCyan)
      .composite([{
        input: LOGO_SOURCE,
        blend: 'dest-in'
      }])
      .toFile(LOGO_PATH);
      
    console.log('✓ Created logo-cyan.png');
  } catch (err) {
    console.error('Error generating logo:', err);
  }
}

/**
 * Modern gradient background designs
 */
const GRADIENT_STYLES = {
  blue: `
    <defs>
      <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${COLORS.navy.dark};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${COLORS.navy.medium};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="url(#grad-blue)"/>
    <circle cx="0" cy="0" r="600" fill="${COLORS.cyan}" opacity="0.1"/>
  `,

  purple: `
    <defs>
      <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${COLORS.navy.medium};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${COLORS.navy.light};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="url(#grad-purple)"/>
    <circle cx="${IMAGE_WIDTH}" cy="0" r="600" fill="${COLORS.teal}" opacity="0.1"/>
  `,

  dark: `
    <rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="${COLORS.navy.dark}"/>
    <defs>
      <linearGradient id="grad-dark-overlay" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${COLORS.cyan};stop-opacity:0.05" />
        <stop offset="100%" style="stop-color:${COLORS.navy.light};stop-opacity:0.1" />
      </linearGradient>
    </defs>
    <rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="url(#grad-dark-overlay)"/>
  `,

  light: `
    <rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="${COLORS.white}"/>
    <defs>
      <linearGradient id="grad-light-overlay" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${COLORS.cyan};stop-opacity:0.05" />
        <stop offset="100%" style="stop-color:${COLORS.teal};stop-opacity:0.08" />
      </linearGradient>
    </defs>
    <rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="url(#grad-light-overlay)"/>
  `
};

/**
 * Generate professional course image
 */
async function generateCourseImage(options) {
  const {
    filename,
    title,
    subtitle = '',
    duration = '',
    language = 'en',
    style = 'blue' // blue, purple, dark, light
  } = options;

  const isDark = ['blue', 'purple', 'dark'].includes(style);
  const textColor = isDark ? COLORS.white : COLORS.navy.dark;
  // Use Cyan for badges in dark mode for that "glowing" effect
  const badgeColor = isDark ? 'rgba(0, 217, 255, 0.15)' : 'rgba(10, 22, 40, 0.05)';
  const badgeTextColor = isDark ? COLORS.cyan : COLORS.navy.medium;

  // Split title into lines if too long
  const maxCharsPerLine = 20;
  const titleWords = title.split(' ');
  let titleLine1 = '';
  let titleLine2 = '';

  for (const word of titleWords) {
    if (titleLine1.length + word.length <= maxCharsPerLine) {
      titleLine1 += (titleLine1 ? ' ' : '') + word;
    } else {
      titleLine2 += (titleLine2 ? ' ' : '') + word;
    }
  }

  const svg = `
    <svg width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background gradient -->
      ${GRADIENT_STYLES[style]}

      <!-- Decorative circles -->
      <circle cx="100" cy="100" r="150" fill="${badgeColor}" opacity="0.3"/>
      <circle cx="${IMAGE_WIDTH - 100}" cy="${IMAGE_HEIGHT - 100}" r="200" fill="${badgeColor}" opacity="0.2"/>

      <!-- Free badge -->
      <rect x="80" y="80" width="180" height="60" fill="${badgeColor}" rx="30"/>
      <text x="170" y="118"
            font-family="'DejaVu Sans', Verdana, sans-serif"
            font-size="28"
            font-weight="700"
            fill="${badgeTextColor}"
            text-anchor="middle">FREE</text>

      <!-- Duration badge -->
      ${duration ? `
      <rect x="280" y="80" width="${duration.length * 16 + 40}" height="60"
            fill="${badgeColor}" rx="30"/>
      <text x="${280 + (duration.length * 16 + 40) / 2}" y="118"
            font-family="Arial, Helvetica, sans-serif"
            font-size="24"
            font-weight="600"
            fill="${badgeTextColor}"
            text-anchor="middle">${duration}</text>
      ` : ''}

      <!-- Main title -->
      <text x="80" y="300"
            font-family="'DejaVu Sans', Verdana, sans-serif"
            font-size="90"
            font-weight="900"
            fill="${textColor}"
            letter-spacing="-2">${titleLine1}</text>

      ${titleLine2 ? `
      <text x="80" y="400"
            font-family="Arial, Helvetica, sans-serif"
            font-size="90"
            font-weight="900"
            fill="${textColor}"
            letter-spacing="-2">${titleLine2}</text>
      ` : ''}

      <!-- Subtitle -->
      ${subtitle ? `
      <text x="80" y="${titleLine2 ? 480 : 380}"
            font-family="Arial, Helvetica, sans-serif"
            font-size="40"
            font-weight="500"
            fill="${textColor}"
            opacity="0.85">${subtitle}</text>
      ` : ''}

      <!-- Footer branding -->
      <text x="80" y="${IMAGE_HEIGHT - 60}"
            font-family="Arial, Helvetica, sans-serif"
            font-size="32"
            font-weight="700"
            fill="${textColor}"
            opacity="0.9">Memento Academy</text>

      <text x="80" y="${IMAGE_HEIGHT - 20}"
            font-family="Arial, Helvetica, sans-serif"
            font-size="24"
            font-weight="400"
            fill="${textColor}"
            opacity="0.7">50,000+ Students • 100% Free</text>
    </svg>
  `;

  try {
    // Process logo - resize and prepare
    let logoBuffer;
    try {
      logoBuffer = await sharp(LOGO_PATH)
        .resize(200, 200, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer();
    } catch (err) {
      console.warn('Logo not found, skipping logo overlay');
      logoBuffer = null;
    }

    const outputPath = path.join(OUTPUT_DIR, `${filename}.png`);

    // Composite logo if available
    const composites = [];
    if (logoBuffer) {
      composites.push({
        input: logoBuffer,
        top: IMAGE_HEIGHT - 250,
        left: IMAGE_WIDTH - 280
      });
    }

    await sharp(Buffer.from(svg))
      .composite(composites)
      .png({ quality: 95, compressionLevel: 9 })
      .toFile(outputPath);

    console.log(`✓ Generated: ${filename}.png`);
    return outputPath;

  } catch (error) {
    console.error(`Error generating ${filename}:`, error.message);
    throw error;
  }
}

/**
 * Generate all course images with varied styles
 */
async function generateAllCourseImages() {
  const courses = [
    // Web3 Basics
    {
      filename: 'web3-basics-en',
      title: 'Web3 Basics',
      subtitle: 'Blockchain Fundamentals',
      duration: '45 min',
      language: 'en',
      style: 'blue'
    },
    {
      filename: 'web3-basics-es',
      title: 'Web3 Básico',
      subtitle: 'Fundamentos Blockchain',
      duration: '45 min',
      language: 'es',
      style: 'blue'
    },

    // Crypto 101
    {
      filename: 'crypto-101-en',
      title: 'Crypto 101',
      subtitle: 'Bitcoin, Ethereum, Altcoins',
      duration: '60 min',
      language: 'en',
      style: 'purple'
    },
    {
      filename: 'crypto-101-es',
      title: 'Crypto 101',
      subtitle: 'Bitcoin, Ethereum, Altcoins',
      duration: '60 min',
      language: 'es',
      style: 'purple'
    },

    // CBDCs
    {
      filename: 'cbdc-en',
      title: 'CBDCs',
      subtitle: 'Digital Currency Revolution',
      duration: '40 min',
      language: 'en',
      style: 'dark'
    },
    {
      filename: 'cbdc-es',
      title: 'CBDCs',
      subtitle: 'Revolución Monetaria Digital',
      duration: '40 min',
      language: 'es',
      style: 'dark'
    },

    // Security
    {
      filename: 'security-en',
      title: 'Web3 Security',
      subtitle: 'Protect Your Assets',
      duration: '50 min',
      language: 'en',
      style: 'light'
    },
    {
      filename: 'security-es',
      title: 'Seguridad Web3',
      subtitle: 'Protege Tus Activos',
      duration: '50 min',
      language: 'es',
      style: 'light'
    },

    // Generic community images
    {
      filename: 'community-en',
      title: 'Join Us',
      subtitle: 'Learn Web3 Together',
      duration: '',
      language: 'en',
      style: 'blue'
    },
    {
      filename: 'community-es',
      title: 'Únete',
      subtitle: 'Aprende Web3 en Comunidad',
      duration: '',
      language: 'es',
      style: 'blue'
    }
  ];

  console.log('\n=== Generating Professional Course Images ===\n');

  await prepareLogo();

  for (const course of courses) {
    await generateCourseImage(course);
  }

  console.log(`\n✓ Successfully generated ${courses.length} images`);
  console.log(`Output: ${OUTPUT_DIR}\n`);
}

module.exports = {
  generateCourseImage,
  generateAllCourseImages
};

// Run if called directly
if (require.main === module) {
  generateAllCourseImages().catch(console.error);
}
