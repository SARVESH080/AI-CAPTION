export type Platform = 'instagram' | 'linkedin' | 'twitter' | 'facebook';

export type Tone =
  | 'professional'
  | 'casual'
  | 'funny'
  | 'inspirational'
  | 'educational'
  | 'luxury'
  | 'minimal'
  | 'storytelling';

export type CaptionLength = 'short' | 'medium' | 'long';

export type MediaKind = 'image' | 'video';

export interface UploadedMedia {
  id: string;
  name: string;
  kind: MediaKind;
  mimeType: string;
  size: number;
  dataUrl: string;
  createdAt: number;
}

export interface MediaAnalysis {
  objects: string[];
  people: { count: number; description: string };
  emotions: string[];
  activities: string[];
  locationType: string;
  style: string;
  colors: { hex: string; name: string }[];
  mood: string;
  summary: string;
}

export interface CaptionScore {
  engagement: number;
  virality: number;
  readability: number;
  engagementReason: string;
  viralityReason: string;
  readabilityReason: string;
}

export interface GeneratedCaption {
  id: string;
  platform: Platform;
  tone: Tone;
  length: CaptionLength;
  hook: string;
  body: string;
  cta: string;
  emojis: boolean;
  fullText: string;
  scores: CaptionScore;
  favorite: boolean;
  createdAt: number;
}

export type HashtagCategory =
  | 'trending'
  | 'niche'
  | 'lowCompetition'
  | 'highReach';

export interface Hashtag {
  tag: string;
  category: HashtagCategory;
  reachEstimate: string;
}

export interface GenerationResult {
  id: string;
  media: UploadedMedia;
  analysis: MediaAnalysis;
  captions: GeneratedCaption[];
  hashtags: Hashtag[];
  tone: Tone;
  length: CaptionLength;
  createdAt: number;
}

export interface GenerationRequest {
  media: UploadedMedia;
  tone: Tone;
  length: CaptionLength;
  platforms: Platform[];
  useEmojis: boolean;
}

export const PLATFORM_META: Record<
  Platform,
  { label: string; shortLabel: string; color: string }
> = {
  instagram: { label: 'Instagram', shortLabel: 'IG', color: '#E1306C' },
  linkedin: { label: 'LinkedIn', shortLabel: 'LI', color: '#0A66C2' },
  twitter: { label: 'X (Twitter)', shortLabel: 'X', color: '#1d1d1d' },
  facebook: { label: 'Facebook', shortLabel: 'FB', color: '#1877F2' },
};

export const TONE_META: Record<Tone, { label: string; emoji: string; blurb: string }> = {
  professional: { label: 'Professional', emoji: '💼', blurb: 'Polished and credible' },
  casual: { label: 'Casual', emoji: '😎', blurb: 'Relaxed and friendly' },
  funny: { label: 'Funny', emoji: '😂', blurb: 'Playful and witty' },
  inspirational: { label: 'Inspirational', emoji: '✨', blurb: 'Uplifting and bold' },
  educational: { label: 'Educational', emoji: '📚', blurb: 'Insightful and clear' },
  luxury: { label: 'Luxury', emoji: '🥂', blurb: 'Refined and aspirational' },
  minimal: { label: 'Minimal', emoji: '⬜', blurb: 'Clean and concise' },
  storytelling: { label: 'Storytelling', emoji: '📖', blurb: 'Narrative and vivid' },
};

export const LENGTH_META: Record<
  CaptionLength,
  { label: string; wordRange: string }
> = {
  short: { label: 'Short', wordRange: '8–15 words' },
  medium: { label: 'Medium', wordRange: '20–40 words' },
  long: { label: 'Long', wordRange: '50–90 words' },
};

export const HASHTAG_CATEGORY_META: Record<
  HashtagCategory,
  { label: string; description: string }
> = {
  trending: {
    label: 'Trending',
    description: 'Hot right now, high volume and fast-moving.',
  },
  niche: {
    label: 'Niche',
    description: 'Specific to your subject and audience.',
  },
  lowCompetition: {
    label: 'Low Competition',
    description: 'Easier to rank for, steady discovery.',
  },
  highReach: {
    label: 'High Reach',
    description: 'Massive audiences, harder to break through.',
  },
};
