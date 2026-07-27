import type {
  CaptionLength,
  GeneratedCaption,
  Hashtag,
  HashtagCategory,
  MediaAnalysis,
  Platform,
  Tone,
  UploadedMedia,
} from '../types';

/**
 * Mock AI service.
 *
 * Every export mirrors the shape a real provider (OpenAI, Gemini, Claude)
 * would return, so swapping this out later only touches this file.
 *
 * To replace with a real API:
 *   1. Implement `analyzeMedia` to call a multimodal model with the image/video.
 *   2. Implement `generateCaptions` and `generateHashtags` using the analysis.
 *   3. Keep the return types identical — the UI never needs to change.
 */

const PAUSE = (ms: number) => new Promise((r) => setTimeout(r, ms));

function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function pick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/* Analysis                                                                    */
/* -------------------------------------------------------------------------- */

const OBJECT_BANK = [
  'Coffee cup',
  'Laptop',
  'Sunglasses',
  'Backpack',
  'Headphones',
  'Plant',
  'Book',
  'Camera',
  'Skateboard',
  'Watch',
  'Bicycle',
  'Vinyl record',
  'Sneakers',
  'Notebook',
  'Water bottle',
];

const EMOTION_BANK = [
  'Joyful',
  'Calm',
  'Energetic',
  'Confident',
  'Nostalgic',
  'Focused',
  'Serene',
  'Excited',
  'Cozy',
  'Adventurous',
];

const ACTIVITY_BANK = [
  'Working remotely',
  'Morning walk',
  'Café hangout',
  'Workout session',
  'City exploring',
  'Reading',
  'Content creation',
  'Beach day',
  'Studio shoot',
  'Sunset watching',
];

const LOCATION_BANK: Record<string, string[]> = {
  indoor: ['Office', 'Café', 'Studio', 'Gym', 'Living room', 'Restaurant'],
  outdoor: ['Beach', 'Rooftop', 'Park', 'City street', 'Mountains', 'Rooftop terrace'],
};

const STYLE_BANK = [
  'Cinematic',
  'Minimalist',
  'Vintage film',
  'Bright and airy',
  'Moody and dramatic',
  'Golden hour',
  'Documentary',
  'Editorial',
];

const COLOR_BANK: { hex: string; name: string }[] = [
  { hex: '#1a1a1a', name: 'Onyx' },
  { hex: '#f5f1e8', name: 'Cream' },
  { hex: '#c2410c', name: 'Terracotta' },
  { hex: '#0e7490', name: 'Teal' },
  { hex: '#7c3aed', name: 'Iris' },
  { hex: '#e11d48', name: 'Crimson' },
  { hex: '#16a34a', name: 'Forest' },
  { hex: '#eab308', name: 'Amber' },
  { hex: '#0ea5e9', name: 'Sky' },
  { hex: '#f3f4f6', name: 'Pearl' },
];

const MOOD_BANK = [
  'Warm and inviting',
  'Fresh and energetic',
  'Calm and reflective',
  'Bold and confident',
  'Dreamy and nostalgic',
  'Crisp and focused',
];

export async function analyzeMedia(
  media: UploadedMedia,
): Promise<MediaAnalysis> {
  await PAUSE(900 + Math.random() * 600);

  const objects = pick(OBJECT_BANK, 4 + Math.floor(Math.random() * 3));
  const emotions = pick(EMOTION_BANK, 3);
  const activities = pick(ACTIVITY_BANK, 2);
  const locationType = pick([...LOCATION_BANK.indoor, ...LOCATION_BANK.outdoor], 1)[0];
  const colors = pick(COLOR_BANK, 4);
  const mood = pick(MOOD_BANK, 1)[0];
  const style = pick(STYLE_BANK, 1)[0];
  const personCount = Math.floor(Math.random() * 3);

  const summary = `A ${mood.toLowerCase()} ${media.kind} featuring ${objects
    .slice(0, 2)
    .join(' and ')
    .toLowerCase()}, set in a ${locationType.toLowerCase()} scene. The ${style.toLowerCase()} styling and ${colors[0].name.toLowerCase()} tones create a ${emotions[0].toLowerCase()} mood, while ${
    personCount === 0
      ? 'no people are visible, focusing on the scene'
      : `${personCount} ${personCount === 1 ? 'person is' : 'people are'} present, ${activities[0].toLowerCase()}`
  }.`;

  return {
    objects,
    people: {
      count: personCount,
      description:
        personCount === 0
          ? 'No people in frame — composition-led.'
          : `${personCount} ${personCount === 1 ? 'person' : 'people'}, candid and natural.`,
    },
    emotions,
    activities,
    locationType,
    style,
    colors,
    mood,
    summary,
  };
}

