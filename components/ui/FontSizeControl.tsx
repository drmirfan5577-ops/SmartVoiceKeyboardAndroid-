// Powered by OnSpace.AI
import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, FontSize } from '@/constants/theme';

interface Props {
  value: number;
  onChange: (v: number) => void;
  accentColor: string;
}

function FontSizeControl({ value, onChange, accentColor }: Props) {
  const decrease = () => onChange(Math.max(12, value - 2));
  const increase = () => onChange(Math.min(30, value + 2));

  return (
    <View style={styles.container}>
      <Text style={styles.labelSmall}>چھوٹا</Text>
      <Pressable onPress={decrease} style={[styles.btn, { borderColor: accentColor }]}>
        <Text style={[styles.btnText, { color: accentColor }]}>−</Text>
      </Pressable>
      <Text style={[styles.sizeLabel, { color: accentColor }]}>{value}px</Text>
      <Pressable onPress={increase} style={[styles.btn, { borderColor: accentColor }]}>
        <Text style={[styles.btnText, { color: accentColor }]}>+</Text>
      </Pressable>
      <Text style={styles.labelBig}>بڑا</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
    borderWidth: 1.5,
    borderColor: 'rgba(100,80,255,0.25)',
  },
  labelSmall: { fontSize: FontSize.xs, color: '#888' },
  labelBig:   { fontSize: FontSize.xs, color: '#888' },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  btnText: { fontSize: 18, fontWeight: '700', lineHeight: 22 },
  sizeLabel: { fontSize: FontSize.sm, fontWeight: '700', minWidth: 38, textAlign: 'center' },
});

export default memo(FontSizeControl);
