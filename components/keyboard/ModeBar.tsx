// Powered by OnSpace.AI
import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { KeyboardMode } from '@/constants/keyboard';
import { Radius, Spacing, FontSize } from '@/constants/theme';

interface Props {
  mode: KeyboardMode;
  onSwitch: (m: KeyboardMode) => void;
  accentColor: string;
}

const MODES: { key: KeyboardMode; label: string }[] = [
  { key: 'urdu',    label: 'اردو' },
  { key: 'english', label: 'Eng' },
  { key: 'sindhi',  label: 'سنڌي' },
  { key: 'symbols', label: '؟#' },
  { key: 'emoji',   label: '😀' },
  { key: 'fn',      label: 'Fn' },
];

function ModeBar({ mode, onSwitch, accentColor }: Props) {
  return (
    <View style={styles.outer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {MODES.map(m => {
          const active = m.key === mode;
          return (
            <Pressable
              key={m.key}
              onPress={() => onSwitch(m.key)}
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: active ? accentColor : 'rgba(255,255,255,0.88)',
                  borderColor: active ? accentColor : `${accentColor}44`,
                  shadowColor: accentColor,
                  shadowOpacity: active ? 0.9 : 0.15,
                  shadowRadius: active ? 12 : 3,
                  elevation: active ? 10 : 2,
                  transform: pressed ? [{ scale: 0.93 }] : [{ scale: 1 }],
                },
              ]}
            >
              <Text style={[
                styles.label,
                {
                  color: active ? '#fff' : accentColor,
                  textShadowColor: active ? `${accentColor}99` : 'transparent',
                  textShadowRadius: active ? 8 : 0,
                  fontWeight: active ? '900' : '700',
                },
              ]}>
                {m.label}
              </Text>
              {active && <View style={[styles.tubeGlow, { backgroundColor: accentColor }]} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { marginBottom: Spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    gap: 5,
    paddingVertical: 2,
  },
  btn: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  label: {
    fontSize: FontSize.md,
    letterSpacing: 0.3,
  },
  tubeGlow: {
    position: 'absolute',
    bottom: 0,
    left: '15%',
    right: '15%',
    height: 3,
    borderRadius: 2,
    opacity: 0.6,
  },
});

export default memo(ModeBar);
