const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_DIR = path.join(__dirname, 'images', 'generated');
const BG_DARK = path.join(IMAGES_DIR, 'quiz-bg-dark.png');
const LOGO = path.join(IMAGES_DIR, 'memento_academy_logo_text.png');

async function generateIntro() {
    const width = 1920;
    const height = 1080;
    
    console.log('Generating intro slide...');

    // Resize BG to cover
    const bgBuffer = await sharp(BG_DARK)
        .resize(width, height, { fit: 'cover' })
        .toBuffer();

    // Logo
    const logoWidth = 600;
    const logoBuffer = await sharp(LOGO)
        .resize(logoWidth)
        .toBuffer();
        
    // Text SVG
    const title = "¿SABÍAS QUE...?";
    const svgText = `
    <svg width="${width}" height="${height}">
        <style>
            .title { fill: #00d2ff; font-size: 140px; font-family: 'Courier New', monospace; font-weight: 800; text-transform: uppercase; letter-spacing: 5px; }
        </style>
        <text x="50%" y="40%" text-anchor="middle" class="title">${title}</text>
    </svg>
    `;

    // Composite
    // Logo below text? Or text below logo?
    // User said: "logo y el titulo ¿Sabias que...?"
    // Let's put Title at 40% height, Logo at 65% height? or vice-versa.
    // "memento_academy_logo_text.png" usually has text.
    // Let's put Logic: Logo (Brand) then Loop Title?
    // User said: "con el logo y el titulo ¿Sabias que...?"
    // Let's put Title centered, Logo smaller at bottom?
    // Or Logo Centered, Title below?
    
    // Design: 
    // Title (Big): ¿SABÍAS QUE...?  (y=40%)
    // Logo (Centered): (y=65%)
    
    await sharp(bgBuffer)
        .composite([
            { input: Buffer.from(svgText), top: 0, left: 0 },
            { input: logoBuffer, top: 600, left: (width - logoWidth) / 2 }
        ])
        .toFile(path.join(OUTPUT_DIR, 'intro-sabias-que.png'));

    console.log('✓ Created intro-sabias-que.png');
}

generateIntro();
