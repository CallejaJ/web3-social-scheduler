const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_DIR = path.join(__dirname, 'images', 'generated');
const BG_DARK = path.join(IMAGES_DIR, 'quiz-bg-dark.png');
const LOGO = path.join(IMAGES_DIR, 'memento_academy_logo_text.png');

async function generateReferralSlides() {
    const width = 1920;
    const height = 1080;

    // Logo
    const logoWidth = 500;
    const logoBuffer = await sharp(LOGO)
        .resize(logoWidth)
        .toBuffer();

    // Resize BG to cover
    const bgBuffer = await sharp(BG_DARK)
        .resize(width, height, { fit: 'cover' })
        .toBuffer();

    console.log('Generating referral program slides...');

    // Slide 1: Earn MEMOs - English
    const slide1Svg = `
    <svg width="${width}" height="${height}">
        <style>
            .title { fill: #00d2ff; font-size: 120px; font-family: 'Courier New', monospace; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; }
            .subtitle { fill: #ffffff; font-size: 60px; font-family: 'Courier New', monospace; font-weight: 600; letter-spacing: 2px; }
            .text { fill: #e0e0e0; font-size: 45px; font-family: 'Courier New', monospace; font-weight: 400; }
        </style>
        <text x="50%" y="35%" text-anchor="middle" class="title">EARN MEMOs</text>
        <text x="50%" y="55%" text-anchor="middle" class="subtitle">Invite Friends</text>
        <text x="50%" y="75%" text-anchor="middle" class="text">Get 5 MEMO per referral</text>
    </svg>
    `;

    await sharp(bgBuffer)
        .composite([
            { input: Buffer.from(slide1Svg), top: 0, left: 0 },
            { input: logoBuffer, top: 850, left: (width - logoWidth) / 2 }
        ])
        .toFile(path.join(OUTPUT_DIR, 'referral-earn-en.png'));

    console.log('✓ Created referral-earn-en.png');

    // Slide 2: Como Funciona - Spanish
    const slide2Svg = `
    <svg width="${width}" height="${height}">
        <style>
            .title { fill: #00d2ff; font-size: 120px; font-family: 'Courier New', monospace; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; }
            .subtitle { fill: #ffffff; font-size: 60px; font-family: 'Courier New', monospace; font-weight: 600; }
            .step { fill: #e0e0e0; font-size: 40px; font-family: 'Courier New', monospace; font-weight: 400; }
        </style>
        <text x="50%" y="25%" text-anchor="middle" class="title">CÓMO FUNCIONA</text>
        <text x="50%" y="42%" text-anchor="middle" class="step">1. Genera tu código</text>
        <text x="50%" y="57%" text-anchor="middle" class="step">2. Comparte con amigos</text>
        <text x="50%" y="72%" text-anchor="middle" class="step">3. ¡Reclama 5 MEMO por cada uno!</text>
    </svg>
    `;

    await sharp(bgBuffer)
        .composite([
            { input: Buffer.from(slide2Svg), top: 0, left: 0 },
            { input: logoBuffer, top: 850, left: (width - logoWidth) / 2 }
        ])
        .toFile(path.join(OUTPUT_DIR, 'referral-how-es.png'));

    console.log('✓ Created referral-how-es.png');

    // Slide 3: Solo el referente gana - English
    const slide3Svg = `
    <svg width="${width}" height="${height}">
        <style>
            .title { fill: #00d2ff; font-size: 100px; font-family: 'Courier New', monospace; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
            .question { fill: #ffd700; font-size: 70px; font-family: 'Courier New', monospace; font-weight: 700; }
            .answer { fill: #e0e0e0; font-size: 55px; font-family: 'Courier New', monospace; font-weight: 400; }
        </style>
        <text x="50%" y="20%" text-anchor="middle" class="title">WHO GETS MEMOs?</text>
        <text x="50%" y="42%" text-anchor="middle" class="question">$ The Referrer</text>
        <text x="50%" y="68%" text-anchor="middle" class="answer">(The friend who got invited gets 0)</text>
    </svg>
    `;

    await sharp(bgBuffer)
        .composite([
            { input: Buffer.from(slide3Svg), top: 0, left: 0 },
            { input: logoBuffer, top: 850, left: (width - logoWidth) / 2 }
        ])
        .toFile(path.join(OUTPUT_DIR, 'referral-rewards-en.png'));

    console.log('✓ Created referral-rewards-en.png');

    // Slide 4: Reclama en tu Panel - Spanish
    const slide4Svg = `
    <svg width="${width}" height="${height}">
        <style>
            .title { fill: #00d2ff; font-size: 110px; font-family: 'Courier New', monospace; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; }
            .subtitle { fill: #ffd700; font-size: 70px; font-family: 'Courier New', monospace; font-weight: 700; }
            .text { fill: #e0e0e0; font-size: 45px; font-family: 'Courier New', monospace; font-weight: 400; }
        </style>
        <text x="50%" y="25%" text-anchor="middle" class="title">RECLAMA AQUÍ</text>
        <text x="50%" y="45%" text-anchor="middle" class="subtitle">Dashboard → Invita Amigos</text>
        <text x="50%" y="70%" text-anchor="middle" class="text">Click "Reclamar 5 MEMO"</text>
    </svg>
    `;

    await sharp(bgBuffer)
        .composite([
            { input: Buffer.from(slide4Svg), top: 0, left: 0 },
            { input: logoBuffer, top: 850, left: (width - logoWidth) / 2 }
        ])
        .toFile(path.join(OUTPUT_DIR, 'referral-claim-es.png'));

    console.log('✓ Created referral-claim-es.png');

    // Slide 5: Free Forever - English
    const slide5Svg = `
    <svg width="${width}" height="${height}">
        <style>
            .title { fill: #00ff00; font-size: 140px; font-family: 'Courier New', monospace; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; }
            .subtitle { fill: #ffffff; font-size: 70px; font-family: 'Courier New', monospace; font-weight: 600; }
            .text { fill: #e0e0e0; font-size: 50px; font-family: 'Courier New', monospace; font-weight: 400; }
        </style>
        <text x="50%" y="30%" text-anchor="middle" class="title">FREE!</text>
        <text x="50%" y="55%" text-anchor="middle" class="subtitle">No Hidden Fees</text>
        <text x="50%" y="78%" text-anchor="middle" class="text">100% Transparent System</text>
    </svg>
    `;

    await sharp(bgBuffer)
        .composite([
            { input: Buffer.from(slide5Svg), top: 0, left: 0 },
            { input: logoBuffer, top: 850, left: (width - logoWidth) / 2 }
        ])
        .toFile(path.join(OUTPUT_DIR, 'referral-free-en.png'));

    console.log('✓ Created referral-free-en.png');

    console.log('\n✓ All referral slides generated successfully!');
}

generateReferralSlides().catch(err => {
    console.error('Error generating referral slides:', err);
    process.exit(1);
});
