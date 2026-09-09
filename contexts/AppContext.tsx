// Powered by OnSpace.AI
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService, ClipEntry } from '@/services/storage';
import { PhrasesService, Phrase } from '@/services/phrases';
import { THEMES } from '@/constants/theme';
import { KeyboardMode } from '@/constants/keyboard';
import { TextFormatting, DEFAULT_FORMAT } from '@/components/ui/TextFormattingPanel';
import { LiveBgType } from '@/constants/theme';

export type ExtendedKeyboardMode = KeyboardMode;

interface AppContextType {
  // Text
  text: string;
  setText: (t: string) => void;
  appendText: (ch: string) => void;
  backspace: () => void;
  clearText: () => void;

  // Keyboard mode
  mode: KeyboardMode;
  setMode: (m: KeyboardMode) => void;

  // Voice
  isListening: boolean;
  setIsListening: (v: boolean) => void;

  // Font size
  fontSize: number;
  setFontSizeAndSave: (s: number) => void;

  // Clipboard
  clipboard: ClipEntry[];
  addToClipboard: (text: string) => void;
  deleteClipEntry: (id: string) => void;
  clearClipboard: () => void;

  // Theme
  themeId: string;
  setThemeId: (id: string) => void;
  currentTheme: typeof THEMES[0];

  // Live background
  liveBg: LiveBgType;
  setLiveBg: (bg: LiveBgType) => void;

  // Modifiers
  isShift: boolean;
  toggleShift: () => void;
  isCaps: boolean;
  toggleCaps: () => void;

  // Quick Phrases
  phrases: Phrase[];
  setPhrases: (p: Phrase[]) => void;

  // Text Formatting
  formatting: TextFormatting;
  setFormatting: (f: TextFormatting) => void;

  // Auto Correct
  autoCorrectEnabled: boolean;
  setAutoCorrectEnabled: (v: boolean) => void;

  // History for undo/redo (shortcuts)
  history: { undo: string[]; redo: string[] };
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AC_KEY = 'sw_autocorrect';
const LIVE_BG_KEY = 'sw_live_bg';

export function AppProvider({ children }: { children: ReactNode }) {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<KeyboardMode>('urdu');
  const [isListening, setIsListening] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [clipboard, setClipboard] = useState<ClipEntry[]>([]);
  const [themeId, setThemeIdState] = useState('pearl');
  const [liveBg, setLiveBgState] = useState<LiveBgType>('sparkles');
  const [isShift, setIsShift] = useState(false);
  const [isCaps, setIsCaps] = useState(false);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [formatting, setFormattingState] = useState<TextFormatting>(DEFAULT_FORMAT);
  const [autoCorrectEnabled, setAutoCorrectEnabledState] = useState(true);
  const [history] = useState<{ undo: string[]; redo: string[] }>({ undo: [], redo: [] });

  useEffect(() => {
    (async () => {
      const clips = await StorageService.getClipboard();
      setClipboard(clips);
      const fs = await StorageService.getFontSize();
      setFontSize(fs);
      const tid = await StorageService.getTheme();
      if (tid) setThemeIdState(tid);
      const savedPhrases = await PhrasesService.getAll();
      setPhrases(savedPhrases);
      try {
        const acRaw = await AsyncStorage.getItem(AC_KEY);
        if (acRaw !== null) setAutoCorrectEnabledState(acRaw === 'true');
        const bgRaw = await AsyncStorage.getItem(LIVE_BG_KEY);
        if (bgRaw) setLiveBgState(bgRaw as LiveBgType);
      } catch {}
    })();
  }, []);

  const appendText = useCallback((ch: string) => {
    let char = ch;
    if (char.length === 1 && /[a-z]/.test(char)) {
      if (isShift || isCaps) char = char.toUpperCase();
      if (isShift) setIsShift(false);
    }
    setText(prev => {
      history.undo.push(prev);
      if (history.undo.length > 50) history.undo.shift();
      history.redo.length = 0;
      return prev + char;
    });
  }, [isShift, isCaps, history]);

  const backspace = useCallback(() => {
    setText(prev => {
      if (prev.length === 0) return prev;
      history.undo.push(prev);
      if (history.undo.length > 50) history.undo.shift();
      history.redo.length = 0;
      const arr = [...prev];
      arr.pop();
      return arr.join('');
    });
  }, [history]);

  const clearText = useCallback(() => {
    setText(prev => {
      history.undo.push(prev);
      return '';
    });
  }, [history]);

  const setFontSizeAndSave = useCallback((s: number) => {
    setFontSize(s);
    StorageService.saveFontSize(s);
  }, []);

  const addToClipboard = useCallback(async (t: string) => {
    const updated = await StorageService.saveClipEntry(t);
    setClipboard(updated);
  }, []);

  const deleteClipEntry = useCallback(async (id: string) => {
    const updated = await StorageService.deleteClipEntry(id);
    setClipboard(updated);
  }, []);

  const clearClipboard = useCallback(async () => {
    await StorageService.clearClipboard();
    setClipboard([]);
  }, []);

  const setThemeId = useCallback((id: string) => {
    setThemeIdState(id);
    StorageService.saveTheme(id);
  }, []);

  const setLiveBg = useCallback(async (bg: LiveBgType) => {
    setLiveBgState(bg);
    try { await AsyncStorage.setItem(LIVE_BG_KEY, bg); } catch {}
  }, []);

  const toggleShift = useCallback(() => setIsShift(v => !v), []);
  const toggleCaps = useCallback(() => setIsCaps(v => !v), []);

  const setFormatting = useCallback((f: TextFormatting) => {
    setFormattingState(f);
  }, []);

  const setAutoCorrectEnabled = useCallback(async (v: boolean) => {
    setAutoCorrectEnabledState(v);
    try { await AsyncStorage.setItem(AC_KEY, v.toString()); } catch {}
  }, []);

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  return (
    <AppContext.Provider value={{
      text, setText, appendText, backspace, clearText,
      mode, setMode,
      isListening, setIsListening,
      fontSize, setFontSizeAndSave,
      clipboard, addToClipboard, deleteClipEntry, clearClipboard,
      themeId, setThemeId, currentTheme,
      liveBg, setLiveBg,
      isShift, toggleShift,
      isCaps, toggleCaps,
      phrases, setPhrases,
      formatting, setFormatting,
      autoCorrectEnabled, setAutoCorrectEnabled,
      history,
    }}>
      {children}
    </AppContext.Provider>
  );
}
