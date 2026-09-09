// Powered by OnSpace.AI
import React, { memo, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, Modal, ScrollView,
  TextInput, Alert, FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, FontSize } from '@/constants/theme';
import { Phrase, PhrasesService } from '@/services/phrases';

interface Props {
  visible: boolean;
  onClose: () => void;
  phrases: Phrase[];
  onPhraseInsert: (text: string) => void;
  onPhraseChange: (phrases: Phrase[]) => void;
  accentColor: string;
}

const EMOJIS = ['🙏','😊','📞','✉️','🌐','❤️','🤲','📝','💬','🎯','⭐','🔥','✅','📌','💡'];

function QuickPhrasesPanel({ visible, onClose, phrases, onPhraseInsert, onPhraseChange, accentColor }: Props) {
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newText, setNewText] = useState('');
  const [newEmoji, setNewEmoji] = useState('📝');

  const handleInsert = useCallback((phrase: Phrase) => {
    onPhraseInsert(phrase.text);
    onClose();
  }, [onPhraseInsert, onClose]);

  const handleAdd = useCallback(async () => {
    if (!newText.trim()) {
      Alert.alert('', 'متن درج کریں۔');
      return;
    }
    const updated = await PhrasesService.save({
      label: newLabel || newText.slice(0, 12),
      text: newText.trim(),
      emoji: newEmoji,
      lang: newText.match(/[\u0600-\u06FF]/) ? 'ur' : 'en',
    });
    onPhraseChange(updated);
    setAdding(false);
    setNewLabel('');
    setNewText('');
    setNewEmoji('📝');
  }, [newLabel, newText, newEmoji, onPhraseChange]);

  const handleDelete = useCallback(async (id: string) => {
    Alert.alert('حذف کریں؟', 'کیا آپ یہ فقرہ حذف کرنا چاہتے ہیں؟', [
      { text: 'نہیں', style: 'cancel' },
      {
        text: 'ہاں',
        style: 'destructive',
        onPress: async () => {
          const updated = await PhrasesService.delete(id);
          onPhraseChange(updated);
        },
      },
    ]);
  }, [onPhraseChange]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={[styles.panel, { borderColor: `${accentColor}44` }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: accentColor }]}>⚡ فوری فقرات</Text>
          <Pressable
            onPress={() => setAdding(v => !v)}
            style={[styles.addBtn, { backgroundColor: `${accentColor}22`, borderColor: accentColor }]}
          >
            <MaterialIcons name={adding ? 'close' : 'add'} size={18} color={accentColor} />
            <Text style={[styles.addBtnText, { color: accentColor }]}>{adding ? 'منسوخ' : 'نیا فقرہ'}</Text>
          </Pressable>
        </View>

        {/* Add Form */}
        {adding && (
          <View style={[styles.form, { borderColor: `${accentColor}33` }]}>
            <Text style={styles.formLabel}>ایموجی منتخب کریں:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiPicker}>
              {EMOJIS.map(e => (
                <Pressable
                  key={e}
                  onPress={() => setNewEmoji(e)}
                  style={[styles.emojiBtn, newEmoji === e && { backgroundColor: `${accentColor}33` }]}
                >
                  <Text style={styles.emojiText}>{e}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <TextInput
              style={[styles.input, { borderColor: `${accentColor}55`, color: Colors.text }]}
              placeholder="لیبل (اختیاری)"
              placeholderTextColor={Colors.textDim}
              value={newLabel}
              onChangeText={setNewLabel}
            />
            <TextInput
              style={[styles.input, styles.inputMultiline, { borderColor: `${accentColor}55`, color: Colors.text }]}
              placeholder="فقرہ یہاں لکھیں..."
              placeholderTextColor={Colors.textDim}
              value={newText}
              onChangeText={setNewText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Pressable
              onPress={handleAdd}
              style={[styles.saveBtn, { backgroundColor: accentColor }]}
            >
              <Text style={styles.saveBtnText}>✓ محفوظ کریں</Text>
            </Pressable>
          </View>
        )}

        {/* Phrases Grid */}
        <FlatList
          data={phrases}
          keyExtractor={item => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          ListEmptyComponent={
            <Text style={styles.empty}>ابھی کوئی فقرہ نہیں۔ نیا فقرہ شامل کریں!</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleInsert(item)}
              onLongPress={() => handleDelete(item.id)}
              style={({ pressed }) => [
                styles.phraseCard,
                {
                  borderColor: `${accentColor}33`,
                  backgroundColor: pressed ? `${accentColor}22` : 'rgba(255,255,255,0.07)',
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text style={styles.phraseEmoji}>{item.emoji}</Text>
              <Text style={[styles.phraseLabel, { color: accentColor }]} numberOfLines={1}>{item.label}</Text>
              <Text style={styles.phraseText} numberOfLines={2}>{item.text}</Text>
            </Pressable>
          )}
        />

        <Text style={styles.hint}>طویل دبائیں = حذف کریں</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    backgroundColor: '#f0f4ff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(100,80,255,0.20)',
    maxHeight: '75%',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 16,
    shadowColor: '#6040ee',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: { fontSize: FontSize.xl, fontWeight: '800' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  addBtnText: { fontSize: FontSize.sm, fontWeight: '700' },
  form: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(100,80,255,0.22)',
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: 8,
  },
  formLabel: { color: '#888', fontSize: FontSize.sm },
  emojiPicker: { flexDirection: 'row', marginBottom: 4 },
  emojiBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  emojiText: { fontSize: 20 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    padding: Spacing.sm,
    color: Colors.text,
    fontSize: FontSize.md,
    textAlign: 'right',
    borderColor: 'rgba(100,80,255,0.3)',
  },
  inputMultiline: { minHeight: 70 },
  saveBtn: {
    borderRadius: Radius.pill,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.md },
  grid: { paddingBottom: 8 },
  gridRow: { gap: 8, marginBottom: 8 },
  phraseCard: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    padding: Spacing.sm,
    gap: 3,
    minHeight: 80,
    backgroundColor: 'rgba(255,255,255,0.80)',
  },
  phraseEmoji: { fontSize: 22 },
  phraseLabel: { fontSize: FontSize.sm, fontWeight: '800' },
  phraseText: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 16, textAlign: 'right' },
  hint: { textAlign: 'center', color: '#888', fontSize: FontSize.xs, marginTop: 8 },
  empty: { color: '#888', textAlign: 'center', padding: 20, fontSize: FontSize.sm },
});

export default memo(QuickPhrasesPanel);