/* -------------------------------------------------------------------------- */
/* Caption generation                                                          */
/* -------------------------------------------------------------------------- */

const HOOKS: Record<Tone, string[]> = {
  professional: [
    'Here is what most people miss about',
    'A quick look at',
    'Three lessons from',
    'What changed when I focused on',
  ],
  casual: [
    'Okay but can we talk about',
    'Just had to share',
    'POV: you stumble into',
    'Not me getting way too excited about',
  ],
  funny: [
    'My therapist said I should stop posting about',
    'Plot twist: it was actually',
    'Nobody:  Absolutely nobody:  Me:',
    'Tell me you love this without telling me',
  ],
  inspirational: [
    'Some moments remind you why you started',
    'This is your sign to go after',
    'The view is always worth the climb to',
    'Never underestimate the power of',
  ],
  educational: [
    'Here is how to get the most out of',
    'Let me break down what makes this work:',
    'A 30-second guide to',
    'Most people get this wrong about',
  ],
  luxury: [
    'Crafted for those who appreciate',
    'An ode to timeless',
    'Where refinement meets',
    'The quiet luxury of',
  ],
  minimal: [
    'Simple. Intentional.',
    'Less, but better —',
    'Just this.',
    'Nothing extra. Just',
  ],
  storytelling: [
    'It started with a coffee and ended here.',
    'I almost did not bring the camera that day.',
    'They told me this would never work.',
    'The third try was the one that held.',
  ],
};

const BODY_TEMPLATES: Record<Tone, string[]> = {
  professional: [
    'capturing {activity} with intent. The {style.toLowerCase()} framing and {color} palette signal focus and craft.',
    'a clear example of {mood.toLowerCase()} storytelling done right — every element earns its place.',
    'shows how {location.toLowerCase()} settings elevate a brand without shouting.',
  ],
  casual: [
    'caught {activity} and honestly the vibes are unreal. That {color} light just hits different.',
    'this is your daily reminder that {mood.toLowerCase()} days exist and they are glorious.',
    'no agenda, just {activity} and good energy all around.',
  ],
  funny: [
    'I was supposed to be doing {activity} but the {color} lighting had other plans.',
    'tag the friend who would absolutely ruin {location.toLowerCase()} vibes like this.',
    'my search history is just {objects} and questions I am not ready to answer.',
  ],
  inspirational: [
    'every frame here is proof that showing up for {activity} compounds into something bigger.',
    'the {mood.toLowerCase()} energy in this moment is exactly what you carry forward.',
    'consistency turned {location.toLowerCase()} into a canvas — your turn.',
  ],
  educational: [
    '{style} framing draws the eye to {objects}, a classic lead-the-viewer technique.',
    'the {color} tones create contrast with the background, a quick way to add depth.',
    'notice how negative space around {objects} keeps the subject readable.',
  ],
  luxury: [
    'a study in restraint — {color} tones, considered light, and {mood.toLowerCase()} composure.',
    'every detail, from {objects} to the {location.toLowerCase()} backdrop, is intentional.',
    'where {style.toLowerCase()} meets stillness, this is {mood.toLowerCase()} in its purest form.',
  ],
  minimal: [
    '{objects}, light, and space. Nothing more.',
    'a {mood.toLowerCase()} frame, stripped to its essentials.',
    'the {color} tone does the talking.',
  ],
  storytelling: [
    'the {color} tones were not planned — they came from waiting an extra hour for the light to soften over {location.toLowerCase()}.',
    'by the third take, {activity} had stopped feeling staged and started feeling like memory.',
    'I kept the {objects} in frame because they were part of the story, not the set.',
  ],
};

