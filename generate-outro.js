const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_DIR = path.join(__dirname, 'images', 'generated');
const BG_DARK = path.join(IMAGES_DIR, 'quiz-bg-dark.png');
const LOGO = path.join(IMAGES_DIR, 'memento_academy_logo_text.png');

async function generateOutro() {
    const width = 1920;
    const height = 1080;
    
    console.log('Generating outro slide (v2)...');

    // Resize BG to cover
    const bgBuffer = await sharp(BG_DARK)
        .resize(width, height, { fit: 'cover' })
        .toBuffer();

    // Logo - Centered in top half or middle?
    // Let's put text aimed at center, logo at bottom?
    // Or Logo Top, Text Bottom.
    // Let's go with:
    // CTA (Small/Medium)
    // URL (Large, Teal)
    // Logo (Bottom)
    
    // Resize logo
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
        <!-- Center Group -->
        <text x="50%" y="42%" text-anchor="middle" class="cta">${cta}</text>
        <text x="50%" y="55%" text-anchor="middle" class="url">${url}</text>
    </svg>
    `;

    // Composite
    // Logo at bottom
    // y = 1080 - 400 (height approx?) - padding.
    // Let's put logo at y=750 approx.
    
    await sharp(bgBuffer)
        .composite([
            { input: Buffer.from(svgText), top: 0, left: 0 },
            { input: logoBuffer, top: 750, left: (width - logoWidth) / 2 }
        ])
        .toFile(path.join(OUTPUT_DIR, 'outro-url.png'));

    console.log('✓ Created outro-url.png');
}

generateOutro();
