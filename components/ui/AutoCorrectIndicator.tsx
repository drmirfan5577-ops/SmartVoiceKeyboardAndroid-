// Powered by OnSpace.AI
import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';

interface Props {
  original: string;
  corrected: string;
  visible: boolean;
  onAccept: () => void;
  onDismiss: () => void;
  accentColor: string;
}

function AutoCorrectIndicator({ original, corrected, visible, onAccept, onDismiss, accentColor }: Props) {
  if (!visible || !corrected) return null;

  return (
    <View style={[styles.container, { borderColor: `${accentColor}55` }]}>
      <View style={styles.textRow}>
        <Text style={[styles.label, { color: accentColor }]}>خودکار تصحیح:</Text>
        <Text style={styles.original}>{original}</Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={[styles.corrected, { color: accentColor }]}>{corrected}</Text>
      </View>
      <View style={styles.btnRow}>
        <Pressable
          onPress={onAccept}
          style={[styles.btn, { backgroundColor: `${accentColor}22`, borderColor: accentColor }]}
        >
          <Text style={[styles.btnText, { color: accentColor }]}>✓ قبول</Text>
        </Pressable>
        <Pressable
          onPress={onDismiss}
          style={[styles.btn, { backgroundColor: 'rgba(255,75,110,0.12)', borderColor: Colors.red }]}
        >
          <Text style={[styles.btnText, { color: Colors.red }]}>✕ رد</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1.5,
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    shadowColor: '#6040ee',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  label: { fontSize: FontSize.xs, fontWeight: '700' },
  original: { color: Colors.red, fontSize: FontSize.sm, fontWeight: '600', textDecorationLine: 'line-through' },
  arrow: { color: '#888', fontSize: FontSize.sm },
  corrected: { fontSize: FontSize.sm, fontWeight: '800' },
  btnRow: { flexDirection: 'row', gap: 5 },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  btnText: { fontSize: FontSize.xs, fontWeight: '700' },
});

export default memo(AutoCorrectIndicator);
