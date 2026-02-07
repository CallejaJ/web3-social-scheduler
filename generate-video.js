const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Paths
const IMAGES_DIR = path.join(__dirname, 'images');
const GENERATED_DIR = path.join(__dirname, 'images', 'generated');
const AUDIO_PATH = path.join(__dirname, 'music', 'serernc.mp3');
const OUTPUT_PATH = path.join(__dirname, 'promo-video.mp4');
const INTRO_PATH = path.join(GENERATED_DIR, 'intro-sabias-que.png');
const OUTRO_SLIDE_PATH = path.join(GENERATED_DIR, 'outro-url.png');

// Settings
const SLIDE_DURATION = 6; // seconds (Requested: 6s)
const INTRO_DURATION = 4; // seconds
const OUTRO_DURATION = 5; // seconds for URL slide
const TRANSITION_DURATION = 0.5;
const TRANSITION_TYPE = 'pixelize'; 

async function main() {
  console.log('🎬 Starting video generation (v5)...');
  
  if (!fs.existsSync(INTRO_PATH) || !fs.existsSync(OUTRO_SLIDE_PATH)) {
      console.error('Intro or Outro slide not found! Run generation scripts first.');
      process.exit(1);
  }

  // 1. Gather Assets (Spanish only)
  const esSlides = fs.readdirSync(GENERATED_DIR)
    .filter(f => f.startsWith('curiosity-') && !f.includes('-en.png') && f.endsWith('.png'))
    .map(f => path.join(GENERATED_DIR, f));
  
  console.log(`Found ${esSlides.length} Spanish slides.`);

  // 2. Prepare Inputs
  // Sequence: Intro -> Slides -> OutroURL
  const imageInputs = [INTRO_PATH, ...esSlides, OUTRO_SLIDE_PATH];
  
  const complexFilter = [];
  
  // --- PREPARE STREAMS ---
  imageInputs.forEach((_, i) => {
    complexFilter.push(`[${i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p,fps=30[v${i}]`); 
  });

  // --- TRANSITIONS ---
  let lastOutput = '[v0]';
  let cumulativeOffset = INTRO_DURATION - TRANSITION_DURATION; 
  
  // Transitions between all inputs
  for (let i = 0; i < imageInputs.length - 1; i++) {
    const nextInput = `[v${i+1}]`;
    const transitionOutput = `[vt${i}]`;
    
    // Duration Logic is handled by the loop option on input
    // The previous item's duration determines when the NEXT transition starts (roughly).
    // Actually, cumulativeOffset tracks when the CURRENT transition happens.
    // Transition 0 (v0->v1) happens at INTRO_DURATION - TRANSITION_DURATION.
    // Transition 1 (v1->v2) happens at (INTRO + SLIDE_1) - TRANSITION - TRANSITION?
    // No, xfade mixes.
    // The "clean" duration of v1 is SLIDE_DURATION.
    // So next transition is at cumulativeOffset + SLIDE_DURATION - TRANSITION_DURATION?
    // Wait, simplier:
    // T0 time = INTRO - 0.5
    // T1 time = T0 + SLIDE - 0.5? No.
    // T1 time = T0 + SLIDE.
    // Because the "mix" duration is part of the slide's life.
    // If Slide 1 is 6s. It mixes in for 0.5s. It plays clean for 5s. It mixes out for 0.5s.
    // Total perceived time from full-in to full-out start.
    
    complexFilter.push(`${lastOutput}${nextInput}xfade=transition=${TRANSITION_TYPE}:duration=${TRANSITION_DURATION}:offset=${cumulativeOffset}${transitionOutput}`);
    
    lastOutput = transitionOutput;
    
    // Determine duration of the CURRENT item (i+1 refers to NEXT item, i refers to CURRENT item in inputs list, wait)
    // imageInputs[i] is being faded OUT.
    // If i=0 (Intro), we add SLIDE_DURATION? No.
    // We add the duration of the item that just finished playing fully?
    // We are fading INTO [v(i+1)].
    // So we advance the offset by the duration of [v(i+1)]? No.
    // We advance by the duration of the item we just faded FROM?
    // CumulativeOffset started at IntroDuration.
    // For next loop, we need to add the duration of the slide we just transitioned TO.
    
    // Map of durations
    let currentDuration = SLIDE_DURATION; // Default for slides
    if (i + 1 === imageInputs.length - 1) {
         // Next item is Outro Slide (last index)
         // But we are calculating offset for the transition *leaving* the current item.
         // If i=0, we are leaving Intro. Offset was IntroDuration.
         // Next transition will be leaving Slide 1.
         // So we add Slide 1's duration.
         currentDuration = SLIDE_DURATION;
    }
    
    cumulativeOffset += currentDuration - TRANSITION_DURATION;
  }
  
  // Calculate total duration for audio fade
  // We need to know when the Outro Slide *ends*.
  // Start of Outro = last cumulativeOffset (roughly).
  // Total = Start of Outro + OUTRO_DURATION.
  const totalDuration = cumulativeOffset + OUTRO_DURATION;
  const fadeDuration = 4;
  const fadeStartTime = totalDuration - fadeDuration;
  
  console.log(`Estimated Video Duration: ${totalDuration}s`);

  const ffmpegCmd = ffmpeg();
  
  // Add inputs with loop options
  
  // Intro
  ffmpegCmd.input(INTRO_PATH).inputOptions(['-loop 1', `-t ${INTRO_DURATION + 5}`]);
  
  // Slides
  esSlides.forEach(slide => {
      ffmpegCmd.input(slide).inputOptions(['-loop 1', `-t ${SLIDE_DURATION + 5}`]); 
  });
  
  // Outro Slide
  ffmpegCmd.input(OUTRO_SLIDE_PATH).inputOptions(['-loop 1', `-t ${OUTRO_DURATION + 5}`]);
  
  // Audio
  ffmpegCmd.input(AUDIO_PATH);

  // Apply audio fade out
  const audioInputIndex = imageInputs.length;
  const audioFilter = `[${audioInputIndex}:a]afade=t=out:st=${fadeStartTime}:d=${fadeDuration}[a_out]`;
  
  // Combine filters
  const finalFilter = [...complexFilter, audioFilter].join(';');

  ffmpegCmd
    .complexFilter(finalFilter)
    .outputOptions([
        '-map', lastOutput,
        '-map', '[a_out]',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
        `-t ${totalDuration}`
    ])
    .save(OUTPUT_PATH)
    .on('error', (err) => console.error('Error creating video:', err))
    .on('end', () => {
        console.log(`✅ Final Video Ready: ${OUTPUT_PATH}`);
    });
}

main();
