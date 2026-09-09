// Powered by OnSpace.AI
import React, { memo, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface Props {
  volume: number;
  color: string;
  isActive: boolean;
  barCount?: number;
}

function WaveformAnimation({ volume, color, isActive, barCount = 12 }: Props) {
  const animations = useRef(
    Array.from({ length: barCount }, () => new Animated.Value(0.15))
  ).current;

  // Pre-compute random values once so they are stable across loop iterations
  const randomVals = useRef(
    Array.from({ length: barCount }, () => ({
      hi: 0.3 + Math.random() * 0.65,
      lo: 0.15 + Math.random() * 0.25,
      durHi: 180 + Math.floor(Math.random() * 160),
      durLo: 180 + Math.floor(Math.random() * 160),
    }))
  ).current;

  useEffect(() => {
    if (!isActive) {
      // Stop all — animate to rest with timing (spring not needed here)
      animations.forEach(a => {
        Animated.timing(a, {
          toValue: 0.15,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      });
      return;
    }

    // Stagger bar animations via setTimeout
    // Use Animated.timing only inside sequences — spring is unreliable in sequences with useNativeDriver on Hermes
    const timers: ReturnType<typeof setTimeout>[] = [];
    const loops: Animated.CompositeAnimation[] = [];

    animations.forEach((anim, i) => {
      const rv = randomVals[i];
      const t = setTimeout(() => {
        const loop = Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: rv.hi,
              duration: rv.durHi,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: rv.lo,
              duration: rv.durLo,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        );
        loops.push(loop);
        loop.start();
      }, i * 40);
      timers.push(t);
    });

    return () => {
      timers.forEach(clearTimeout);
      loops.forEach(l => l.stop());
    };
  }, [isActive]);

  // Volume boost — use timing only, never spring
  useEffect(() => {
    if (!isActive || volume <= 0) return;
    const normalized = Math.min(1, Math.max(0, volume / 10));
    const mid = Math.floor(barCount / 2);
    animations.forEach((a, i) => {
      const dist = Math.abs(i - mid);
      const boost = normalized * (1 - dist / Math.max(mid, 1)) * 0.5;
      Animated.timing(a, {
        toValue: 0.3 + boost,
        duration: 80,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  }, [volume, isActive]);

  return (
    <View style={styles.container}>
      {animations.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              backgroundColor: color,
              shadowColor: color,
              transform: [{ scaleY: anim }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 32,
    paddingHorizontal: 4,
  },
  bar: {
    width: 3,
    height: 24,
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default memo(WaveformAnimation);
