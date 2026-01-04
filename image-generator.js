const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Brand colors (from Memento Academy)
const BRAND_COLORS = {
  primary: '#171717',      // Dark gray/black
  background: '#FFFFFF',   // White
  foreground: '#FAFAFA',   // Almost white
  accent: '#3B82F6'        // Blue accent for Web3
};

// Image dimensions for Twitter (recommended)
const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 675; // 16:9 ratio

// Paths
const LOGO_PATH = path.join(__dirname, 'images', 'logo.png');
const OUTPUT_DIR = path.join(__dirname, 'images', 'generated');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generate a branded image for a course or tweet
 * @param {Object} options - Image generation options
 * @param {string} options.title - Main title text
 * @param {string} options.subtitle - Subtitle text (optional)
 * @param {string} options.category - Category/tag (e.g., "Web3 Basics", "Free Course")
 * @param {string} options.filename - Output filename (without extension)
 * @param {string} options.bgColor - Background color (default: white)
 * @returns {Promise<string>} - Path to generated image
 */
async function generateBrandedImage(options) {
  const {
    title,
    subtitle = '',
    category = 'Memento Academy',
    filename,
    bgColor = BRAND_COLORS.background
  } = options;

  try {
    // Create SVG with text
    const svg = `
      <svg width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="${bgColor}"/>

        <!-- Gradient overlay (subtle) -->
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${BRAND_COLORS.accent};stop-opacity:0.05" />
            <stop offset="100%" style="stop-color:${BRAND_COLORS.primary};stop-opacity:0.1" />
          </linearGradient>
        </defs>
        <rect width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}" fill="url(#grad1)"/>

        <!-- Category badge -->
        <rect x="60" y="60" width="${category.length * 12 + 40}" height="50"
              fill="${BRAND_COLORS.primary}" rx="25"/>
        <text x="80" y="92"
              font-family="Arial, sans-serif"
              font-size="22"
              font-weight="600"
              fill="${BRAND_COLORS.foreground}">${category}</text>

        <!-- Title -->
        <text x="60" y="250"
              font-family="Arial, sans-serif"
              font-size="72"
              font-weight="800"
              fill="${BRAND_COLORS.primary}"
              style="max-width: 1080px">${title}</text>

        ${subtitle ? `
        <!-- Subtitle -->
        <text x="60" y="360"
              font-family="Arial, sans-serif"
              font-size="36"
              font-weight="400"
              fill="${BRAND_COLORS.primary}"
              opacity="0.7">${subtitle}</text>
        ` : ''}

        <!-- Footer tagline -->
        <text x="60" y="${IMAGE_HEIGHT - 80}"
              font-family="Arial, sans-serif"
              font-size="28"
              font-weight="500"
              fill="${BRAND_COLORS.primary}"
              opacity="0.6">Free Web3 Education • 50K+ Students</text>
      </svg>
    `;

    // Load logo
    const logo = await sharp(LOGO_PATH)
      .resize(180, 180, { fit: 'contain' })
      .toBuffer();

    // Generate base image from SVG
    const outputPath = path.join(OUTPUT_DIR, `${filename}.png`);

    await sharp(Buffer.from(svg))
      .composite([
        {
          input: logo,
          top: IMAGE_HEIGHT - 240,
          left: IMAGE_WIDTH - 240
        }
      ])
      .png()
      .toFile(outputPath);

    console.log(`✓ Generated image: ${outputPath}`);
    return outputPath;

  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

/**
 * Generate course promotional images
 */
async function generateCourseImages() {
  const courses = [
    {
      filename: 'web3-basics-en',
      title: 'Web3 Basics',
      subtitle: 'Learn blockchain fundamentals',
      category: 'Free Course • 45 min'
    },
    {
      filename: 'web3-basics-es',
      title: 'Web3 Básico',
      subtitle: 'Aprende los fundamentos',
      category: 'Curso Gratis • 45 min'
    },
    {
      filename: 'crypto-101-en',
      title: 'Crypto 101',
      subtitle: 'Bitcoin, Ethereum and More',
      category: 'Free Course • 60 min'
    },
    {
      filename: 'crypto-101-es',
      title: 'Crypto 101',
      subtitle: 'Bitcoin, Ethereum y más',
      category: 'Curso Gratis • 60 min'
    },
    {
      filename: 'cbdc-en',
      title: 'Understanding CBDCs',
      subtitle: 'Digital money revolution',
      category: 'Free Course • 40 min'
    },
    {
      filename: 'cbdc-es',
      title: 'CBDCs Explicado',
      subtitle: 'Revolución del dinero digital',
      category: 'Curso Gratis • 40 min'
    },
    {
      filename: 'security-en',
      title: 'Web3 Security',
      subtitle: 'Protect your crypto assets',
      category: 'Free Course • 50 min'
    },
    {
      filename: 'security-es',
      title: 'Seguridad Web3',
      subtitle: 'Protege tus activos crypto',
      category: 'Curso Gratis • 50 min'
    }
  ];

  console.log('Generating course promotional images...\n');

  for (const course of courses) {
    await generateBrandedImage(course);
  }

  console.log(`\n✓ Generated ${courses.length} course images`);
}

// Generic branded image for general tweets
async function generateGenericImages() {
  const images = [
    {
      filename: 'community-en',
      title: 'Join Our Community',
      subtitle: '50K+ Web3 Learners',
      category: 'Memento Academy'
    },
    {
      filename: 'community-es',
      title: 'Únete a la Comunidad',
      subtitle: 'Más de 50K estudiantes',
      category: 'Memento Academy'
    }
  ];

  console.log('\nGenerating generic branded images...\n');

  for (const img of images) {
    await generateBrandedImage(img);
  }

  console.log(`\n✓ Generated ${images.length} generic images`);
}

// Export functions
module.exports = {
  generateBrandedImage,
  generateCourseImages,
  generateGenericImages
};

// Run if called directly
if (require.main === module) {
  console.log('=== Memento Academy Image Generator ===\n');

  (async () => {
    await generateCourseImages();
    await generateGenericImages();
    console.log('\n✓ All images generated successfully!');
    console.log(`Output directory: ${OUTPUT_DIR}`);
  })();
}
