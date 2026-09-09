// Powered by OnSpace.AI
// ALL THEMES: BRIGHT, LUMINOUS, CRYSTAL-CLEAR — No dark backgrounds

export const Colors = {
  // Bright luminous base
  bg1: '#f0f4ff',
  bg2: '#e8f0ff',
  bg3: '#ffffff',
  surface: 'rgba(255,255,255,0.85)',
  surfaceStrong: 'rgba(255,255,255,0.95)',
  border: 'rgba(100,80,255,0.25)',
  borderStrong: 'rgba(100,80,255,0.5)',
  primary: '#6040ff',
  primaryGlow: '#8060ff',
  accent: '#3d00ff',
  accentGlow: '#7c5cfc',
  gold: '#e6a000',
  goldGlow: '#ffcc00',
  red: '#e0003c',
  redGlow: '#ff2255',
  green: '#009944',
  greenGlow: '#00cc66',
  text: '#1a0050',
  textMuted: 'rgba(40,0,120,0.65)',
  textDim: 'rgba(40,0,120,0.4)',

  // Key type colors — bright, glowing, crystal clear
  keyDefault: 'rgba(255,255,255,0.90)',
  keyDefaultBorder: 'rgba(100,80,255,0.40)',
  keyDefaultGlow: '#7c5cfc',

  keyNum: 'rgba(255,240,180,0.95)',
  keyNumBorder: 'rgba(220,160,0,0.60)',
  keyNumGlow: '#e6a000',
  keyNumText: '#7a4000',

  keySym: 'rgba(200,245,255,0.95)',
  keySymBorder: 'rgba(0,160,210,0.55)',
  keySymGlow: '#0090d0',
  keySymText: '#00406a',

  keyFn: 'rgba(230,225,255,0.95)',
  keyFnBorder: 'rgba(100,80,220,0.50)',
  keyFnGlow: '#6040cc',

  keyVoice: '#ff2244',
  keyVoiceBorder: '#ff0033',
  keyVoiceGlow: '#ff4466',

  keySpace: 'rgba(240,240,255,0.95)',
  keySpaceBorder: 'rgba(100,80,255,0.35)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Radius = {
  sm: 7,
  md: 11,
  lg: 16,
  pill: 100,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  key: 17,
  keyFn: 11,
  keyNum: 18,
};

// ALL THEMES — bright, luminous, milky, crystal clear backgrounds
export const THEMES = [
  {
    id: 'pearl',
    name: 'موتی',
    emoji: '🤍',
    bg1: '#f8f9ff',
    bg2: '#eef1ff',
    accent: '#4c35e8',
    glow: '#7c5cfc',
    dark: false,
  },
  {
    id: 'sunrise',
    name: 'طلوع آفتاب',
    emoji: '🌅',
    bg1: '#fff8f0',
    bg2: '#ffe8d0',
    accent: '#e05000',
    glow: '#ff8c00',
    dark: false,
  },
  {
    id: 'mint',
    name: 'پودینہ',
    emoji: '🌿',
    bg1: '#f0fff8',
    bg2: '#d8f8ec',
    accent: '#007a44',
    glow: '#00cc66',
    dark: false,
  },
  {
    id: 'sky',
    name: 'آسمان',
    emoji: '🌤️',
    bg1: '#f0f8ff',
    bg2: '#d8eeff',
    accent: '#0055cc',
    glow: '#4499ff',
    dark: false,
  },
  {
    id: 'blossom',
    name: 'پھول',
    emoji: '🌸',
    bg1: '#fff0f8',
    bg2: '#ffd8ee',
    accent: '#c0006a',
    glow: '#ff44aa',
    dark: false,
  },
  {
    id: 'golden',
    name: 'سنہرا',
    emoji: '✨',
    bg1: '#fffaf0',
    bg2: '#fff0c8',
    accent: '#b07000',
    glow: '#e6a000',
    dark: false,
  },
  {
    id: 'lavender',
    name: 'لیوینڈر',
    emoji: '💜',
    bg1: '#faf0ff',
    bg2: '#f0d8ff',
    accent: '#7700cc',
    glow: '#cc44ff',
    dark: false,
  },
  {
    id: 'arctic',
    name: 'قطبی',
    emoji: '❄️',
    bg1: '#f0fdff',
    bg2: '#d8f8ff',
    accent: '#006688',
    glow: '#00b8d4',
    dark: false,
  },
  {
    id: 'cream',
    name: 'کریم',
    emoji: '🍦',
    bg1: '#fffdf8',
    bg2: '#fdf5e0',
    accent: '#8a6000',
    glow: '#c8900a',
    dark: false,
  },
  {
    id: 'rose',
    name: 'گلاب',
    emoji: '🌹',
    bg1: '#fff5f5',
    bg2: '#ffe0e0',
    accent: '#cc0020',
    glow: '#ff3344',
    dark: false,
  },
];

export type ThemeId = typeof THEMES[number]['id'];

// Live background types
export type LiveBgType = 'bubbles' | 'sparkles' | 'waves' | 'stars' | 'none';
