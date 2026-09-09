// Powered by OnSpace.AI
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ClipEntry {
  id: string;
  text: string;
  time: string;
}

const KEYS = {
  clipboard: 'sw_clipboard',
  theme: 'sw_theme',
  fontSize: 'sw_fontsize',
  setupDone: 'sw_setup_done',
};

export const StorageService = {
  async getClipboard(): Promise<ClipEntry[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.clipboard);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async saveClipEntry(text: string): Promise<ClipEntry[]> {
    try {
      const existing = await StorageService.getClipboard();
      if (!text || text.trim().length < 2) return existing;
      const entry: ClipEntry = {
        id: Date.now().toString(),
        text: text.trim(),
        time: new Date().toLocaleString('ur-PK'),
      };
      const updated = [entry, ...existing].slice(0, 30);
      await AsyncStorage.setItem(KEYS.clipboard, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  async clearClipboard(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.clipboard);
  },

  async deleteClipEntry(id: string): Promise<ClipEntry[]> {
    const existing = await StorageService.getClipboard();
    const updated = existing.filter(e => e.id !== id);
    await AsyncStorage.setItem(KEYS.clipboard, JSON.stringify(updated));
    return updated;
  },

  async getTheme(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.theme);
  },

  async saveTheme(id: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.theme, id);
  },

  async getFontSize(): Promise<number> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.fontSize);
      return raw ? parseInt(raw, 10) : 18;
    } catch {
      return 18;
    }
  },

  async saveFontSize(size: number): Promise<void> {
    await AsyncStorage.setItem(KEYS.fontSize, size.toString());
  },

  async isSetupDone(): Promise<boolean> {
    const v = await AsyncStorage.getItem(KEYS.setupDone);
    return v === 'true';
  },

  async markSetupDone(): Promise<void> {
    await AsyncStorage.setItem(KEYS.setupDone, 'true');
  },
};
