// Powered by OnSpace.AI
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Phrase {
  id: string;
  text: string;
  label: string;
  emoji: string;
  lang: string;
}

const KEY = 'sw_quick_phrases';

const DEFAULT_PHRASES: Phrase[] = [
  { id: '1', emoji: '🙏', label: 'آداب',        text: 'السلام علیکم',                lang: 'ur' },
  { id: '2', emoji: '😊', label: 'شکریہ',       text: 'بہت شکریہ',                   lang: 'ur' },
  { id: '3', emoji: '📞', label: 'رابطہ',       text: '0300-4737757',                lang: 'en' },
  { id: '4', emoji: '✉️', label: 'ای میل',      text: 'dr.mirfan5577@gmail.com',     lang: 'en' },
  { id: '5', emoji: '🌐', label: 'ویب سائٹ',   text: 'https://drmirfan5577-ops.github.io/SmartWorldOrder', lang: 'en' },
  { id: '6', emoji: '❤️', label: 'محبت',        text: 'اللہ حافظ، خدا حافظ',         lang: 'ur' },
  { id: '7', emoji: '🤲', label: 'دعا',          text: 'ماشاء اللہ، جزاک اللہ خیر', lang: 'ur' },
  { id: '8', emoji: '📝', label: 'نوٹ',          text: 'براہ کرم جلدی جواب دیں',    lang: 'ur' },
];

export const PhrasesService = {
  async getAll(): Promise<Phrase[]> {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (!raw) {
        await AsyncStorage.setItem(KEY, JSON.stringify(DEFAULT_PHRASES));
        return DEFAULT_PHRASES;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PHRASES;
    }
  },

  async save(phrase: Omit<Phrase, 'id'>): Promise<Phrase[]> {
    const existing = await PhrasesService.getAll();
    const newOne: Phrase = { ...phrase, id: Date.now().toString() };
    const updated = [newOne, ...existing].slice(0, 50);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  },

  async update(id: string, data: Partial<Phrase>): Promise<Phrase[]> {
    const existing = await PhrasesService.getAll();
    const updated = existing.map(p => (p.id === id ? { ...p, ...data } : p));
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  },

  async delete(id: string): Promise<Phrase[]> {
    const existing = await PhrasesService.getAll();
    const updated = existing.filter(p => p.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  },
};
