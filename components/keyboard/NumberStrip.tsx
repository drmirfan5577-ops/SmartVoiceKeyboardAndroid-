// Powered by OnSpace.AI
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Key from './Key';
import { NUMBER_ROW } from '@/constants/keyboard';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface Props {
  onPress: (ch: string) => void;
}

function NumberStrip({ onPress }: Props) {
  return (
    <View style={styles.strip}>
      <View style={styles.row}>
        {NUMBER_ROW.map(n => (
          <Key key={n} label={n} onPress={() => onPress(n)} variant="num" />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    backgroundColor: 'rgba(255,240,180,0.80)',
    borderRadius: Radius.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.xs,
    borderWidth: 1.5,
    borderColor: 'rgba(200,140,0,0.40)',
    shadowColor: '#e69000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
  },
});

export default memo(NumberStrip);
