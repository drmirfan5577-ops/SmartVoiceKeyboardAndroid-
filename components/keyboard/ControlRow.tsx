// Powered by OnSpace.AI
// Full professional voice input with real-time waveform, partial text, language picker
import React, { memo, useState, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, ScrollView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, FontSize } from '@/constants/theme';
import { VOICE_LANGUAGES } from '@/constants/languages';
import Key from './Key';
import WaveformAnimation from './WaveformAnimation';

interface Props {
  onBackspace: () => void;
  onVoice: (lang?: string) => void;
  onSpace: () => void;
  onEnter: () => void;
  onPhrases: () => void;
  onAutoCorrect: () => void;
  isListening: boolean;
  volume: number;
  voiceLang: string;
  onVoiceLangChange: (lang: string) => void;
  accentColor: string;
  partialText?: string;
}

function ControlRow({
  onBackspace, onVoice, onSpace, onEnter, onPhrases, onAutoCorrect,
  isListening, volume, voiceLang, onVoiceLangChange, accentColor, partialText = '',
}: Props) {
  const [showLangModal, setShowLangModal] = useState(false);
  const currentLang = VOICE_LANGUAGES.find(l => l.code === voiceLang) || VOICE_LANGUAGES[0];

  const handleLangSelect = useCallback((code: string) => {
    onVoiceLangChange(code);
    setShowLangModal(false);
  }, [onVoiceLangChange]);

  return (
    <View style={styles.wrapper}>
      {/* ── LISTENING STATE: Waveform + partial text banner ── */}
      {isListening && (
        <View style={[styles.listeningBanner, {
          backgroundColor: `${accentColor}12`,
          borderColor: `${accentColor}44`,
          shadowColor: accentColor,
        }]}>
          <WaveformAnimation volume={volume} color={accentColor} isActive={isListening} barCount={18} />
          <View style={styles.listeningTextBlock}>
            <View style={styles.listeningDotRow}>
              <View style={[styles.pulseDot, { backgroundColor: accentColor }]} />
              <Text style={[styles.listeningLabel, { color: accentColor }]}>
                سن رہا ہے • {currentLang.emoji} {currentLang.nativeLabel}
              </Text>
            </View>
            {partialText ? (
              <Text style={[styles.partialText, { color: accentColor }]} numberOfLines={2}>
                {partialText}
              </Text>
            ) : (
              <Text style={styles.partialHint}>بولیں...</Text>
            )}
          </View>
          {/* Stop button */}
          <Pressable
            onPress={() => onVoice()}
            style={[styles.stopBtn, { borderColor: Colors.red, backgroundColor: 'rgba(255,50,80,0.12)' }]}
          >
            <MaterialIcons name="stop" size={18} color={Colors.red} />
          </Pressable>
        </View>
      )}

      {/* ── Main Control Row ── */}
      <View style={styles.row}>
        {/* Backspace */}
        <Key label="⌫" onPress={onBackspace} variant="fn" flex={1.3} />

        {/* Quick Phrases */}
        <Key label="⚡" onPress={onPhrases} variant="sym" flex={0.9} />

        {/* Auto-Correct toggle */}
        <Key label="✏️" onPress={onAutoCorrect} variant="fn" flex={0.9} />

        {/* Voice Language Selector */}
        <Pressable
          onPress={() => setShowLangModal(true)}
          style={[styles.langBtn, {
            borderColor: `${accentColor}55`,
            backgroundColor: `${accentColor}14`,
            shadowColor: accentColor,
          }]}
        >
          <Text style={styles.langBtnEmoji}>{currentLang.emoji}</Text>
        </Pressable>

        {/* Voice Button — glows red while listening */}
        <Pressable
          onPress={() => onVoice()}
          style={({ pressed }) => [
            styles.voiceBtn,
            {
              backgroundColor: isListening
                ? Colors.red
                : pressed
                  ? `${accentColor}dd`
                  : accentColor,
              borderColor: isListening ? '#ff0033' : accentColor,
              shadowColor: isListening ? Colors.red : accentColor,
              shadowOpacity: isListening ? 1 : 0.55,
              shadowRadius: isListening ? 14 : 6,
              elevation: isListening ? 14 : 6,
              transform: [{ scale: isListening ? 1.06 : 1 }],
            },
          ]}
        >
          <MaterialIcons
            name={isListening ? 'mic-off' : 'mic'}
            size={20}
            color="#fff"
          />
        </Pressable>

        {/* Space */}
        <Key label="اسپیس" onPress={onSpace} variant="space" flex={2.5} />

        {/* Enter */}
        <Key label="↵" onPress={onEnter} variant="action" flex={1.2} />
      </View>

      {/* ── Language Picker Modal ── */}
      <Modal
        visible={showLangModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLangModal(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowLangModal(false)} />
        <View style={[styles.langModal, { borderColor: `${accentColor}44` }]}>
          <View style={styles.langModalHeader}>
            <Text style={[styles.langModalTitle, { color: accentColor }]}>
              🎤 وائس زبان منتخب کریں
            </Text>
            <Pressable onPress={() => setShowLangModal(false)} hitSlop={8}>
              <MaterialIcons name="close" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.langGrid}>
            {VOICE_LANGUAGES.map(lang => {
              const active = lang.code === voiceLang;
              return (
                <Pressable
                  key={lang.code}
                  onPress={() => handleLangSelect(lang.code)}
                  style={({ pressed }) => [
                    styles.langItem,
                    {
                      backgroundColor: active
                        ? `${accentColor}22`
                        : pressed
                          ? `${accentColor}0e`
                          : 'rgba(255,255,255,0.96)',
                      borderColor: active ? accentColor : 'rgba(100,80,220,0.20)',
                      shadowColor: accentColor,
                      shadowOpacity: active ? 0.35 : 0.07,
                      shadowRadius: active ? 8 : 2,
                      elevation: active ? 6 : 1,
                    },
                  ]}
                >
                  <Text style={styles.langItemEmoji}>{lang.emoji}</Text>
                  <View style={styles.langItemText}>
                    <Text style={[styles.langItemNative, active && { color: accentColor }]}>
                      {lang.nativeLabel}
                    </Text>
                    <Text style={styles.langItemCode}>{lang.code}</Text>
                  </View>
                  {active && (
                    <MaterialIcons name="check-circle" size={18} color={accentColor} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 3 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  // Listening banner
  listeningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 7,
    gap: 8,
    marginBottom: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  listeningTextBlock: {
    flex: 1,
    gap: 3,
  },
  listeningDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.85,
  },
  listeningLabel: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  partialText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'right',
  },
  partialHint: {
    fontSize: FontSize.xs,
    color: Colors.textDim,
    fontStyle: 'italic',
  },
  stopBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Voice button (custom, larger, glowing)
  voiceBtn: {
    width: 44,
    height: 40,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1.5,
    shadowOffset: { width: 0, height: 0 },
  },

  // Language button
  langBtn: {
    height: 40,
    width: 34,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  langBtnEmoji: { fontSize: 16 },

  // Language Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  langModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(248,246,255,0.99)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 2,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '65%',
    shadowColor: '#6040ee',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 20,
  },
  langModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100,80,220,0.12)',
    marginBottom: 8,
  },
  langModalTitle: {
    fontSize: FontSize.lg,
    fontWeight: '900',
  },
  langGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 16,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 9,
    minWidth: '44%',
    flex: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  langItemEmoji: { fontSize: 20 },
  langItemText: { flex: 1, gap: 1 },
  langItemNative: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.text,
  },
  langItemCode: {
    fontSize: 10,
    color: Colors.textDim,
    fontWeight: '600',
  },
});

export default memo(ControlRow);
