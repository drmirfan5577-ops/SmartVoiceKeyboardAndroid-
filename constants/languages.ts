// Powered by OnSpace.AI
export interface VoiceLanguage {
  code: string;
  label: string;
  nativeLabel: string;
  emoji: string;
  rtl: boolean;
}

export const VOICE_LANGUAGES: VoiceLanguage[] = [
  { code: 'ur-PK', label: 'Urdu',    nativeLabel: 'اردو',        emoji: '🇵🇰', rtl: true  },
  { code: 'en-US', label: 'English', nativeLabel: 'English',     emoji: '🇺🇸', rtl: false },
  { code: 'ps-AF', label: 'Pashto',  nativeLabel: 'پښتو',        emoji: '🇦🇫', rtl: true  },
  { code: 'ar-SA', label: 'Arabic',  nativeLabel: 'العربية',     emoji: '🇸🇦', rtl: true  },
  { code: 'fa-IR', label: 'Persian', nativeLabel: 'فارسی',       emoji: '🇮🇷', rtl: true  },
  { code: 'tr-TR', label: 'Turkish', nativeLabel: 'Türkçe',      emoji: '🇹🇷', rtl: false },
  { code: 'ru-RU', label: 'Russian', nativeLabel: 'Русский',     emoji: '🇷🇺', rtl: false },
  { code: 'hi-IN', label: 'Hindi',   nativeLabel: 'हिंदी',       emoji: '🇮🇳', rtl: false },
  { code: 'zh-CN', label: 'Chinese', nativeLabel: '中文',         emoji: '🇨🇳', rtl: false },
  { code: 'bn-BD', label: 'Bengali', nativeLabel: 'বাংলা',       emoji: '🇧🇩', rtl: false },
  { code: 'bal',   label: 'Balochi', nativeLabel: 'بلوچی',       emoji: '🌟',  rtl: true  },
  { code: 'sd-PK', label: 'Sindhi',  nativeLabel: 'سنڌي',        emoji: '🌸',  rtl: true  },
];

export const DEFAULT_VOICE_LANG = 'ur-PK';
