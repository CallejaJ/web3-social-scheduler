const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_DIR = path.join(__dirname, 'images', 'generated');
const BG_DARK = path.join(IMAGES_DIR, 'quiz-bg-dark.png');
const LOGO = path.join(IMAGES_DIR, 'memento_academy_logo_text.png');

async function generateMarketIntro() {
    const width = 1920;
    const height = 1080;
    
    console.log('Generating market intro slide...');

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Resize BG to cover
    const bgBuffer = await sharp(BG_DARK)
        .resize(width, height, { fit: 'cover' })
        .toBuffer();

    // Logo
    const logoWidth = 600;
    const logoBuffer = await sharp(LOGO)
        .resize(logoWidth)
        .toBuffer();
        
    // Text SVG - First part of the reveal
    const title = "BITCOIN BAJO PRESIÓN";
    const subtitle = "Resumen Semanal";

    const svgText = `
    <svg width="${width}" height="${height}">
        <style>
            .title { fill: #00d2ff; font-size: 140px; font-family: 'Courier New', monospace; font-weight: 800; text-transform: uppercase; letter-spacing: 5px; }
            .subtitle { fill: #ffffff; font-size: 60px; font-family: 'Courier New', monospace; font-weight: 600; text-transform: uppercase; letter-spacing: 15px; }
        </style>
        <text x="50%" y="40%" text-anchor="middle" class="title">${title}</text>
        <text x="50%" y="52%" text-anchor="middle" class="subtitle">${subtitle}</text>
    </svg>
    `;

    await sharp(bgBuffer)
        .composite([
            { input: Buffer.from(svgText), top: 0, left: 0 },
            { input: logoBuffer, top: 700, left: (width - logoWidth) / 2 }
        ])
        .toFile(path.join(OUTPUT_DIR, 'market-intro.png'));

    console.log('✓ Created market-intro.png');
}

generateMarketIntro();
