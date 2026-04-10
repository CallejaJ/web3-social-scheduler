const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Paths
const IMAGES_DIR = path.join(__dirname, 'images');
const GENERATED_DIR = path.join(__dirname, 'images', 'generated');
const AUDIO_PATH = path.join(__dirname, 'music', 'serernc.mp3');
const OUTPUT_PATH = path.join(__dirname, 'market-summary-video.mp4');

const INTRO_PATH = path.join(GENERATED_DIR, 'market-intro.png');
const OUTRO_PATH = path.join(GENERATED_DIR, 'market-outro.png');

// Settings - Faster for a text "reveal" feel
const SLIDE_DURATION = 2; // seconds per text reveal part
const INTRO_DURATION = 3; // seconds
const OUTRO_DURATION = 5; // seconds
const TRANSITION_DURATION = 0.5;
const TRANSITION_TYPE = 'fade'; // Softer transition for text reveal

async function main() {
    console.log('🎬 Starting market summary video generation...');
    
    if (!fs.existsSync(INTRO_PATH) || !fs.existsSync(OUTRO_PATH)) {
        console.error('Intro or Outro slide not found! Run generation scripts first.');
        process.exit(1);
    }

    // 1. Gather Reveal Slides
    const revealSlides = fs.readdirSync(GENERATED_DIR)
        .filter(f => f.startsWith('market-slide-') && f.endsWith('.png'))
        .sort() // Ensure they are in order: market-slide-1.png, market-slide-2.png, etc.
        .map(f => path.join(GENERATED_DIR, f));
    
    console.log(`Found ${revealSlides.length} text reveal slides.`);

    // 2. Prepare Inputs
    // Sequence: Intro -> Reveal Slides -> Outro
    const imageInputs = [INTRO_PATH, ...revealSlides, OUTRO_PATH];
    
    const complexFilter = [];
    
    // --- PREPARE STREAMS ---
    imageInputs.forEach((_, i) => {
        complexFilter.push(`[${i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p,fps=30[v${i}]`); 
    });

    // --- TRANSITIONS ---
    let lastOutput = '[v0]';
    let cumulativeOffset = INTRO_DURATION - TRANSITION_DURATION; 
    
    for (let i = 0; i < imageInputs.length - 1; i++) {
        const nextInput = `[v${i+1}]`;
        const transitionOutput = `[vt${i}]`;
        
        complexFilter.push(`${lastOutput}${nextInput}xfade=transition=${TRANSITION_TYPE}:duration=${TRANSITION_DURATION}:offset=${cumulativeOffset}${transitionOutput}`);
        
        lastOutput = transitionOutput;
        
        // Determine duration to add to offset
        let currentDuration = SLIDE_DURATION; 
        if (i + 1 === imageInputs.length - 1) { // Next is Outro
            currentDuration = OUTRO_DURATION;
        } else if (i === 0) { // We just processed Intro -> Slide 1. Next is Slide 1 -> Slide 2
            currentDuration = SLIDE_DURATION;
        }
        
        // Actually, the amount we advance the offset is the duration of the item we just faded TO, 
        // to setup the fade OUT of it.
        // Above logic: currentDuration is the duration of the slide we just entered (imageInputs[i+1]).
        
        // Let's refine based on the exact index we just transitioned TO (i+1)
        let durationOfItemWeJustEntered = SLIDE_DURATION;
        if (i + 1 === imageInputs.length - 1) {
             // We just entered Outro, but there's no transition out of outro, so this value won't be used in the next loop iteration anyway.
             durationOfItemWeJustEntered = OUTRO_DURATION;
        }
        
        cumulativeOffset += durationOfItemWeJustEntered - TRANSITION_DURATION;
    }
    
    // Calculate total duration for audio fade
    const totalDuration = cumulativeOffset + TRANSITION_DURATION; // The last offset is roughly where Outro starts fading OUT. Since we don't fade out of Outro, we just need the time Outro *ends*. 
    // Actually cumulativeOffset was calculated *as if* we were going to transition out of the Outro.
    // Let's recalculate total exactly.
    // Total = (Sum of all pure durations) - (Transitions * Number of transitions)
    let totalPureDuration = INTRO_DURATION + (revealSlides.length * SLIDE_DURATION) + OUTRO_DURATION;
    let actualTotalDuration = totalPureDuration - (TRANSITION_DURATION * (imageInputs.length - 1));
    
    const fadeDuration = 4;
    const fadeStartTime = actualTotalDuration - fadeDuration;
    
    console.log(`Estimated Video Duration: ${actualTotalDuration}s`);

    const ffmpegCmd = ffmpeg();
    
    // Intro
    ffmpegCmd.input(INTRO_PATH).inputOptions(['-loop 1', `-t ${INTRO_DURATION + 5}`]);
    
    // Slides
    revealSlides.forEach(slide => {
        ffmpegCmd.input(slide).inputOptions(['-loop 1', `-t ${SLIDE_DURATION + 5}`]); 
    });
    
    // Outro
    ffmpegCmd.input(OUTRO_PATH).inputOptions(['-loop 1', `-t ${OUTRO_DURATION + 5}`]);
    
    // Audio
    ffmpegCmd.input(AUDIO_PATH);

    const audioInputIndex = imageInputs.length;
    const audioFilter = `[${audioInputIndex}:a]afade=t=out:st=${fadeStartTime}:d=${fadeDuration}[a_out]`;
    
    const finalFilter = [...complexFilter, audioFilter].join(';');

    ffmpegCmd
        .complexFilter(finalFilter)
        .outputOptions([
            '-map', lastOutput,
            '-map', '[a_out]',
            '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
            `-t ${actualTotalDuration}`
        ])
        .save(OUTPUT_PATH)
        .on('error', (err) => console.error('Error creating video:', err))
        .on('end', () => {
            console.log(`✅ Final Video Ready: ${OUTPUT_PATH}`);
        });
}

main();