const CTAS: Record<Tone, string[]> = {
  professional: [
    'What would you add?',
    'Save this for your next post.',
    'Share your take below.',
  ],
  casual: [
    'Drop a 🔥 if you needed this today.',
    'Tag someone who needs to see this.',
    'Comment your favorite part!',
  ],
  funny: [
    'Send this to your group chat. You know the one.',
    'Rate this chaos 1–10.',
    'Confess in the replies.',
  ],
  inspirational: [
    'Your move.',
    'Go make today worth photographing.',
    'Save this. Come back when you start.',
  ],
  educational: [
    'Follow for more breakdowns like this.',
    'Bookmark this for your next shoot.',
    'Which tip will you try first?',
  ],
  luxury: [
    'Discover more in our journal.',
    'Experience it for yourself.',
    'Reserve your moment.',
  ],
  minimal: [
    'More, soon.',
    'Stay close.',
    'That is all.',
  ],
  storytelling: [
    'Read the full story in captions.',
    'What chapter are you on?',
    'Tell me how yours ends.',
  ],
};

const EMOJI_POOL: Record<Tone, string[]> = {
  professional: ['📈', '🤝', '🧠', '💡', '✅'],
  casual: ['😎', '🙌', '☕', '✨', '🔥'],
  funny: ['😂', '🤡', '🙃', '💀', '👀'],
  inspirational: ['✨', '🚀', '🌱', '⭐', '💛'],
  educational: ['📚', '🔍', '📝', '🧪', '🎓'],
  luxury: ['🥂', '💎', '🕊️', '🕯️', '🎩'],
  minimal: ['⬜', '◻️', '➖', '◯', '·'],
  storytelling: ['📖', '🎬', '🎞️', '🖋️', '🌙'],
};

function fill(
  template: string,
  analysis: MediaAnalysis,
): string {
  return template
    .replace('{activity}', analysis.activities[0].toLowerCase())
    .replace('{mood}', analysis.mood)
    .replace('{color}', analysis.colors[0].name.toLowerCase())
    .replace('{location}', analysis.locationType)
    .replace('{style}', analysis.style)
    .replace('{objects}', analysis.objects.slice(0, 2).join(' and ').toLowerCase());
}

function lengthAdjust(text: string, length: CaptionLength, tone: Tone, analysis: MediaAnalysis): string {
  if (length === 'short') {
    const firstSentence = text.split('. ')[0];
    return firstSentence.endsWith('.') ? firstSentence : `${firstSentence}.`;
  }
  if (length === 'long') {
    const extra =
      tone === 'storytelling' || tone === 'educational'
        ? ` The ${analysis.colors[0].name.toLowerCase()} tones pulled everything together, and that is the part most people skip.`
        : ` There is a quiet confidence in frames like this — the kind that does not need a caption to land, even though here we are.`;
    return `${text}${extra}`;
  }
  return text;
}

function scoreFor(text: string, platform: Platform, tone: Tone): {
  engagement: number;
  virality: number;
  readability: number;
  engagementReason: string;
  viralityReason: string;
  readabilityReason: string;
} {
  const words = text.split(/\s+/).filter(Boolean).length;
  const hasQuestion = /\?/.test(text);
  const hasEmoji = /[\p{Emoji}]/u.test(text);

  const engagement = Math.min(
    98,
    60 +
      (hasQuestion ? 14 : 4) +
      (hasEmoji ? 8 : 2) +
      Math.floor(Math.random() * 12),
  );
  const virality = Math.min(
    95,
    45 +
      (tone === 'funny' || tone === 'inspirational' ? 18 : 8) +
      (platform === 'twitter' ? 12 : platform === 'instagram' ? 10 : 5) +
      Math.floor(Math.random() * 15),
  );
  const readability = Math.max(
    62,
    Math.min(
      99,
      95 - Math.floor(words / 12) + Math.floor(Math.random() * 4),
    ),
  );

  return {
    engagement,
    virality,
    readability,
    engagementReason: hasQuestion
      ? 'Opens or closes with a question, which lifts replies and saves.'
      : hasEmoji
        ? 'Emoji adds visual rhythm that boosts dwell time and reactions.'
        : 'Confident declarative tone tends to drive saves and shares.',
    viralityReason:
      tone === 'funny'
        ? 'Humor-driven hooks travel well on feeds and get quote-shared.'
        : tone === 'inspirational'
          ? 'Aspirational lines are saved and reposted at higher rates.'
          : platform === 'twitter'
            ? 'X rewards punchy, quotable lines with retweet velocity.'
            : 'Strong hook with a clear payoff — shareable but not algorithmic bait.',
    readabilityReason:
      words < 25
        ? 'Very short, instantly scannable on mobile.'
        : words < 60
          ? 'Medium length with clean sentence breaks — easy to follow.'
          : 'Longer form; slightly more demanding but still well-paced.',
  };
}

