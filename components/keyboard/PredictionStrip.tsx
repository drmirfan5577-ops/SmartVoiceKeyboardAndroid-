// Powered by OnSpace.AI
import React, { memo, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { PredictionService } from '@/services/prediction';
import { Colors, Radius, FontSize, Spacing } from '@/constants/theme';

interface Props {
  text: string;
  mode: string;
  accentColor: string;
  onSelect: (word: string) => void;
}

function PredictionStrip({ text, mode, accentColor, onSelect }: Props) {
  const [predictions, setPredictions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const lang = mode === 'urdu' ? 'ur' : mode === 'sindhi' ? 'sd' : 'en';

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!text) {
        setPredictions([]);
        return;
      }
      setLoading(true);
      const preds = await PredictionService.getPredictions(text, lang);
      if (!cancelled) {
        setPredictions(preds);
        setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, lang]);

  const handleSelect = useCallback((word: string) => {
    onSelect(word + ' ');
    PredictionService.learnWord(word);
  }, [onSelect]);

  if (predictions.length === 0 && !loading) return null;

  return (
    <View style={[styles.container, { borderColor: `${accentColor}33` }]}>
      {loading ? (
        <ActivityIndicator size="small" color={accentColor} style={{ marginHorizontal: 8 }} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.strip}
        >
          {predictions.map((word, i) => (
            <Pressable
              key={`${word}-${i}`}
              onPress={() => handleSelect(word)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: pressed ? `${accentColor}33` : `${accentColor}15`,
                  borderColor: `${accentColor}55`,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
            >
              <Text style={[styles.chipText, { color: accentColor }]}>{word}</Text>
            </Pressable>
          ))}
          <View style={styles.divider} />
          <Text style={styles.hint}>💡 الفاظ</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(100,80,255,0.22)',
    minHeight: 38,
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    gap: 6,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  chipText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 4,
  },
  hint: {
    fontSize: FontSize.xs,
    color: '#aaa',
    paddingRight: 8,
  },
});

export default memo(PredictionStrip);
