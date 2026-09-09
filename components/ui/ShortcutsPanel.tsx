// Powered by OnSpace.AI
import React, { memo, useState, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, ScrollView, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { KEYBOARD_SHORTCUTS, ShortcutService, ShortcutResult } from '@/services/shortcuts';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  currentText: string;
  onTextChange: (text: string) => void;
  accentColor: string;
  history: { undo: string[]; redo: string[] };
}

function ShortcutsPanel({ visible, onClose, currentText, onTextChange, accentColor, history }: Props) {
  const [lastResult, setLastResult] = useState<ShortcutResult | null>(null);
  const [isCtrlActive, setIsCtrlActive] = useState(false);

  const handleShortcut = useCallback(async (key: string) => {
    if (!isCtrlActive) {
      setIsCtrlActive(true);
      setTimeout(() => setIsCtrlActive(false), 2000);
    }

    const result = await ShortcutService.execute(key, currentText, onTextChange, history);
    setLastResult(result);
    setTimeout(() => setLastResult(null), 2500);
  }, [isCtrlActive, currentText, onTextChange, history]);

  const shortcutKeys = Object.keys(KEYBOARD_SHORTCUTS);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.panel}>
        <View style={[styles.handle, { backgroundColor: accentColor }]} />

        <View style={styles.header}>
          <Text style={[styles.title, { color: accentColor }]}>⌨️ کی بورڈ شارٹ کٹس</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" size={22} color={Colors.textMuted} />
          </Pressable>
        </View>

        {/* Ctrl Indicator */}
        <View style={styles.ctrlRow}>
          <View style={[
            styles.ctrlKey,
            { borderColor: isCtrlActive ? accentColor : Colors.border,
              backgroundColor: isCtrlActive ? `${accentColor}33` : Colors.surface }
          ]}>
            <Text style={[styles.ctrlLabel, { color: isCtrlActive ? accentColor : Colors.textMuted }]}>
              Ctrl
            </Text>
          </View>
          <Text style={styles.ctrlHint}>
            {isCtrlActive ? '✓ فعال — کلید منتخب کریں' : 'نیچے سے شارٹ کٹ منتخب کریں'}
          </Text>
        </View>

        {/* Result Feedback */}
        {lastResult && (
          <View style={[
            styles.resultCard,
            { borderColor: lastResult.success ? accentColor : Colors.red,
              backgroundColor: lastResult.success ? `${accentColor}11` : 'rgba(255,75,110,0.1)' }
          ]}>
            <Text style={[styles.resultText, { color: lastResult.success ? accentColor : Colors.red }]}>
              {lastResult.message}
            </Text>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Shortcut Grid */}
          <View style={styles.grid}>
            {shortcutKeys.map(key => {
              const info = KEYBOARD_SHORTCUTS[key];
              return (
                <Pressable
                  key={key}
                  onPress={() => handleShortcut(key)}
                  style={({ pressed }) => [
                    styles.shortcutCard,
                    { borderColor: pressed ? accentColor : Colors.border,
                      backgroundColor: pressed ? `${accentColor}22` : Colors.surface,
                      transform: pressed ? [{ scale: 0.94 }] : [{ scale: 1 }] }
                  ]}
                >
                  <Text style={styles.shortcutIcon}>{info.icon}</Text>
                  <Text style={[styles.shortcutKey, { color: accentColor }]}>{info.label}</Text>
                  <Text style={styles.shortcutDesc} numberOfLines={2}>{info.description}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Common shortcuts list */}
          <Text style={styles.sectionLabel}>پیغام</Text>
          <View style={[styles.noteCard, { borderColor: `${accentColor}33` }]}>
            <Text style={styles.noteText}>
              {'💡 شارٹ کٹ استعمال:\n'}
              {'1. یہاں Ctrl+X بٹن دبائیں\n'}
              {'2. یا Fn کی بورڈ میں Ctrl کو آن کریں\n'}
              {'3. پھر حرف دبائیں\n\n'}
              {'مثال: Ctrl+C = کاپی | Ctrl+Z = واپس'}
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
    maxHeight: '82%',
    borderTopWidth: 2,
    borderColor: 'rgba(100,80,255,0.20)',
    shadowColor: '#6040ee',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  title: { fontSize: FontSize.lg, fontWeight: '800' },

  ctrlRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.sm },
  ctrlKey: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 2,
    minWidth: 60,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.80)',
  },
  ctrlLabel: { fontSize: FontSize.md, fontWeight: '900' },
  ctrlHint: { color: '#888', fontSize: FontSize.sm, flex: 1 },

  resultCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  resultText: { fontSize: FontSize.sm, fontWeight: '700', textAlign: 'center' },

  scroll: { gap: Spacing.md, paddingBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  shortcutCard: {
    width: '22%',
    alignItems: 'center',
    gap: 3,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.80)',
  },
  shortcutIcon: { fontSize: 18 },
  shortcutKey: { fontSize: FontSize.xs, fontWeight: '900' },
  shortcutDesc: { fontSize: 8, color: Colors.textDim, textAlign: 'center' },

  sectionLabel: { color: '#888', fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase' },
  noteCard: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    padding: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.80)',
    borderColor: 'rgba(100,80,255,0.22)',
  },
  noteText: { color: '#666', fontSize: FontSize.xs, lineHeight: 18, textAlign: 'right' },
});

export default memo(ShortcutsPanel);
