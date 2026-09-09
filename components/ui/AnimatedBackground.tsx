// Powered by OnSpace.AI
import React, { useEffect, useRef, memo } from 'react';
import { View, Animated, StyleSheet, Dimensions, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

import { LiveBgType } from '@/constants/theme';

interface Props {
  color1: string;
  color2: string;
  liveBg?: LiveBgType;
}

// Bright glowing orb — uses only Animated.timing (safe with useNativeDriver on Hermes)
function BrightOrb({ color, style, delay = 0 }: { color: string; style: any; delay?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 7000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 7000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -40] });
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.18, 0.35, 0.18] });
  return (
    <Animated.View
      style={[styles.orb, { backgroundColor: color, opacity, transform: [{ translateY }] }, style]}
    />
  );
}

// Floating bubble
function Bubble({ color, x, delay, size }: { color: string; x: number; delay: number; size: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 6000 + delay * 200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }, delay * 300);
    return () => clearTimeout(t);
  }, []);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [height + 20, -size - 20] });
  const opacity = anim.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 0.5, 0.5, 0] });
  const scale = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.7, 1, 0.7] });
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { scale }],
      }}
    />
  );
}

// Sparkle — Animated.delay NOT supported with useNativeDriver; use setTimeout + timing only
function Sparkle({ color, x, y, delay }: { color: string; x: number; y: number; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  // Pre-compute pause duration so it is stable across loop iterations
  const pauseDur = useRef(1500 + delay * 100).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          // "pause" — animate to same value so no visual change, but gives timing gap
          Animated.timing(anim, {
            toValue: 0,
            duration: pauseDur,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay * 200);
    return () => clearTimeout(t);
  }, []);
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.7] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
  return (
    <Animated.View style={{ position: 'absolute', left: x, top: y, opacity, transform: [{ scale }] }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
    </Animated.View>
  );
}

// Wave line
function WaveBar({ color, yPos, delay }: { color: string; yPos: number; delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-50, 50] });
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: yPos,
        left: 0,
        right: 0,
        height: 3,
        borderRadius: 2,
        backgroundColor: color,
        opacity: 0.22,
        transform: [{ translateX }],
      }}
    />
  );
}

function AnimatedBackground({ color1, color2, liveBg = 'none' }: Props) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Base bright glow orbs — always present */}
      <BrightOrb color={color1} style={{ top: -40, left: width * 0.1 }} delay={0} />
      <BrightOrb color={color2} style={{ top: height * 0.3, right: -40 }} delay={2000} />
      <BrightOrb color={color1} style={{ bottom: 60, left: width * 0.3 }} delay={3500} />

      {liveBg === 'bubbles' && [0, 1, 2, 3, 4, 5, 6].map(i => (
        <Bubble
          key={i}
          color={i % 2 === 0 ? color1 : color2}
          x={(width / 7) * i}
          delay={i}
          size={18 + i * 6}
        />
      ))}

      {liveBg === 'sparkles' && Array.from({ length: 16 }).map((_, i) => (
        <Sparkle
          key={i}
          color={i % 2 === 0 ? color1 : color2}
          x={(width / 16) * i + 8}
          y={(height / 4) * (i % 4) + 30}
          delay={i}
        />
      ))}

      {liveBg === 'waves' && [0.15, 0.35, 0.55, 0.72].map((pos, i) => (
        <WaveBar
          key={i}
          color={i % 2 === 0 ? color1 : color2}
          yPos={height * pos}
          delay={i * 700}
        />
      ))}

      {liveBg === 'stars' && Array.from({ length: 12 }).map((_, i) => (
        <Sparkle
          key={i}
          color={i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : '#ffc107'}
          x={Math.floor((width / 12) * i + (i * 7) % 30)}
          y={Math.floor((height / 6) * (i % 6) + 20)}
          delay={i * 3}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
});

export default memo(AnimatedBackground);
