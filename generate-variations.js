const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration for images to generate
const CONFIG = [
    // EN
    { file: 'web3-basics-en.png', title: 'Web3 Basics', subtitle: 'Blockchain Fundamentals', lang: 'en' },
    { file: 'crypto-101-en.png', title: 'Crypto 101', subtitle: 'Understanding Cryptocurrency', lang: 'en' },
    { file: 'community-announcements-en.png', title: 'Community', subtitle: 'Latest Announcements', lang: 'en' },
    { file: 'community-discussion-en.png', title: 'Join the Discussion', subtitle: 'GitHub Community', lang: 'en' },
    { file: 'cbdc-en.png', title: 'CBDCs Explained', subtitle: 'Central Bank Digital Currencies', lang: 'en' },
    { file: 'weekend-learning-en.png', title: 'Weekend Learning', subtitle: 'Expand Your Knowledge', lang: 'en' },
    { file: 'centralized-vs-decentralized.png', title: 'Centralized vs Decentralized', subtitle: 'Power & Control', lang: 'en' },
    { file: 'web-evolution.png', title: 'Web Evolution', subtitle: 'Web1 -> Web2 -> Web3', lang: 'en' },
    { file: 'chart-types.png', title: 'Crypto Charts', subtitle: 'Technical Analysis Basics', lang: 'en' },
    { file: 'lending-lifecycle.png', title: 'DeFi Lending', subtitle: 'How Assets Work for You', lang: 'en' },
    { file: 'security_layers.png', title: 'Security Layers', subtitle: 'Protecting your Assets', lang: 'en' },
    { file: 'crypto-quiz-og-en.png', title: 'Crypto Quiz', subtitle: 'Test Your Skills', lang: 'en' },
    { file: 'crypto-quiz-og-en-1.png', title: 'Web3 Challenge', subtitle: 'Prove Your Mastery', lang: 'en' },

    // ES
    { file: 'telegram-community-es.png', title: 'Comunidad Web3', subtitle: 'Asistente 24/7 en Telegram', lang: 'es' },
    { file: 'web3-basics-es.png', title: 'Web3 Básico', subtitle: 'Fundamentos Blockchain', lang: 'es' },
    { file: 'crypto-101-es.png', title: 'Cripto 101', subtitle: 'Entendiendo las Criptomonedas', lang: 'es' },
    { file: 'community-rules-es.png', title: 'Reglas de Comunidad', subtitle: 'Convivencia y Respeto', lang: 'es' },
    { file: 'security-es.png', title: 'Seguridad Cripto', subtitle: 'Protege tus Activos', lang: 'es' },
    { file: 'community-discussion-es.png', title: 'Únete al Debate', subtitle: 'Comunidad en GitHub', lang: 'es' },
    { file: 'centralized-vs-decentralized-es.png', title: 'Centralizado vs Descentralizado', subtitle: 'Poder y Control', lang: 'es' },
    { file: 'web-evolution-es.png', title: 'Evolución Web', subtitle: 'Web1 -> Web2 -> Web3', lang: 'es' },
    { file: 'chart-types-es.png', title: 'Gráficos Cripto', subtitle: 'Análisis Técnico Básico', lang: 'es' },
    { file: 'lending-lifecycle-es.png', title: 'Ciclo DeFi', subtitle: 'Préstamos y Rendimiento', lang: 'es' },
    { file: 'security_layers_es.png', title: 'Capas de Seguridad', subtitle: 'Protección Blockchain', lang: 'es' },
    { file: 'crypto-quiz-og-es.png', title: 'Quiz Cripto', subtitle: 'Pon a Prueba tu Conocimiento', lang: 'es' },
    { file: 'crypto-quiz-og-es-1.png', title: 'Desafío Web3', subtitle: 'Demuestra lo que Sabes', lang: 'es' },
    { file: 'portfolio-es.png', title: 'Portfolio', subtitle: 'Gestión de Activos', lang: 'es' },
    { file: 'smart-contracts-es.png', title: 'Smart Contracts', subtitle: 'Código es Ley', lang: 'es' },
    { file: 'smart-contracts-en.png', title: 'Smart Contracts', subtitle: 'Code is Law', lang: 'en' },
    { file: 'nft-es.png', title: 'NFTs', subtitle: 'Propiedad Digital', lang: 'es' },
    { file: 'nft-en.png', title: 'NFTs', subtitle: 'Digital Ownership', lang: 'en' },
    { file: 'defi-es.png', title: 'DeFi', subtitle: 'Finanzas Descentralizadas', lang: 'es' },
    { file: 'defi-en.png', title: 'DeFi', subtitle: 'Decentralized Finance', lang: 'en' },
    { file: 'blockchain-dev-es.png', title: 'Blockchain Dev', subtitle: 'Desarrollo Web3', lang: 'es' },
    { file: 'blockchain-dev-en.png', title: 'Blockchain Dev', subtitle: 'Web3 Development', lang: 'en' },
    { file: 'ta-es.png', title: 'Análisis Técnico', subtitle: 'Lectura de Mercados', lang: 'es' },
    { file: 'ta-en.png', title: 'Technical Analysis', subtitle: 'Reading the Markets', lang: 'en' }
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
    const subtitleFontSize = 45;
    
    // Wrap title if it's too long
    const maxChars = 20; 
    const titleLines = wrapText(config.title, maxChars);
    
    // Construct tspan lines
    const titleSvgLines = titleLines.map((line, i) => {
        const dy = i === 0 ? 0 : '1.1em'; 
        return `<tspan x="50%" dy="${dy}">${escapeXml(line)}</tspan>`;
    }).join('');

    // Adjust main text Y position based on number of lines to keep it centered
    const startY = titleLines.length > 1 ? '35%' : '42%';
    
    const safeSubtitle = escapeXml(config.subtitle);
    
    let subtitleYPercent = 55;
    if (titleLines.length > 1) {
        subtitleYPercent += (titleLines.length - 1) * 12;
    }
    
    const svgText = `
    <svg width="${width}" height="${height}">
        <style>
            .title { fill: white; font-size: ${titleFontSize}px; font-family: Arial, sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
            .subtitle { fill: #00d2ff; font-size: ${subtitleFontSize}px; font-family: Arial, sans-serif; font-weight: 500; letter-spacing: 1px; }
        </style>
        <text x="50%" y="${startY}" text-anchor="middle" class="title">${titleSvgLines}</text>
        <text x="50%" y="${subtitleYPercent}%" text-anchor="middle" class="subtitle">${safeSubtitle}</text>
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
