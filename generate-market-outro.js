const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_DIR = path.join(__dirname, 'images', 'generated');
const BG_DARK = path.join(IMAGES_DIR, 'quiz-bg-dark.png');
const LOGO = path.join(IMAGES_DIR, 'memento_academy_logo_text.png');

async function generateMarketOutro() {
    const width = 1920;
    const height = 1080;
    
    console.log('Generating market outro slide...');

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const bgBuffer = await sharp(BG_DARK)
        .resize(width, height, { fit: 'cover' })
        .toBuffer();

    const logoWidth = 400;
    const logoBuffer = await sharp(LOGO)
        .resize(logoWidth)
        .toBuffer();

    const url = "memento-academy.com";
    const cta = "APRENDE WEB3 GRATIS";
    
    const svgText = `
    <svg width="${width}" height="${height}">
        <style>
            .cta { fill: white; font-size: 60px; font-family: Arial, sans-serif; font-weight: 600; letter-spacing: 8px; }
            .url { fill: #00d2ff; font-size: 110px; font-family: 'Courier New', monospace; font-weight: 800; letter-spacing: 2px; }
        </style>
        <text x="50%" y="42%" text-anchor="middle" class="cta">${cta}</text>
        <text x="50%" y="55%" text-anchor="middle" class="url">${url}</text>
    </svg>
    `;

    await sharp(bgBuffer)
        .composite([
            { input: Buffer.from(svgText), top: 0, left: 0 },
            { input: logoBuffer, top: 750, left: (width - logoWidth) / 2 }
        ])
        .toFile(path.join(OUTPUT_DIR, 'market-outro.png'));

    console.log('✓ Created market-outro.png');
}

generateMarketOutro();
