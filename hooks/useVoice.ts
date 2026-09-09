// Powered by OnSpace.AI
import { useState, useRef, useCallback, useEffect } from 'react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { useApp } from './useApp';
import { VOICE_LANGUAGES } from '@/constants/languages';
import { PredictionService } from '@/services/prediction';

// Safe Voice import — @react-native-voice/voice requires native linking
let Voice: any = null;
try {
  Voice = require('@react-native-voice/voice').default;
} catch {
  Voice = null;
}

// Urdu auto-punctuation
function autoPunctuateUrdu(text: string): string {
  if (!text || text.length < 2) return text;
  let t = text.trim();
  t = t.replace(/([۔؟،])([^\s])/g, '$1 $2');
  if (!t.endsWith('۔') && !t.endsWith('؟') && !t.endsWith('،') && t.length > 5) {
    t = t + '۔';
  }
  return t;
}

export function useVoice() {
  const { appendText, addToClipboard, mode, setIsListening, isListening } = useApp();
  const [partialText, setPartialText] = useState('');
  const [volume, setVolume] = useState(0);
  const [voiceLang, setVoiceLang] = useState('ur-PK');
  const isStartedRef = useRef(false);

  // Map keyboard mode to voice language
  useEffect(() => {
    if (mode === 'urdu') setVoiceLang('ur-PK');
    else if (mode === 'sindhi') setVoiceLang('sd-PK');
    else if (mode === 'english') setVoiceLang('en-US');
  }, [mode]);

  const cleanup = useCallback(() => {
    isStartedRef.current = false;
    setIsListening(false);
    setPartialText('');
    setVolume(0);
  }, [setIsListening]);

  useEffect(() => {
    if (!Voice) return;

    Voice.onSpeechStart = () => {
      setIsListening(true);
      isStartedRef.current = true;
    };
    Voice.onSpeechEnd = () => { cleanup(); };
    Voice.onSpeechError = (e: any) => {
      cleanup();
      const msg = e?.error?.message || '';
      if (!msg.includes('aborted') && !msg.includes('canceled') && !msg.includes('7') && !msg.includes('No match')) {
        console.warn('Voice error:', msg);
      }
    };
    Voice.onSpeechPartialResults = (e: any) => {
      setPartialText(e?.value?.[0] || '');
    };
    Voice.onSpeechResults = (e: any) => {
      const result = e?.value?.[0] || '';
      if (result.trim()) {
        const isUrdu = voiceLang === 'ur-PK' || voiceLang === 'sd-PK';
        const finalText = isUrdu ? autoPunctuateUrdu(result) : result;
        appendText(finalText + ' ');
        addToClipboard(finalText);
        finalText.split(/\s+/).forEach((w: string) => PredictionService.learnWord(w));
      }
      setPartialText('');
      cleanup();
    };
    Voice.onSpeechVolumeChanged = (e: any) => {
      setVolume(e?.value || 0);
    };

    return () => {
      try { Voice.destroy().then(Voice.removeAllListeners).catch(() => {}); } catch {}
    };
  }, [voiceLang, appendText, addToClipboard, cleanup]);

  const requestMicPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'مائیکروفون کی اجازت',
            message: 'وائس ٹائپنگ کے لیے مائیکروفون کی اجازت درکار ہے',
            buttonPositive: 'اجازت دیں',
            buttonNegative: 'نہیں',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch { return false; }
    }
    return true;
  }, []);

  const startListening = useCallback(async (overrideLang?: string) => {
    if (isStartedRef.current) return;
    if (!Voice) {
      Alert.alert('وائس موڈ', 'وائس ٹائپنگ کے لیے ایپ کو نیٹیو بلڈ کی ضرورت ہے۔\n(react-native-voice not linked)');
      return;
    }
    const allowed = await requestMicPermission();
    if (!allowed) {
      Alert.alert('اجازت درکار ہے', 'وائس ٹائپنگ کے لیے مائیکروفون کی اجازت دیں۔');
      return;
    }
    const lang = overrideLang || voiceLang;
    try {
      await Voice.start(lang);
      isStartedRef.current = true;
      setIsListening(true);
    } catch (e: any) {
      console.warn('Voice start error:', e);
      isStartedRef.current = false;
      setIsListening(false);
    }
  }, [voiceLang, requestMicPermission, setIsListening]);

  const stopListening = useCallback(async () => {
    if (!Voice) { cleanup(); return; }
    try { await Voice.stop(); } catch {}
    cleanup();
  }, [cleanup]);

  const cancelListening = useCallback(async () => {
    if (!Voice) { cleanup(); return; }
    try { await Voice.cancel(); } catch {}
    cleanup();
  }, [cleanup]);

  const toggleVoice = useCallback((overrideLang?: string) => {
    if (isListening) { stopListening(); } else { startListening(overrideLang); }
  }, [isListening, startListening, stopListening]);

  return {
    toggleVoice,
    startListening,
    stopListening,
    cancelListening,
    partialText,
    volume,
    voiceLang,
    setVoiceLang,
  };
}
