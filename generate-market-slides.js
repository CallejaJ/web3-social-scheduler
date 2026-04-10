const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configuration for reveal slides
const SLIDES = [
    { file: 'market-slide-1.png', text: 'Resumen semanal del' },
    { file: 'market-slide-2.png', text: 'mercado cripto' },
    { file: 'market-slide-3.png', text: 'para los que quieren entender' },
    { file: 'market-slide-4.png', text: '(sin morir en el intento)' }
];

const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_DIR = path.join(__dirname, 'images', 'generated');
const BG_DARK = path.join(IMAGES_DIR, 'quiz-bg-dark.png');
const LOGO = path.join(IMAGES_DIR, 'memento_academy_logo_text.png');

async function generateMarketSlides() {
    const width = 1920;
    const height = 1080;
    
    console.log('Generating market summary slides...');

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Resize BG to cover
    const bgBuffer = await sharp(BG_DARK)
        .resize(width, height, { fit: 'cover' })
        .toBuffer();

    // Logo
    const logoWidth = 400;
    const logoBuffer = await sharp(LOGO)
        .resize(logoWidth)
        .toBuffer();

    for (const slide of SLIDES) {
        console.log(`- Creating ${slide.file}...`);
        
        const svgText = `
        <svg width="${width}" height="${height}">
            <style>
                .text { fill: #ffffff; font-size: 100px; font-family: 'Courier New', monospace; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
            </style>
            <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="text">${slide.text.toUpperCase()}</text>
        </svg>
        `;

        await sharp(bgBuffer)
            .composite([
                { input: Buffer.from(svgText), top: 0, left: 0 },
                { input: logoBuffer, top: 850, left: (width - logoWidth) / 2 }
            ])
            .toFile(path.join(OUTPUT_DIR, slide.file));
    }

    console.log('✓ All market slides created.');
}

generateMarketSlides();
