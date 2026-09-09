// Powered by OnSpace.AI
// Bright, luminous keyboard key component — crystal clear, tube-light glow
import React, { memo } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { FontSize, Radius } from '@/constants/theme';

type KeyVariant = 'default' | 'num' | 'sym' | 'fn' | 'voice' | 'space' | 'wide' | 'action';

interface KeyProps {
  label: string;
  onPress: () => void;
  variant?: KeyVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isActive?: boolean;
  flex?: number;
  disabled?: boolean;
}

// Bright luminous key color config
const KEY_CONFIG: Record<KeyVariant, {
  bg: string; border: string; glow: string; textColor: string; fontSize: number;
  activeBg: string; pressedBg: string;
}> = {
  default: {
    bg: 'rgba(255,255,255,0.92)',
    border: 'rgba(100,80,220,0.35)',
    glow: '#6040ee',
    textColor: '#2a006a',
    fontSize: FontSize.key,
    activeBg: '#6040ee',
    pressedBg: 'rgba(96,64,238,0.18)',
  },
  num: {
    bg: 'rgba(255,248,210,0.95)',
    border: 'rgba(200,140,0,0.50)',
    glow: '#e69000',
    textColor: '#6a3800',
    fontSize: FontSize.keyNum,
    activeBg: '#e69000',
    pressedBg: 'rgba(230,144,0,0.22)',
  },
  sym: {
    bg: 'rgba(220,248,255,0.95)',
    border: 'rgba(0,150,200,0.45)',
    glow: '#0090cc',
    textColor: '#003a5a',
    fontSize: FontSize.key,
    activeBg: '#0090cc',
    pressedBg: 'rgba(0,144,204,0.20)',
  },
  fn: {
    bg: 'rgba(238,234,255,0.95)',
    border: 'rgba(100,70,220,0.40)',
    glow: '#5040cc',
    textColor: '#2a006a',
    fontSize: FontSize.keyFn,
    activeBg: '#5040cc',
    pressedBg: 'rgba(80,64,204,0.20)',
  },
  voice: {
    bg: '#ff2244',
    border: '#ff0033',
    glow: '#ff4466',
    textColor: '#ffffff',
    fontSize: 20,
    activeBg: '#dd0022',
    pressedBg: '#ff4466',
  },
  space: {
    bg: 'rgba(248,246,255,0.95)',
    border: 'rgba(96,64,238,0.30)',
    glow: '#7060ee',
    textColor: 'rgba(40,0,100,0.55)',
    fontSize: FontSize.sm,
    activeBg: '#7060ee',
    pressedBg: 'rgba(112,96,238,0.15)',
  },
  wide: {
    bg: 'rgba(238,234,255,0.95)',
    border: 'rgba(100,70,220,0.40)',
    glow: '#5040cc',
    textColor: '#2a006a',
    fontSize: FontSize.sm,
    activeBg: '#5040cc',
    pressedBg: 'rgba(80,64,204,0.20)',
  },
  action: {
    bg: '#6040ee',
    border: '#8060ff',
    glow: '#8060ff',
    textColor: '#ffffff',
    fontSize: FontSize.keyFn,
    activeBg: '#4020cc',
    pressedBg: '#7050f8',
  },
};

function Key({ label, onPress, variant = 'default', style, textStyle, isActive, flex = 1, disabled }: KeyProps) {
  const cfg = KEY_CONFIG[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.key,
        {
          flex,
          backgroundColor: isActive ? cfg.activeBg : pressed ? cfg.pressedBg : cfg.bg,
          borderColor: isActive ? cfg.glow : pressed ? cfg.glow : cfg.border,
          // Tube-light style glowing shadow
          shadowColor: cfg.glow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: pressed || isActive ? 1 : 0.5,
          shadowRadius: pressed || isActive ? 12 : 5,
          elevation: pressed || isActive ? 12 : 4,
          transform: pressed ? [{ scale: 0.90 }] : [{ scale: 1 }],
          opacity: disabled ? 0.35 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.keyText,
          {
            fontSize: cfg.fontSize,
            color: isActive ? '#fff' : cfg.textColor,
            // Crystal-clear text glow
            textShadowColor: isActive ? '#fff' : cfg.glow,
            textShadowRadius: isActive ? 4 : 2,
            fontWeight: '700',
          },
          textStyle,
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
      >
        {label}
      </Text>
      {/* Bottom tube-glow line */}
      {(isActive) && (
        <></>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  key: {
    height: 40,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1.5,
    overflow: 'hidden',
    paddingHorizontal: 2,
  },
  keyText: {
    textAlign: 'center',
  },
});

export default memo(Key);
