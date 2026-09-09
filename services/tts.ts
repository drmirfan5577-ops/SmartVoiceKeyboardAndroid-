// Powered by OnSpace.AI
import * as Speech from 'expo-speech';

export interface TTSVoice {
  identifier: string;
  name: string;
  language: string;
  quality?: string;
}

export interface TTSOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  voice?: string;
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: Error) => void;
}

// Language code mapping (BCP-47 → expo-speech locale)
const LANG_MAP: Record<string, string> = {
  'ur-PK': 'ur-PK',
  'en-US': 'en-US',
  'en-GB': 'en-GB',
  'ar-SA': 'ar-SA',
  'hi-IN': 'hi-IN',
  'fa-IR': 'fa-IR',
  'tr-TR': 'tr-TR',
  'ru-RU': 'ru-RU',
  'zh-CN': 'zh-CN',
  'bn-BD': 'bn-IN',
  'ps-AF': 'ur-PK', // fallback for Pashto
  'sd-PK': 'ur-PK', // fallback for Sindhi
  'bal':   'ur-PK', // fallback for Balochi
};

// Native labels for UI
export const TTS_LANGUAGE_LABELS: Record<string, string> = {
  'ur-PK': 'اردو',
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'ar-SA': 'العربية',
  'hi-IN': 'हिंदी',
  'fa-IR': 'فارسی',
  'tr-TR': 'Türkçe',
  'ru-RU': 'Русский',
  'zh-CN': '中文',
  'bn-BD': 'বাংলা',
};

export const TTSService = {
  async getAvailableVoices(): Promise<TTSVoice[]> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices.map(v => ({
        identifier: v.identifier,
        name: v.name,
        language: v.language,
        quality: v.quality,
      }));
    } catch {
      return [];
    }
  },

  async isLanguageAvailable(lang: string): Promise<boolean> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      const mapped = LANG_MAP[lang] || lang;
      return voices.some(v => v.language.startsWith(mapped.split('-')[0]));
    } catch {
      return false;
    }
  },

  speak(text: string, options: TTSOptions = {}): void {
    if (!text || !text.trim()) return;

    const mapped = LANG_MAP[options.language || 'ur-PK'] || options.language || 'ur-PK';

    Speech.speak(text, {
      language: mapped,
      pitch: options.pitch ?? 1.0,
      rate: options.rate ?? 0.9,
      volume: options.volume ?? 1.0,
      voice: options.voice,
      onStart: options.onStart,
      onDone: options.onDone,
      onStopped: options.onStopped,
      onError: options.onError,
    });
  },

  async stop(): Promise<void> {
    try {
      await Speech.stop();
    } catch {}
  },

  async pause(): Promise<void> {
    try {
      await Speech.pause();
    } catch {}
  },

  async resume(): Promise<void> {
    try {
      await Speech.resume();
    } catch {}
  },

  async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return false;
    }
  },
};
