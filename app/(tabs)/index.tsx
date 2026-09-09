// Powered by OnSpace.AI
import React, { useCallback, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/hooks/useApp';
import { useVoice } from '@/hooks/useVoice';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import TextDisplay from '@/components/ui/TextDisplay';
import FontSizeControl from '@/components/ui/FontSizeControl';
import KeyboardArea from '@/components/keyboard/KeyboardArea';
import TextFormattingPanel from '@/components/ui/TextFormattingPanel';
import TTSPanel from '@/components/ui/TTSPanel';
import ExportPanel from '@/components/ui/ExportPanel';
import ShortcutsPanel from '@/components/ui/ShortcutsPanel';
import FindReplacePanel from '@/components/ui/FindReplacePanel';
import AutoCorrectIndicator from '@/components/ui/AutoCorrectIndicator';
import { Colors, Spacing, FontSize } from '@/constants/theme';
import * as Clipboard from 'expo-clipboard';
import { AutoCorrect } from '@/services/autocorrect';

export default function KeyboardScreen() {
  const insets = useSafeAreaInsets();
  const {
    text, setText, clearText, fontSize, setFontSizeAndSave,
    currentTheme, mode, isListening, addToClipboard,
    formatting, setFormatting, clipboard, phrases, themeId,
    autoCorrectEnabled, history, liveBg,
  } = useApp();
  const { partialText } = useVoice();

  const isRTL = mode === 'urdu' || mode === 'sindhi';

  const [showFormatting, setShowFormatting] = useState(false);
  const [showTTS, setShowTTS] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [acSuggestion, setAcSuggestion] = useState<{ original: string; corrected: string } | null>(null);

  const prevTextRef = useRef('');
  const checkAutoCorrect = useCallback(async (currentText: string) => {
    if (!autoCorrectEnabled) return;
    const prevLen = prevTextRef.current.length;
    const newChar = currentText.slice(prevLen);
    prevTextRef.current = currentText;
    if (newChar !== ' ' && newChar !== '\n') return;
    const result = await AutoCorrect.correctLastWord(currentText.trimEnd());
    if (result.wasChanged) {
      setAcSuggestion({ original: result.original, corrected: result.corrected });
      setTimeout(() => setAcSuggestion(null), 4000);
    }
  }, [autoCorrectEnabled]);

  const handleCopy = useCallback(async () => {
    if (!text) { Alert.alert('', 'کوئی متن نہیں۔'); return; }
    try {
      await Clipboard.setStringAsync(text);
      addToClipboard(text);
      Alert.alert('✓', 'متن کاپی ہو گیا!');
    } catch { Alert.alert('خرابی', 'کاپی نہیں ہو سکا۔'); }
  }, [text, addToClipboard]);

  const handleClear = useCallback(() => {
    if (!text) return;
    Alert.alert('صاف کریں؟', 'کیا آپ سب کچھ صاف کرنا چاہتے ہیں؟', [
      { text: 'نہیں', style: 'cancel' },
      { text: 'ہاں', style: 'destructive', onPress: clearText },
    ]);
  }, [text, clearText]);

  const handleAcceptCorrection = useCallback(() => {
    if (!acSuggestion) return;
    const newText = text.trimEnd().slice(0, -acSuggestion.original.length) + acSuggestion.corrected + ' ';
    setText(newText);
    setAcSuggestion(null);
  }, [acSuggestion, text, setText]);

  const modeLabel = {
    urdu: '🇵🇰 اردو', sindhi: '🌸 سنڌي', english: '🇬🇧 English',
    symbols: '🔣 Sym', fn: '⚙️ Fn', emoji: '😀 Emoji',
  }[mode] || mode;

  const backupData = {
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    appName: 'SMART Voice Keyboard Pro',
    author: 'Dr M Irfan Qadir Thaheem',
    clipboard, phrases,
    preferences: { theme: themeId, fontSize },
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 4, backgroundColor: currentTheme.bg1 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={currentTheme.bg1} />
      <AnimatedBackground color1={currentTheme.accent} color2={currentTheme.glow} liveBg={liveBg} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.appTitle, { color: currentTheme.accent }]}>
            🎹 SMART Voice Keyboard
          </Text>
          <View style={styles.statusRow}>
            <View style={[styles.badge, {
              backgroundColor: isListening ? `${currentTheme.accent}22` : 'rgba(255,255,255,0.90)',
              borderColor: isListening ? currentTheme.accent : `${currentTheme.accent}55`,
              shadowColor: currentTheme.accent,
              shadowOpacity: isListening ? 0.6 : 0.15,
              shadowRadius: isListening ? 8 : 3,
              elevation: isListening ? 6 : 2,
            }]}>
              <Text style={[styles.badgeText, { color: currentTheme.accent, fontWeight: '700' }]}>
                {isListening ? '🔴 سن رہا ہے' : '🎤 Voice Ready'}
              </Text>
            </View>
            <View style={[styles.badge, {
              backgroundColor: 'rgba(255,255,255,0.90)',
              borderColor: `${currentTheme.accent}44`,
              shadowColor: currentTheme.accent,
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 2,
            }]}>
              <Text style={[styles.badgeText, { color: currentTheme.accent }]}>{modeLabel}</Text>
            </View>
          </View>
        </View>

        {acSuggestion && (
          <AutoCorrectIndicator
            original={acSuggestion.original}
            corrected={acSuggestion.corrected}
            visible={Boolean(acSuggestion)}
            onAccept={handleAcceptCorrection}
            onDismiss={() => setAcSuggestion(null)}
            accentColor={currentTheme.accent}
          />
        )}

        <TextDisplay
          text={text}
          fontSize={fontSize}
          isRTL={isRTL}
          accentColor={currentTheme.accent}
          partialText={partialText}
          isListening={isListening}
          onCopy={handleCopy}
          onClear={handleClear}
          onFormatPress={() => setShowFormatting(true)}
          onTTSPress={() => setShowTTS(true)}
          onExportPress={() => setShowExport(true)}
          onFindReplacePress={() => setShowFindReplace(true)}
          onShortcutsPress={() => setShowShortcuts(true)}
          formatting={formatting}
        />

        <FontSizeControl
          value={fontSize}
          onChange={setFontSizeAndSave}
          accentColor={currentTheme.accent}
        />

        <KeyboardArea onTextChange={checkAutoCorrect} />
      </ScrollView>

      <TextFormattingPanel
        visible={showFormatting}
        onClose={() => setShowFormatting(false)}
        formatting={formatting}
        onChange={setFormatting}
        accentColor={currentTheme.accent}
      />
      <TTSPanel
        visible={showTTS}
        onClose={() => setShowTTS(false)}
        text={text}
        accentColor={currentTheme.accent}
      />
      <ExportPanel
        visible={showExport}
        onClose={() => setShowExport(false)}
        text={text}
        accentColor={currentTheme.accent}
        backupData={backupData}
      />
      <FindReplacePanel
        visible={showFindReplace}
        onClose={() => setShowFindReplace(false)}
        currentText={text}
        onTextChange={setText}
        accentColor={currentTheme.accent}
      />
      <ShortcutsPanel
        visible={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        currentText={text}
        onTextChange={setText}
        accentColor={currentTheme.accent}
        history={history}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  appTitle: {
    fontSize: FontSize.md,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusRow: { flexDirection: 'row', gap: 6 },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
