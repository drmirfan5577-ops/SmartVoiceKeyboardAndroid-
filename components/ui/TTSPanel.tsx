// Powered by OnSpace.AI
import React, { memo, useState, useCallback, useEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, ScrollView, Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TTSService, TTS_LANGUAGE_LABELS } from '@/services/tts';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { VOICE_LANGUAGES } from '@/constants/languages';

interface Props {
  visible: boolean;
  onClose: () => void;
  text: string;
  accentColor: string;
}

function TTSPanel({ visible, onClose, text, accentColor }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLang, setSelectedLang] = useState('ur-PK');
  const [pitch, setPitch] = useState(1.0);
  const [rate, setRate] = useState(0.85);
  const [autoStop, setAutoStop] = useState(false);

  useEffect(() => {
    if (!visible && isSpeaking) {
      TTSService.stop();
      setIsSpeaking(false);
    }
  }, [visible, isSpeaking]);

  const handleSpeak = useCallback(() => {
    if (isSpeaking) {
      TTSService.stop();
      setIsSpeaking(false);
      return;
    }
    if (!text.trim()) return;

    setIsSpeaking(true);
    TTSService.speak(text, {
      language: selectedLang,
      pitch,
      rate,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [isSpeaking, text, selectedLang, pitch, rate]);

  const handlePause = useCallback(async () => {
    if (isSpeaking) await TTSService.pause();
  }, [isSpeaking]);

  const handleResume = useCallback(async () => {
    if (isSpeaking) await TTSService.resume();
  }, [isSpeaking]);

  const SliderRow = ({
    label, value, min, max, step, onChange,
  }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) => (
    <View style={styles.sliderRow}>
      <Text style={styles.sliderLabel}>{label}: <Text style={{ color: accentColor }}>{value.toFixed(2)}</Text></Text>
      <View style={styles.sliderBtns}>
        <Pressable
          onPress={() => onChange(Math.max(min, parseFloat((value - step).toFixed(2))))}
          style={styles.sliderBtn}
        >
          <MaterialIcons name="remove" size={18} color={Colors.textMuted} />
        </Pressable>
        {/* Simple step buttons since Slider is not universally available */}
        {[min, (min + max) / 2, max].map(v => (
          <Pressable
            key={v}
            onPress={() => onChange(parseFloat(v.toFixed(2)))}
            style={[
              styles.sliderPreset,
              Math.abs(value - v) < 0.05 && { backgroundColor: `${accentColor}33`, borderColor: accentColor },
            ]}
          >
            <Text style={[styles.sliderPresetText, Math.abs(value - v) < 0.05 && { color: accentColor }]}>
              {v.toFixed(1)}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => onChange(Math.min(max, parseFloat((value + step).toFixed(2))))}
          style={styles.sliderBtn}
        >
          <MaterialIcons name="add" size={18} color={Colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.panel}>
        <View style={[styles.handle, { backgroundColor: accentColor }]} />
        <Text style={[styles.title, { color: accentColor }]}>🔊 متن سے آواز (TTS)</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Preview */}
          <View style={[styles.previewBox, { borderColor: `${accentColor}33` }]}>
            <Text style={styles.previewText} numberOfLines={3}>
              {text.trim() || 'متن ٹائپ کریں پھر یہاں سنیں...'}
            </Text>
          </View>

          {/* Play Controls */}
          <View style={styles.controls}>
            <Pressable
              onPress={handlePause}
              disabled={!isSpeaking}
              style={[styles.controlBtn, { opacity: isSpeaking ? 1 : 0.4 }]}
            >
              <MaterialIcons name="pause" size={26} color={Colors.textMuted} />
            </Pressable>

            <Pressable
              onPress={handleSpeak}
              style={[styles.playBtn, { backgroundColor: isSpeaking ? Colors.red : accentColor }]}
            >
              <MaterialIcons name={isSpeaking ? 'stop' : 'play-arrow'} size={36} color="#fff" />
            </Pressable>

            <Pressable
              onPress={handleResume}
              disabled={!isSpeaking}
              style={[styles.controlBtn, { opacity: isSpeaking ? 1 : 0.4 }]}
            >
              <MaterialIcons name="play-circle-outline" size={26} color={Colors.textMuted} />
            </Pressable>
          </View>

          {isSpeaking && (
            <Text style={[styles.speakingLabel, { color: accentColor }]}>
              🔊 پڑھ رہا ہے...
            </Text>
          )}

          {/* Language Selection */}
          <Text style={styles.sectionLabel}>زبان</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langRow}>
            {VOICE_LANGUAGES.map(lang => {
              const active = lang.code === selectedLang;
              return (
                <Pressable
                  key={lang.code}
                  onPress={() => setSelectedLang(lang.code)}
                  style={[styles.langChip, active && { backgroundColor: `${accentColor}33`, borderColor: accentColor }]}
                >
                  <Text style={styles.langEmoji}>{lang.emoji}</Text>
                  <Text style={[styles.langLabel, active && { color: accentColor }]}>
                    {lang.nativeLabel}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Pitch & Rate */}
          <SliderRow
            label="آواز کا بلندی (Pitch)"
            value={pitch}
            min={0.5}
            max={2.0}
            step={0.1}
            onChange={setPitch}
          />
          <SliderRow
            label="رفتار (Rate)"
            value={rate}
            min={0.3}
            max={1.5}
            step={0.1}
            onChange={setRate}
          />

          {/* Info */}
          <View style={[styles.noteCard, { borderColor: `${accentColor}33` }]}>
            <Text style={[styles.noteText, { color: Colors.textDim }]}>
              💡 TTS انٹرنیٹ کے بغیر کام کرتا ہے۔ آواز کا معیار آلہ میں انسٹال شدہ TTS انجن پر منحصر ہے۔
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  panel: {
    backgroundColor: '#f0f4ff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    maxHeight: '80%',
    borderTopWidth: 2,
    borderColor: 'rgba(100,80,255,0.20)',
    shadowColor: '#6040ee',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 8 },
  title: { fontSize: FontSize.lg, fontWeight: '800', textAlign: 'center', marginBottom: Spacing.sm },
  scroll: { gap: Spacing.md, paddingBottom: 20 },

  previewBox: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    minHeight: 60,
  },
  previewText: { color: '#222', fontSize: FontSize.md, textAlign: 'right', lineHeight: 24 },

  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  controlBtn: { padding: 10 },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  speakingLabel: { fontSize: FontSize.sm, fontWeight: '700', textAlign: 'center' },

  sectionLabel: { color: '#888', fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase' },
  langRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(100,80,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  langEmoji: { fontSize: 14 },
  langLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '700' },

  sliderRow: { gap: 6 },
  sliderLabel: { color: Colors.textMuted, fontSize: FontSize.sm },
  sliderBtns: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sliderBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(100,80,255,0.25)',
  },
  sliderPreset: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(100,80,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  sliderPresetText: { color: Colors.textMuted, fontSize: FontSize.xs, fontWeight: '700' },

  noteCard: {
    borderRadius: Radius.md,
    padding: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.80)',
    borderWidth: 1.5,
  },
  noteText: { fontSize: FontSize.xs, lineHeight: 18, textAlign: 'right' },
});

export default memo(TTSPanel);
