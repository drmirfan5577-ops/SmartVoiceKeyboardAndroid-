// Powered by OnSpace.AI
import React, { memo, useState, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, TextInput, Switch, ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentText: string;
  onTextChange: (text: string) => void;
  accentColor: string;
}

interface MatchResult {
  count: number;
  preview: string[];
}

function findMatches(text: string, find: string, caseSensitive: boolean, wholeWord: boolean): MatchResult {
  if (!find.trim() || !text) return { count: 0, preview: [] };

  let pattern = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (wholeWord) pattern = `\\b${pattern}\\b`;
  const flags = caseSensitive ? 'g' : 'gi';

  try {
    const regex = new RegExp(pattern, flags);
    const matches = text.match(regex) || [];

    // Build preview snippets
    const previewRegex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
    const snippets: string[] = [];
    let m: RegExpExecArray | null;
    let idx = 0;
    while ((m = previewRegex.exec(text)) !== null && idx < 3) {
      const start = Math.max(0, m.index - 20);
      const end = Math.min(text.length, m.index + find.length + 20);
      snippets.push(
        (start > 0 ? '...' : '') +
        text.slice(start, end) +
        (end < text.length ? '...' : '')
      );
      idx++;
    }

    return { count: matches.length, preview: snippets };
  } catch {
    return { count: 0, preview: [] };
  }
}

function replaceAll(
  text: string,
  find: string,
  replace: string,
  caseSensitive: boolean,
  wholeWord: boolean
): string {
  if (!find.trim()) return text;
  let pattern = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (wholeWord) pattern = `\\b${pattern}\\b`;
  const flags = caseSensitive ? 'g' : 'gi';
  try {
    return text.replace(new RegExp(pattern, flags), replace);
  } catch {
    return text;
  }
}

function replaceOne(
  text: string,
  find: string,
  replace: string,
  caseSensitive: boolean,
  wholeWord: boolean
): string {
  if (!find.trim()) return text;
  let pattern = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (wholeWord) pattern = `\\b${pattern}\\b`;
  const flags = caseSensitive ? '' : 'i';
  try {
    return text.replace(new RegExp(pattern, flags), replace);
  } catch {
    return text;
  }
}

