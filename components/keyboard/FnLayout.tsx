// Powered by OnSpace.AI
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Key from './Key';
import { FN_ROW1, FN_ROW2, FN_ROW3 } from '@/constants/keyboard';

interface Props {
  onFnPress: (key: string) => void;
  isCtrl: boolean;
  isAlt: boolean;
  isCaps: boolean;
  onCtrl: () => void;
  onAlt: () => void;
  onCaps: () => void;
}

function FnLayout({ onFnPress, isCtrl, isAlt, isCaps, onCtrl, onAlt, onCaps }: Props) {
  const renderKey = (k: string) => {
    if (k === 'Ctrl') return <Key key={k} label="Ctrl" onPress={onCtrl} variant="fn" isActive={isCtrl} />;
    if (k === 'Alt')  return <Key key={k} label="Alt"  onPress={onAlt}  variant="fn" isActive={isAlt} />;
    if (k === 'Caps') return <Key key={k} label="Caps" onPress={onCaps} variant="fn" isActive={isCaps} />;
    return <Key key={k} label={k} onPress={() => onFnPress(k)} variant="fn" />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {FN_ROW1.map(k => (
          <Key key={k} label={k} onPress={() => onFnPress(k)} variant="fn" />
        ))}
      </View>
      <View style={styles.row}>
        {FN_ROW2.map(k => renderKey(k))}
      </View>
      <View style={styles.row}>
        {FN_ROW3.map(k => renderKey(k))}
      </View>
      <View style={[styles.row, { justifyContent: 'center', gap: 4 }]}>
        <Key label="↑"     onPress={() => onFnPress('up')}     variant="fn" flex={1} />
        <Key label="↓"     onPress={() => onFnPress('down')}   variant="fn" flex={1} />
        <Key label="←"     onPress={() => onFnPress('left')}   variant="fn" flex={1} />
        <Key label="→"     onPress={() => onFnPress('right')}  variant="fn" flex={1} />
        <Key label="Enter" onPress={() => onFnPress('enter')}  variant="action" flex={2} />
        <Key label="⌫"     onPress={() => onFnPress('backspace')} variant="fn" flex={1.5} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 3 },
  row: { flexDirection: 'row' },
});

export default memo(FnLayout);
