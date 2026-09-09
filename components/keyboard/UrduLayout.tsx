// Powered by OnSpace.AI
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Key from './Key';
import { URDU_ROWS } from '@/constants/keyboard';
import { Spacing } from '@/constants/theme';

interface Props {
  onPress: (ch: string) => void;
}

function UrduLayout({ onPress }: Props) {
  return (
    <View style={styles.container}>
      {URDU_ROWS.map((row, ri) => (
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

export default memo(UrduLayout);
