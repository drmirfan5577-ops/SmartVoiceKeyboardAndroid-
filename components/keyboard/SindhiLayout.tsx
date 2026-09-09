// Powered by OnSpace.AI
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Key from './Key';
import { SINDHI_ROWS } from '@/constants/keyboard';

interface Props {
  onPress: (ch: string) => void;
}

function SindhiLayout({ onPress }: Props) {
  return (
    <View style={styles.container}>
      {SINDHI_ROWS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map(ch => (
            <Key key={ch} label={ch} onPress={() => onPress(ch)} variant="default" />
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

export default memo(SindhiLayout);
