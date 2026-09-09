// Powered by OnSpace.AI
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Key from './Key';
import { SYMBOLS_ROWS } from '@/constants/keyboard';

interface Props {
  onPress: (ch: string) => void;
}

function SymbolsLayout({ onPress }: Props) {
  return (
    <View style={styles.container}>
      {SYMBOLS_ROWS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map(ch => (
            <Key key={ch} label={ch} onPress={() => onPress(ch)} variant="sym" />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 3 },
  row: { flexDirection: 'row', justifyContent: 'center' },
});

export default memo(SymbolsLayout);