function FindReplacePanel({ visible, onClose, currentText, onTextChange, accentColor }: Props) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const matchResult = findText.trim()
    ? findMatches(currentText, findText, caseSensitive, wholeWord)
    : { count: 0, preview: [] };

  const handleReplaceOne = useCallback(() => {
    if (!findText.trim()) return;
    const newText = replaceOne(currentText, findText, replaceText, caseSensitive, wholeWord);
    if (newText !== currentText) {
      onTextChange(newText);
      setLastAction(`1 تبدیل کیا گیا`);
    } else {
      setLastAction('کوئی مطابقت نہیں ملی');
    }
    setTimeout(() => setLastAction(null), 2500);
  }, [findText, replaceText, caseSensitive, wholeWord, currentText, onTextChange]);

  const handleReplaceAll = useCallback(() => {
    if (!findText.trim()) return;
    const newText = replaceAll(currentText, findText, replaceText, caseSensitive, wholeWord);
    const diff = matchResult.count;
    if (newText !== currentText) {
      onTextChange(newText);
      setLastAction(`${diff} جگہ تبدیل کیا گیا`);
    } else {
      setLastAction('کوئی مطابقت نہیں ملی');
    }
    setTimeout(() => setLastAction(null), 2500);
  }, [findText, replaceText, caseSensitive, wholeWord, currentText, onTextChange, matchResult.count]);

  const handleClear = useCallback(() => {
    setFindText('');
    setReplaceText('');
    setLastAction(null);
  }, []);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.panel, { borderTopColor: `${accentColor}44` }]}>
        <View style={[styles.handle, { backgroundColor: accentColor }]} />

        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="find-replace" size={22} color={accentColor} />
          <Text style={[styles.title, { color: accentColor }]}>تلاش اور تبدیل</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <MaterialIcons name="close" size={22} color={Colors.textMuted} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Find Input */}
          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, { color: accentColor }]}>🔍 تلاش کریں</Text>
            <View style={[styles.inputRow, { borderColor: findText ? accentColor : 'rgba(100,80,255,0.25)' }]}>
              <TextInput
                value={findText}
                onChangeText={setFindText}
                placeholder="تلاش کا متن..."
                placeholderTextColor={Colors.textDim}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {findText ? (
                <Pressable onPress={() => setFindText('')} hitSlop={8}>
                  <MaterialIcons name="close" size={18} color={Colors.textDim} />
                </Pressable>
              ) : null}
            </View>
          </View>

          {/* Replace Input */}
          <View style={styles.fieldBlock}>
            <Text style={[styles.fieldLabel, { color: accentColor }]}>✏️ تبدیل کریں</Text>
            <View style={[styles.inputRow, { borderColor: replaceText ? accentColor : 'rgba(100,80,255,0.25)' }]}>
              <TextInput
                value={replaceText}
                onChangeText={setReplaceText}
                placeholder="نیا متن (خالی = حذف)..."
                placeholderTextColor={Colors.textDim}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {replaceText ? (
                <Pressable onPress={() => setReplaceText('')} hitSlop={8}>
                  <MaterialIcons name="close" size={18} color={Colors.textDim} />
                </Pressable>
              ) : null}
            </View>
          </View>

          {/* Options Row */}
          <View style={styles.optionsRow}>
            <View style={[styles.optionCard, { borderColor: caseSensitive ? accentColor : 'rgba(100,80,255,0.18)' }]}>
              <Text style={[styles.optionLabel, caseSensitive && { color: accentColor }]}>Aa حساس</Text>
              <Switch
                value={caseSensitive}
                onValueChange={setCaseSensitive}
                trackColor={{ false: '#ddd', true: `${accentColor}55` }}
                thumbColor={caseSensitive ? accentColor : '#bbb'}
              />
            </View>
            <View style={[styles.optionCard, { borderColor: wholeWord ? accentColor : 'rgba(100,80,255,0.18)' }]}>
              <Text style={[styles.optionLabel, wholeWord && { color: accentColor }]}>پورا لفظ</Text>
              <Switch
                value={wholeWord}
                onValueChange={setWholeWord}
                trackColor={{ false: '#ddd', true: `${accentColor}55` }}
                thumbColor={wholeWord ? accentColor : '#bbb'}
              />
            </View>
          </View>

          {/* Match Count Badge */}
          {findText.trim() ? (
            <View style={[
              styles.matchBadge,
              {
                backgroundColor: matchResult.count > 0 ? `${accentColor}15` : 'rgba(255,75,110,0.10)',
                borderColor: matchResult.count > 0 ? `${accentColor}44` : 'rgba(255,75,110,0.3)',
              },
            ]}>
              <MaterialIcons
                name={matchResult.count > 0 ? 'search' : 'search-off'}
                size={16}
                color={matchResult.count > 0 ? accentColor : Colors.red}
              />
              <Text style={[
                styles.matchCount,
                { color: matchResult.count > 0 ? accentColor : Colors.red },
              ]}>
                {matchResult.count > 0
                  ? `${matchResult.count} مطابقت ملی`
                  : 'کوئی مطابقت نہیں'}
              </Text>
            </View>
          ) : null}

          {/* Preview Snippets */}
          {matchResult.preview.length > 0 && (
            <View style={[styles.previewBlock, { borderColor: `${accentColor}22` }]}>
              <Text style={[styles.previewTitle, { color: accentColor }]}>پیش نظارہ</Text>
              {matchResult.preview.map((snippet, i) => (
                <Text key={i} style={styles.previewSnippet} numberOfLines={2}>
                  {snippet}
                </Text>
              ))}
            </View>
          )}

          {/* Last Action Feedback */}
          {lastAction && (
            <View style={[styles.feedbackCard, { borderColor: `${accentColor}44`, backgroundColor: `${accentColor}12` }]}>
              <MaterialIcons name="check-circle" size={18} color={accentColor} />
              <Text style={[styles.feedbackText, { color: accentColor }]}>{lastAction}</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleReplaceOne}
              disabled={!findText.trim() || matchResult.count === 0}
              style={({ pressed }) => [
                styles.actionBtn,
                {
                  backgroundColor: `${accentColor}22`,
                  borderColor: accentColor,
                  opacity: !findText.trim() || matchResult.count === 0 ? 0.4 : pressed ? 0.7 : 1,
                },
              ]}
            >
              <MaterialIcons name="find-replace" size={16} color={accentColor} />
              <Text style={[styles.actionBtnText, { color: accentColor }]}>پہلی تبدیلی</Text>
            </Pressable>

            <Pressable
              onPress={handleReplaceAll}
              disabled={!findText.trim() || matchResult.count === 0}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.actionBtnPrimary,
                {
                  backgroundColor: accentColor,
                  opacity: !findText.trim() || matchResult.count === 0 ? 0.4 : pressed ? 0.8 : 1,
                },
              ]}
            >
              <MaterialIcons name="repeat" size={16} color="#fff" />
              <Text style={styles.actionBtnPrimaryText}>
                سب تبدیل ({matchResult.count})
              </Text>
            </Pressable>
          </View>

          <Pressable onPress={handleClear} style={styles.clearBtn}>
            <MaterialIcons name="clear-all" size={16} color={Colors.textDim} />
            <Text style={styles.clearBtnText}>صاف کریں</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.38)' },
  panel: {
    backgroundColor: '#f5f2ff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 44,
    maxHeight: '88%',
    borderTopWidth: 2,
    shadowColor: '#6040ee',
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 22,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: 'center', marginTop: 10, marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  title: {
    flex: 1,
    fontSize: FontSize.lg,
    fontWeight: '900',
  },
  scroll: { gap: Spacing.md, paddingBottom: 16 },

  fieldBlock: { gap: 5 },
  fieldLabel: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: Radius.md,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    shadowColor: '#6040ee',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: '#111',
    includeFontPadding: false,
  },

  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textMuted,
  },

  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  matchCount: {
    fontSize: FontSize.sm,
    fontWeight: '800',
  },

  previewBlock: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    padding: Spacing.sm,
    gap: 6,
  },
  previewTitle: {
    fontSize: FontSize.xs,
    fontWeight: '800',
    marginBottom: 2,
  },
  previewSnippet: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 16,
    fontFamily: 'monospace',
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(100,80,255,0.25)',
  },

  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    padding: Spacing.sm,
  },
  feedbackText: {
    fontSize: FontSize.sm,
    fontWeight: '800',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Radius.pill,
    borderWidth: 2,
  },
  actionBtnPrimary: {
    borderWidth: 0,
    shadowColor: '#6040ee',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionBtnText: { fontSize: FontSize.sm, fontWeight: '800' },
  actionBtnPrimaryText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '800' },

  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
  },
  clearBtnText: { fontSize: FontSize.xs, color: Colors.textDim, fontWeight: '600' },
});

export default memo(FindReplacePanel);