export async function generateCaptions(
  media: UploadedMedia,
  analysis: MediaAnalysis,
  platform: Platform,
  tone: Tone,
  length: CaptionLength,
  useEmojis: boolean,
): Promise<GeneratedCaption[]> {
  await PAUSE(700 + Math.random() * 600);

  const captions: GeneratedCaption[] = [];
  for (let i = 0; i < 5; i++) {
    const hook = HOOKS[tone][i % HOOKS[tone].length];
    const bodyRaw = fill(BODY_TEMPLATES[tone][i % BODY_TEMPLATES[tone].length], analysis);
    const body = lengthAdjust(bodyRaw, length, tone, analysis);
    const cta = CTAS[tone][i % CTAS[tone].length];
    const emojis = useEmojis
      ? ` ${pick(EMOJI_POOL[tone], 2).join('')}`
      : '';

    const fullText = `${hook} ${body}${emojis}\n\n${cta}`.replace(/\s+/g, ' ').trim();

    const scores = scoreFor(fullText, platform, tone);

    captions.push({
      id: uid('cap'),
      platform,
      tone,
      length,
      hook,
      body,
      cta,
      emojis: useEmojis,
      fullText,
      scores,
      favorite: false,
      createdAt: Date.now() + i,
    });
  }
  return captions;
}

/* -------------------------------------------------------------------------- */
/* Hashtags                                                                    */
/* -------------------------------------------------------------------------- */

export async function generateHashtags(
  analysis: MediaAnalysis,
): Promise<Hashtag[]> {
  await PAUSE(500 + Math.random() * 400);

  const baseTags = [
    ...analysis.objects.map((o) => o.toLowerCase().replace(/\s+/g, '')),
    ...analysis.activities.map((a) => a.toLowerCase().replace(/\s+/g, '')),
    analysis.locationType.toLowerCase().replace(/\s+/g, ''),
    analysis.mood.toLowerCase().split(' ')[0],
    analysis.style.toLowerCase().split(' ')[0],
  ];

  const trending = ['reels', 'viral', 'trending', 'explore', 'fyp', 'creator'];
  const niche = [...baseTags, 'contentcreator', 'visualstorytelling', 'aesthetic'];
  const lowCompetition = niche.map((t) => `${t}daily`);
  const highReach = ['photography', 'lifestyle', 'instagood', 'photooftheday', 'love', 'instadaily'];

  const build = (tags: string[], category: HashtagCategory, reach: string): Hashtag[] =>
    tags.map((t) => ({ tag: `#${t.replace(/[^a-z0-9]/g, '')}`, category, reachEstimate: reach }));

  return [
    ...build(pick(trending, 5), 'trending', '1M–10M posts'),
    ...build(pick(niche, 5), 'niche', '50K–500K posts'),
    ...build(pick(lowCompetition, 5), 'lowCompetition', '<25K posts'),
    ...build(pick(highReach, 5), 'highReach', '10M+ posts'),
  ];
}

/* -------------------------------------------------------------------------- */
/* Orchestrator                                                                */
/* -------------------------------------------------------------------------- */

export async function runGeneration(
  media: UploadedMedia,
  tone: Tone,
  length: CaptionLength,
  platforms: Platform[],
  useEmojis: boolean,
): Promise<{
  analysis: MediaAnalysis;
  captions: GeneratedCaption[];
  hashtags: Hashtag[];
}> {
  const analysis = await analyzeMedia(media);
  const captionBatches = await Promise.all(
    platforms.map((p) => generateCaptions(media, analysis, p, tone, length, useEmojis)),
  );
  const hashtags = await generateHashtags(analysis);
  return {
    analysis,
    captions: captionBatches.flat(),
    hashtags,
  };
}
