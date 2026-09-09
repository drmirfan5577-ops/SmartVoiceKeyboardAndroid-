// Powered by OnSpace.AI
import React, { memo, useState, useEffect, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, ScrollView,
  TextInput, Alert, Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AutoCorrect } from '@/services/autocorrect';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  accentColor: string;
  autoCorrectEnabled: boolean;
  onToggleAutoCorrect: (v: boolean) => void;
}

function AutoCorrectDictPanel({ visible, onClose, accentColor, autoCorrectEnabled, onToggleAutoCorrect }: Props) {
  const [customWords, setCustomWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState('');
  const [tab, setTab] = useState<'dict' | 'custom'>('dict');

  useEffect(() => {
    if (visible) {
      AutoCorrect.getCustomWords().then(setCustomWords);
    }
  }, [visible]);

  const handleAddWord = useCallback(async () => {
    const w = newWord.trim();
    if (!w || w.length < 2) {
      Alert.alert('', 'کم از کم 2 حروف درکار ہیں۔');
      return;
    }
    await AutoCorrect.addCustomWord(w);
    const updated = await AutoCorrect.getCustomWords();
    setCustomWords(updated);
    setNewWord('');
  }, [newWord]);

  const handleRemoveWord = useCallback(async (word: string) => {
    Alert.alert('حذف کریں؟', `"${word}" کو فہرست سے ہٹائیں؟`, [
      { text: 'نہیں', style: 'cancel' },
      {
        text: 'ہاں',
        style: 'destructive',
        onPress: async () => {
          await AutoCorrect.removeCustomWord(word);
          setCustomWords(prev => prev.filter(w => w !== word));
        },
      },
    ]);
  }, []);

  // Built-in correction entries (sample)
  const BUILTIN_ENTRIES = [
    { wrong: 'teh',      right: 'the'          },
    { wrong: 'recieve',  right: 'receive'       },
    { wrong: 'ھے',       right: 'ہے'            },
    { wrong: 'انشاللہ',  right: 'انشاءاللہ'   },
    { wrong: 'alot',     right: 'a lot'         },
    { wrong: 'beleive',  right: 'believe'       },
    { wrong: 'ھیں',      right: 'ہیں'           },
    { wrong: 'seperate', right: 'separate'      },
    { wrong: 'tommorow', right: 'tomorrow'      },
    { wrong: 'اسلاملیکم', right: 'السلام علیکم' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.panel, { backgroundColor: '#fff' }]}>
        <View style={[styles.handle, { backgroundColor: accentColor }]} />

        <View style={styles.header}>
          <Text style={[styles.title, { color: accentColor }]}>✏️ خودکار تصحیح</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <MaterialIcons name="close" size={22} color={Colors.textMuted} />
          </Pressable>
        </View>

        {/* Master Toggle */}
        <View style={[styles.toggleRow, { borderColor: `${accentColor}33`, backgroundColor: `${accentColor}08` }]}>
          <Text style={[styles.toggleLabel, { color: Colors.text }]}>خودکار تصحیح فعال</Text>
          <Switch
            value={autoCorrectEnabled}
            onValueChange={onToggleAutoCorrect}
            trackColor={{ false: Colors.border, true: `${accentColor}88` }}
            thumbColor={autoCorrectEnabled ? accentColor : Colors.textDim}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            onPress={() => setTab('dict')}
            style={[styles.tab, tab === 'dict' && { borderBottomColor: accentColor }]}
          >
            <Text style={[styles.tabText, { color: tab === 'dict' ? accentColor : Colors.textMuted }]}>
              📚 تصحیح فہرست
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab('custom')}
            style={[styles.tab, tab === 'custom' && { borderBottomColor: accentColor }]}
          >
            <Text style={[styles.tabText, { color: tab === 'custom' ? accentColor : Colors.textMuted }]}>
              ➕ اپنی فہرست ({customWords.length})
            </Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {tab === 'dict' ? (
            <>
              <Text style={[styles.hint, { color: Colors.textDim }]}>یہ خودکار اردو/انگریزی تصحیحات ہیں:</Text>
              {BUILTIN_ENTRIES.map((e, i) => (
                <View key={i} style={[styles.entryCard, { borderColor: `${accentColor}22`, backgroundColor: 'rgba(255,255,255,0.92)' }]}>
                  <Text style={[styles.wrongWord, { color: Colors.red }]}>{e.wrong}</Text>
                  <MaterialIcons name="arrow-forward" size={16} color={Colors.textDim} />
                  <Text style={[styles.rightWord, { color: Colors.green }]}>{e.right}</Text>
                </View>
              ))}
              <Text style={[styles.hint, { marginTop: 8, color: Colors.textDim }]}>
                ...اور بہت سی مزید تصحیحات شامل ہیں
              </Text>
            </>
          ) : (
            <>
              {/* Add Custom Word */}
              <View style={styles.addRow}>
                <TextInput
                  value={newWord}
                  onChangeText={setNewWord}
                  placeholder="نیا لفظ شامل کریں..."
                  placeholderTextColor={Colors.textDim}
                  style={[styles.input, { borderColor: `${accentColor}66`, color: Colors.text, backgroundColor: 'rgba(255,255,255,0.95)' }]}
                  returnKeyType="done"
                  onSubmitEditing={handleAddWord}
                />
                <Pressable
                  onPress={handleAddWord}
                  style={[styles.addBtn, { backgroundColor: accentColor }]}
                >
                  <MaterialIcons name="add" size={22} color="#fff" />
                </Pressable>
              </View>

              {customWords.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={[styles.emptyText, { color: Colors.textMuted }]}>کوئی کسٹم لفظ نہیں</Text>
                  <Text style={[styles.emptyHint, { color: Colors.textDim }]}>اپنے ذاتی الفاظ شامل کریں جو تصحیح نہ ہوں</Text>
                </View>
              ) : (
                customWords.map(word => (
                  <View key={word} style={[styles.wordCard, { borderColor: `${accentColor}22`, backgroundColor: 'rgba(255,255,255,0.92)' }]}>
                    <Text style={[styles.wordText, { color: Colors.text }]}>{word}</Text>
                    <Pressable onPress={() => handleRemoveWord(word)} hitSlop={8}>
                      <MaterialIcons name="delete-outline" size={20} color={Colors.red} />
                    </Pressable>
                  </View>
                ))
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  panel: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    maxHeight: '80%',
    borderTopWidth: 1,
    borderColor: 'rgba(100,80,255,0.15)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  title: { fontSize: FontSize.lg, fontWeight: '800' },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  toggleLabel: { fontSize: FontSize.md, fontWeight: '700' },

  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100,80,255,0.15)',
    marginBottom: Spacing.sm,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: FontSize.sm, fontWeight: '700' },

  scroll: { gap: 6, paddingBottom: 20 },
  hint: { fontSize: FontSize.xs, textAlign: 'right' },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  wrongWord: { fontSize: FontSize.md, fontWeight: '700', flex: 1, textAlign: 'right' },
  rightWord: { fontSize: FontSize.md, fontWeight: '700', flex: 1 },

  addRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: { alignItems: 'center', paddingTop: 40, gap: 8 },
  emptyText: { fontSize: FontSize.md },
  emptyHint: { fontSize: FontSize.sm, textAlign: 'center' },

  wordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  wordText: { fontSize: FontSize.md },
});

export default memo(AutoCorrectDictPanel);
