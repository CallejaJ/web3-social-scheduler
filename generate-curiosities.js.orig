const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration for images to generate
const CONFIG = [
  {
    file: 'curiosity-bitcoin-pizza.png',
    title: 'Sabías que...?',
    subtitle: 'La primera compra con Bitcoin fueron dos pizzas por 10,000 BTC. Hoy valdrían cientos de millones.',
    lang: 'es'
  },
  {
    file: 'curiosity-smart-contract.png',
    title: 'Sabías que...?',
    subtitle: 'El término "Smart Contract" fue acuñado por Nick Szabo en 1994, mucho antes de que existiera la tecnología blockchain.',
    lang: 'es'
  },
  {
    file: 'curiosity-lost-bitcoin.png',
    title: 'Sabías que...?',
    subtitle: 'Se estima que alrededor del 20% de todos los Bitcoin minados se han perdido para siempre en billeteras inaccesibles.',
    lang: 'es'
  },
  {
    file: 'curiosity-nfts-history.png',
    title: 'Sabías que...?',
    subtitle: 'Los primeros NFTs no estaban en Ethereum. Los "Colored Coins" en Bitcoin ya permitían activos únicos en 2012.',
    lang: 'es'
  },
  {
    file: 'curiosity-vitalik-wow.png',
    title: 'Sabías que...?',
    subtitle: 'Vitalik Buterin creó Ethereum después de que Blizzard debilitara su personaje en WoW.',
    lang: 'es'
  },
  // English
  {
    file: 'curiosity-bitcoin-pizza-en.png',
    title: 'Did you know...?',
    subtitle: 'The first Bitcoin purchase was two pizzas for 10,000 BTC. Today they\'d be worth millions.',
    lang: 'en'
  },
  {
    file: 'curiosity-smart-contract-en.png',
    title: 'Did you know...?',
    subtitle: 'The term "Smart Contract" was coined by Nick Szabo in 1994, long before blockchain existed.',
    lang: 'en'
  },
  {
    file: 'curiosity-lost-bitcoin-en.png',
    title: 'Did you know...?',
    subtitle: 'It\'s estimated that around 20% of all mined Bitcoin is lost forever in inaccessible wallets.',
    lang: 'en'
  },
  {
    file: 'curiosity-nfts-history-en.png',
    title: 'Did you know...?',
    subtitle: 'The first NFTs weren\'t on Ethereum. "Colored Coins" on Bitcoin already allowed unique assets in 2012.',
    lang: 'en'
  },
  {
    file: 'curiosity-vitalik-wow-en.png',
    title: 'Did you know...?',
    subtitle: 'Vitalik Buterin co-founded Ethereum after Blizzard nerfed his favorite character in World of Warcraft.',
    lang: 'en'
  }
];

// Paths
const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_DIR = path.join(__dirname, 'images', 'generated');

// Assets
const BG_LIGHT = path.join(IMAGES_DIR, 'quiz-bg.png'); // Blueish/Light
const BG_DARK = path.join(IMAGES_DIR, 'quiz-bg-dark.png'); // Dark
const LOGO = path.join(IMAGES_DIR, 'memento_academy_logo_text.png');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// XML Escape function
function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

// Helper to wrap text into lines based on approximate character count
function wrapText(text, maxCharsPerLine) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        if (currentLine.length + 1 + words[i].length <= maxCharsPerLine) {
            currentLine += ' ' + words[i];
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);
    return lines;
}

async function generateImage(config) {
    console.log(`Generating ${config.file}...`);
    
    // Choose background
    const bgPath = config.lang === 'es' ? BG_DARK : BG_LIGHT; 

    const width = 1200;
    const height = 630; 

    // Text settings
    const titleFontSize = 90;
    const subtitleFontSize = 38; // Reduced from 45
    const lineHeight = 1.2;
    
    // Wrap title if it's too long
    const maxCharsTitle = 20; 
    const titleLines = wrapText(config.title, maxCharsTitle);
    
    // Wrap subtitle
    const maxCharsSubtitle = 40; // Increased char limit per line
    const subtitleLines = wrapText(config.subtitle, maxCharsSubtitle);
    
    // Construct title tspan lines
    const titleSvgLines = titleLines.map((line, i) => {
        const dy = i === 0 ? 0 : '1.1em'; 
        return `<tspan x="50%" dy="${dy}">${escapeXml(line)}</tspan>`;
    }).join('');

    // Construct subtitle tspan lines
    const subtitleSvgLines = subtitleLines.map((line, i) => {
        const dy = i === 0 ? 0 : '1.2em';
        return `<tspan x="50%" dy="${dy}">${escapeXml(line)}</tspan>`;
    }).join('');

    // Adjust vertical positioning
    // Start Title slightly higher
    const startY = '35%';
    
    // Subtitle starts below title
    // Calculate rough height of title block
    const titleBlockHeightPercent = 15 + (titleLines.length - 1) * 10;
    const subtitleStartYPercent = 45 + (titleLines.length - 1) * 5; 
    
    const svgText = `
    <svg width="${width}" height="${height}">
        <style>
            .title { fill: white; font-size: ${titleFontSize}px; font-family: Arial, sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
            .subtitle { fill: #00d2ff; font-size: ${subtitleFontSize}px; font-family: Arial, sans-serif; font-weight: 500; letter-spacing: 1px; }
        </style>
        <text x="50%" y="${startY}" text-anchor="middle" class="title">${titleSvgLines}</text>
        <text x="50%" y="${subtitleStartYPercent}%" text-anchor="middle" class="subtitle">${subtitleSvgLines}</text>
    </svg>
    `;
    
    // Debug SVG
    // console.log(svgText);

    try {
        // Resize logo
        const logoWidth = 150; 
        const logoBuffer = await sharp(LOGO).resize(logoWidth).toBuffer();
        
        const logoMeta = await sharp(logoBuffer).metadata();
        const logoHeight = logoMeta.height;

        const padding = 60;
        const logoLeft = width - logoWidth - padding;
        const logoTop = height - logoHeight - padding;

        await sharp(bgPath)
            .resize(width, height)
            .composite([
                {
                    input: Buffer.from(svgText),
                    top: 0,
                    left: 0,
                },
                {
                    input: logoBuffer,
                    top: logoTop,
                    left: logoLeft,
                }
            ])
            .toFile(path.join(OUTPUT_DIR, config.file));
            
        console.log(`✓ Created ${config.file}`);
    } catch (err) {
        console.error(`✗ Error creating ${config.file}:`, err.message);
    }
}

async function main() {
    console.log('Starting image generation...');
    for (const item of CONFIG) {
        await generateImage(item);
    }
    console.log('Generation complete!');
}

main();
