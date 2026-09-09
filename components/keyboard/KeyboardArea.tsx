// Powered by OnSpace.AI
import React, { memo, useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useApp } from '@/hooks/useApp';
import { useVoice } from '@/hooks/useVoice';
import NumberStrip from './NumberStrip';
import UrduLayout from './UrduLayout';
import EnglishLayout from './EnglishLayout';
import SindhiLayout from './SindhiLayout';
import SymbolsLayout from './SymbolsLayout';
import FnLayout from './FnLayout';
import EmojiLayout from './EmojiLayout';
import ControlRow from './ControlRow';
import ModeBar from './ModeBar';
import PredictionStrip from './PredictionStrip';
import QuickPhrasesPanel from '@/components/ui/QuickPhrasesPanel';
import AutoCorrectDictPanel from '@/components/ui/AutoCorrectDictPanel';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface Props {
  onTextChange?: (text: string) => void;
}

function KeyboardArea({ onTextChange }: Props) {
  const {
    mode, setMode,
    appendText, backspace, clearText,
    isListening, isShift, toggleShift, isCaps, toggleCaps,
    addToClipboard, text, currentTheme,
    phrases, setPhrases,
    autoCorrectEnabled, setAutoCorrectEnabled,
    history,
  } = useApp();

  const { toggleVoice, volume, voiceLang, setVoiceLang, partialText } = useVoice();
  const [isCtrl, setIsCtrl] = useState(false);
  const [isAlt, setIsAlt] = useState(false);
  const [showPhrases, setShowPhrases] = useState(false);
  const [showAutoCorrect, setShowAutoCorrect] = useState(false);

  const handleChar = useCallback((ch: string) => {
    if (ch === '__BACKSPACE__') { backspace(); return; }
    appendText(ch);
    if (ch.trim().length > 0) addToClipboard(ch);
    onTextChange?.(text + ch);
  }, [backspace, appendText, addToClipboard, text, onTextChange]);

  const handleFn = useCallback((key: string) => {
    switch (key) {
      case 'backspace':
      case '⌫': backspace(); break;
      case 'enter':
      case 'Enter': appendText('\n'); break;
      case 'Clr':
        Alert.alert('صاف کریں', 'کیا آپ سب کچھ صاف کرنا چاہتے ہیں؟', [
          { text: 'نہیں', style: 'cancel' },
          { text: 'ہاں', style: 'destructive', onPress: clearText },
        ]);
        break;
      case 'Tab': appendText('\t'); break;
      case 'DelW': {
        // Delete last word
        const words = text.trimEnd().split(/\s+/);
        words.pop();
        const newText = words.join(' ') + (text.endsWith(' ') ? ' ' : '');
        history.undo.push(text);
        appendText('');
        break;
      }
      default: break;
    }
  }, [backspace, appendText, clearText, text, history]);

  const handlePredictionSelect = useCallback((word: string) => {
    appendText(word);
  }, [appendText]);

  const showModeLayoutForPrediction = mode === 'urdu' || mode === 'english' || mode === 'sindhi';

  return (
    <View style={[styles.keyboard, { borderColor: `${currentTheme.accent}33` }]}>
      {/* Number Strip */}
      <NumberStrip onPress={handleChar} />

      {/* Mode Bar */}
      <ModeBar mode={mode} onSwitch={setMode} accentColor={currentTheme.accent} />

      {/* Word Prediction Strip */}
      {showModeLayoutForPrediction && (
        <PredictionStrip
          text={text}
          mode={mode as string}
          accentColor={currentTheme.accent}
          onSelect={handlePredictionSelect}
        />
      )}

      {/* Keyboard Layouts */}
      {mode === 'urdu' && <UrduLayout onPress={handleChar} />}
      {mode === 'english' && (
        <EnglishLayout
          onPress={handleChar}
          isShift={isShift}
          isCaps={isCaps}
          onShift={toggleShift}
          onCaps={toggleCaps}
        />
      )}
      {mode === 'sindhi' && <SindhiLayout onPress={handleChar} />}
      {mode === 'symbols' && <SymbolsLayout onPress={handleChar} />}
      {mode === 'emoji' && (
        <EmojiLayout onPress={handleChar} accentColor={currentTheme.accent} />
      )}
      {mode === 'fn' && (
        <FnLayout
          onFnPress={handleFn}
          isCtrl={isCtrl}
          isAlt={isAlt}
          isCaps={isCaps}
          onCtrl={() => setIsCtrl(v => !v)}
          onAlt={() => setIsAlt(v => !v)}
          onCaps={toggleCaps}
        />
      )}

      {/* Control Row */}
      <ControlRow
        onBackspace={backspace}
        onVoice={toggleVoice}
        onSpace={() => appendText(' ')}
        onEnter={() => appendText('\n')}
        onPhrases={() => setShowPhrases(true)}
        onAutoCorrect={() => setShowAutoCorrect(true)}
        isListening={isListening}
        volume={volume}
        voiceLang={voiceLang}
        onVoiceLangChange={setVoiceLang}
        accentColor={currentTheme.accent}
        partialText={partialText}
      />

      {/* Quick Phrases Panel */}
      <QuickPhrasesPanel
        visible={showPhrases}
        onClose={() => setShowPhrases(false)}
        phrases={phrases}
        onPhraseInsert={appendText}
        onPhraseChange={setPhrases}
        accentColor={currentTheme.accent}
        partialText={partialText}
      />

      {/* Auto-Correct Dictionary Panel */}
      <AutoCorrectDictPanel
        visible={showAutoCorrect}
        onClose={() => setShowAutoCorrect(false)}
        accentColor={currentTheme.accent}
        autoCorrectEnabled={autoCorrectEnabled}
        onToggleAutoCorrect={setAutoCorrectEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    borderWidth: 1.5,
    gap: 3,
    shadowColor: '#6040ee',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default memo(KeyboardArea);
