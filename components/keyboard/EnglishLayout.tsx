// Powered by OnSpace.AI
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Key from './Key';
import { ENGLISH_ROWS } from '@/constants/keyboard';
import { Spacing } from '@/constants/theme';

interface Props {
  onPress: (ch: string) => void;
  isShift: boolean;
  isCaps: boolean;
  onShift: () => void;
  onCaps: () => void;
}

function EnglishLayout({ onPress, isShift, isCaps, onShift }: Props) {
  const display = (ch: string) => (isShift || isCaps) ? ch.toUpperCase() : ch;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {ENGLISH_ROWS[0].map(ch => (
          <Key key={ch} label={display(ch)} onPress={() => onPress(display(ch))} variant="default" />
        ))}
      </View>
      <View style={[styles.row, { justifyContent: 'center' }]}>
        {ENGLISH_ROWS[1].map(ch => (
          <Key key={ch} label={display(ch)} onPress={() => onPress(display(ch))} variant="default" />
        ))}
      </View>
      <View style={styles.row}>
        <Key label="⇧" onPress={onShift} variant="fn" flex={1.2} isActive={isShift} />
        {ENGLISH_ROWS[2].map(ch => (
          <Key key={ch} label={display(ch)} onPress={() => onPress(display(ch))} variant="default" />
        ))}
        <Key label="⌫" onPress={() => onPress('__BACKSPACE__')} variant="fn" flex={1.2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 3 },
  row: { flexDirection: 'row' },
});

export default memo(EnglishLayout);
