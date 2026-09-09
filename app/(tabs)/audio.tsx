// Powered by OnSpace.AI
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, ScrollView, Alert,
  ActivityIndicator, StatusBar, Platform, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { VOICE_LANGUAGES } from '@/constants/languages';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { WhisperEngine, WHISPER_MODELS, WhisperModelSize } from '@/services/whisper';

type TranscriptState = 'idle' | 'loading' | 'playing' | 'done' | 'error';

const MODEL_OPTIONS: { id: WhisperModelSize; emoji: string }[] = [
  { id: 'tiny',   emoji: '🚀' },
  { id: 'base',   emoji: '⚡' },
  { id: 'small',  emoji: '🎯' },
  { id: 'medium', emoji: '💎' },
];

export default function AudioScreen() {
  const insets = useSafeAreaInsets();
  const { currentTheme, appendText, addToClipboard, liveBg } = useApp();

  const [selectedFile, setSelectedFile] = useState<{ name: string; uri: string; size?: number } | null>(null);
  const [selectedLang, setSelectedLang] = useState('ur-PK');
  const [selectedModel, setSelectedModel] = useState<WhisperModelSize>('base');
  const [state, setState] = useState<TranscriptState>('idle');
  const [transcript, setTranscript] = useState('');
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editableTranscript, setEditableTranscript] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const pickAudioFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setSelectedFile({ name: asset.name, uri: asset.uri, size: asset.size });
        setTranscript('');
        setEditableTranscript('');
        setState('idle');
        setProgress(0);
      }
    } catch {
      Alert.alert('خرابی', 'فائل منتخب کرنے میں مسئلہ ہوا۔');
    }
  }, []);

  const playAudio = useCallback(async () => {
    if (!selectedFile) return;
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      return;
    }
    try {
      const { sound: s } = await Audio.Sound.createAsync(
        { uri: selectedFile.uri },
        { shouldPlay: true }
      );
      setSound(s);
      setIsPlaying(true);
      s.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          s.unloadAsync();
          setSound(null);
        }
      });
    } catch {
      Alert.alert('خرابی', 'آڈیو چلانے میں مسئلہ ہوا۔');
    }
  }, [selectedFile, sound]);

  const transcribeAudio = useCallback(async () => {
    if (!selectedFile) {
      Alert.alert('', 'پہلے آڈیو فائل منتخب کریں۔');
      return;
    }
    setState('loading');
    setTranscript('');
    setProgress(0);

    try {
      const langCode = selectedLang.split('-')[0];
      const result = await WhisperEngine.transcribeFile(
        selectedFile.uri,
        langCode,
        (pct) => setProgress(Math.round(pct * 100))
      );
      setTranscript(result.text);
      setEditableTranscript(result.text);
      setState('done');
    } catch {
      setState('error');
      Alert.alert('خرابی', 'تجزیہ نہیں ہو سکا۔');
    }
  }, [selectedFile, selectedLang, selectedModel]);

  const handleUseText = useCallback(() => {
    const finalText = isEditing ? editableTranscript : transcript;
    if (!finalText) return;
    appendText(finalText + ' ');
    addToClipboard(finalText);
    Alert.alert('✓', 'متن کی بورڈ میں شامل کر دیا گیا۔');
  }, [transcript, editableTranscript, isEditing, appendText, addToClipboard]);

  const currentLang = VOICE_LANGUAGES.find(l => l.code === selectedLang);
  const modelInfo = WHISPER_MODELS[selectedModel];

  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: currentTheme.bg1 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={currentTheme.bg1} />
      <AnimatedBackground color1={currentTheme.accent} color2={currentTheme.glow} liveBg={liveBg} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={[styles.title, { color: currentTheme.accent }]}>🎵 آڈیو سے متن</Text>
          <Text style={styles.subtitle}>آف لائن Whisper انجن • بغیر انٹرنیٹ کے کام کرتا ہے</Text>
        </View>

        {/* Step 1: Model Selection */}
        <View style={[styles.card, { borderColor: `${currentTheme.accent}33` }]}>
          <Text style={[styles.stepLabel, { color: currentTheme.accent }]}>⚙️ Whisper ماڈل</Text>
          <View style={styles.modelRow}>
            {MODEL_OPTIONS.map(m => {
              const info = WHISPER_MODELS[m.id];
              const active = selectedModel === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setSelectedModel(m.id)}
                  style={[
                    styles.modelCard,
                    active && { borderColor: currentTheme.accent, backgroundColor: `${currentTheme.accent}22` },
                  ]}
                >
                  <Text style={styles.modelEmoji}>{m.emoji}</Text>
                  <Text style={[styles.modelName, active && { color: currentTheme.accent }]}>
                    {m.id.charAt(0).toUpperCase() + m.id.slice(1)}
                  </Text>
                  <Text style={styles.modelSize}>{info.sizeInMB}MB</Text>
                  <Text style={styles.modelAccuracy}>{info.accuracy}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={[styles.offlineBadge, { borderColor: Colors.green }]}>
            <MaterialIcons name="wifi-off" size={14} color={Colors.green} />
            <Text style={[styles.offlineText, { color: Colors.green }]}>
              مکمل آف لائن ◆ رازداری محفوظ ◆ تیز رفتار
            </Text>
          </View>
        </View>

        {/* Step 2: Pick File */}
        <View style={[styles.card, { borderColor: `${currentTheme.accent}33` }]}>
          <Text style={[styles.stepLabel, { color: currentTheme.accent }]}>① آڈیو فائل منتخب کریں</Text>
          <Pressable
            onPress={pickAudioFile}
            style={({ pressed }) => [
              styles.uploadBtn,
              { borderColor: currentTheme.accent, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <MaterialIcons name="audio-file" size={32} color={currentTheme.accent} />
            <Text style={[styles.uploadBtnText, { color: currentTheme.accent }]}>
              {selectedFile ? selectedFile.name : 'فائل منتخب کریں (MP3, WAV, M4A, OGG...)'}
            </Text>
            {selectedFile?.size && (
              <Text style={styles.fileMeta}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</Text>
            )}
          </Pressable>

          {selectedFile && (
            <Pressable
              onPress={playAudio}
              style={[styles.playBtn, { backgroundColor: `${currentTheme.glow}22`, borderColor: currentTheme.glow }]}
            >
              <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={22} color={currentTheme.glow} />
              <Text style={[styles.playBtnText, { color: currentTheme.glow }]}>
                {isPlaying ? 'روکیں' : 'سنیں'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Step 3: Language */}
        <View style={[styles.card, { borderColor: `${currentTheme.accent}33` }]}>
          <Text style={[styles.stepLabel, { color: currentTheme.accent }]}>② زبان منتخب کریں</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langRow}>
            {VOICE_LANGUAGES.map(lang => {
              const active = lang.code === selectedLang;
              return (
                <Pressable
                  key={lang.code}
                  onPress={() => setSelectedLang(lang.code)}
                  style={[
                    styles.langChip,
                    active && {
                      backgroundColor: `${currentTheme.accent}33`,
                      borderColor: currentTheme.accent,
                      shadowColor: currentTheme.accent,
                      shadowOpacity: 0.6,
                      shadowRadius: 6,
                      elevation: 6,
                    },
                  ]}
                >
                  <Text style={styles.langEmoji}>{lang.emoji}</Text>
                  <Text style={[styles.langLabel, active && { color: currentTheme.accent }]}>
                    {lang.nativeLabel}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Step 4: Transcribe */}
        <View style={[styles.card, { borderColor: `${currentTheme.accent}33` }]}>
          <Text style={[styles.stepLabel, { color: currentTheme.accent }]}>③ متن حاصل کریں</Text>
          <Pressable
            onPress={transcribeAudio}
            disabled={state === 'loading' || !selectedFile}
            style={({ pressed }) => [
              styles.transcribeBtn,
              {
                backgroundColor: currentTheme.accent,
                opacity: pressed || state === 'loading' || !selectedFile ? 0.6 : 1,
              },
            ]}
          >
            {state === 'loading' ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.transcribeBtnText}>تجزیہ جاری ہے... {progress}%</Text>
              </View>
            ) : (
              <Text style={styles.transcribeBtnText}>
                🎙️ {currentLang?.nativeLabel} میں متن بنائیں (آف لائن)
              </Text>
            )}
          </Pressable>

          {/* Progress Bar */}
          {state === 'loading' && (
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%` as any, backgroundColor: currentTheme.accent },
                ]}
              />
            </View>
          )}
        </View>

        {/* Transcript Result */}
        {state === 'done' && transcript ? (
          <View style={[styles.card, styles.resultCard, { borderColor: `${currentTheme.glow}44` }]}>
            <View style={styles.resultHeader}>
              <Text style={[styles.stepLabel, { color: currentTheme.glow }]}>✅ نتیجہ</Text>
              <Pressable onPress={() => setIsEditing(v => !v)}>
                <MaterialIcons
                  name={isEditing ? 'check' : 'edit'}
                  size={20}
                  color={currentTheme.glow}
                />
              </Pressable>
            </View>

            {isEditing ? (
              <TextInput
                value={editableTranscript}
                onChangeText={setEditableTranscript}
                style={[styles.editInput, { textAlign: currentLang?.rtl ? 'right' : 'left' }]}
                multiline
                selectionColor={currentTheme.accent}
              />
            ) : (
              <View style={styles.transcriptBox}>
                <Text
                  style={[
                    styles.transcriptText,
                    { textAlign: currentLang?.rtl ? 'right' : 'left' },
                  ]}
                  selectable
                >
                  {transcript}
                </Text>
              </View>
            )}

            <View style={styles.resultActions}>
              <Pressable
                onPress={handleUseText}
                style={[styles.actionBtn, { backgroundColor: currentTheme.accent }]}
              >
                <Text style={styles.actionBtnText}>📝 کی بورڈ میں شامل کریں</Text>
              </Pressable>
              <Pressable
                onPress={() => { setTranscript(''); setState('idle'); setSelectedFile(null); setProgress(0); }}
                style={[styles.actionBtn, { backgroundColor: 'rgba(255,75,110,0.3)', borderColor: Colors.red }]}
              >
                <Text style={[styles.actionBtnText, { color: Colors.red }]}>🗑️ صاف</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* Whisper Info */}
        <View style={[styles.noteCard, { borderColor: 'rgba(0,245,255,0.3)' }]}>
          <Text style={[styles.noteTitle, { color: currentTheme.accent }]}>🧠 Whisper آف لائن انجن</Text>
          <Text style={styles.noteText}>
            {'• Whisper.cpp مقامی ماڈل — کوئی ڈیٹا نہیں بھیجا جاتا\n'}
            {'• Android/iOS پر نیٹیو تعاون (react-native-whisper)\n'}
            {'• Urdu, Arabic, Hindi, English اور 99 زبانیں\n'}
            {'• مکمل نصب: react-native-whisper لنک کریں + ggml ماڈل ڈاؤن لوڈ کریں'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 100, gap: Spacing.md },
  headerBlock: { paddingTop: Spacing.md, gap: 4, alignItems: 'center' },
  title: { fontSize: FontSize.xxl, fontWeight: '900' },
  subtitle: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    gap: 10,
    shadowColor: '#6040ee',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  resultCard: { backgroundColor: 'rgba(220,255,240,0.92)', borderColor: 'rgba(0,180,100,0.30)' },
  stepLabel: { fontSize: FontSize.md, fontWeight: '800' },

  modelRow: { flexDirection: 'row', gap: 6 },
  modelCard: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(100,80,220,0.20)',
    backgroundColor: 'rgba(248,246,255,0.95)',
    paddingVertical: 8,
    shadowColor: '#6040ee',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  modelEmoji: { fontSize: 18 },
  modelName: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.text },
  modelSize: { fontSize: 9, color: Colors.textMuted },
  modelAccuracy: { fontSize: 9, color: '#cc8800' },

  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,255,136,0.06)',
  },
  offlineText: { fontSize: FontSize.xs, fontWeight: '700' },

  uploadBtn: {
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.70)',
  },
  uploadBtnText: { fontSize: FontSize.md, fontWeight: '700', textAlign: 'center' },
  fileMeta: { color: Colors.textDim, fontSize: FontSize.xs },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  playBtnText: { fontSize: FontSize.md, fontWeight: '700' },

  langRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(100,80,220,0.22)',
    backgroundColor: 'rgba(240,236,255,0.90)',
  },
  langEmoji: { fontSize: 16 },
  langLabel: { fontSize: FontSize.xs, color: Colors.text, fontWeight: '700' },

  transcribeBtn: {
    borderRadius: Radius.pill,
    paddingVertical: 13,
    alignItems: 'center',
  },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  transcribeBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.md },

  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: 4, borderRadius: 2 },

  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  transcriptBox: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    minHeight: 80,
  },
  transcriptText: {
    color: '#111',
    fontSize: FontSize.md,
    lineHeight: 26,
  },
  editInput: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    color: '#111',
    fontSize: FontSize.md,
    lineHeight: 26,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  resultActions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1,
    borderRadius: Radius.pill,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.sm },

  noteCard: {
    backgroundColor: 'rgba(230,248,255,0.92)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(0,150,200,0.25)',
    gap: 6,
    shadowColor: '#0090cc',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  noteTitle: { fontSize: FontSize.md, fontWeight: '800' },
  noteText: { color: Colors.textMuted, fontSize: FontSize.xs, lineHeight: 18, textAlign: 'right' },
});
