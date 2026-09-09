// Powered by OnSpace.AI
import React, { memo, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, FlatList, Modal,
  ScrollView,
} from 'react-native';
import { EMOJI_CATEGORIES } from '@/constants/emojis';
import { Colors, Radius, Spacing, FontSize } from '@/constants/theme';

interface Props {
  onPress: (emoji: string) => void;
  accentColor: string;
}

function EmojiLayout({ onPress, accentColor }: Props) {
  const [activeCat, setActiveCat] = useState(EMOJI_CATEGORIES[0].id);

  const currentCategory = EMOJI_CATEGORIES.find(c => c.id === activeCat) || EMOJI_CATEGORIES[0];

  const renderEmoji = useCallback(({ item }: { item: string }) => (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.emojiBtn,
        {
          backgroundColor: pressed ? `${accentColor}33` : 'rgba(255,255,255,0.07)',
          transform: [{ scale: pressed ? 0.85 : 1 }],
          borderColor: pressed ? accentColor : 'rgba(255,255,255,0.12)',
          shadowColor: accentColor,
          shadowOpacity: pressed ? 0.6 : 0,
          shadowRadius: 6,
          elevation: pressed ? 6 : 0,
        },
      ]}
    >
      <Text style={styles.emoji}>{item}</Text>
    </Pressable>
  ), [onPress, accentColor]);

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catRow}
      >
        {EMOJI_CATEGORIES.map(cat => {
          const active = cat.id === activeCat;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setActiveCat(cat.id)}
              style={[
                styles.catBtn,
                active && {
                  backgroundColor: `${accentColor}33`,
                  borderColor: accentColor,
                  shadowColor: accentColor,
                  shadowOpacity: 0.7,
                  shadowRadius: 6,
                  elevation: 6,
                },
              ]}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              {active && (
                <Text style={[styles.catLabel, { color: accentColor }]}>{cat.label}</Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Emoji Grid */}
      <FlatList
        data={currentCategory.emojis}
        renderItem={renderEmoji}
        keyExtractor={(item, i) => `${item}-${i}`}
        numColumns={8}
        style={styles.grid}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        initialNumToRender={32}
        getItemLayout={(_, index) => ({ length: 44, offset: 44 * Math.floor(index / 8), index })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  catScroll: { flexGrow: 0 },
  catRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  catIcon: { fontSize: 16 },
  catLabel: { fontSize: FontSize.xs, fontWeight: '700' },
  grid: { maxHeight: 180 },
  gridContent: {
    paddingHorizontal: 2,
  },
  emojiBtn: {
    width: '12.5%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginBottom: 2,
  },
  emoji: { fontSize: 22 },
});

export default memo(EmojiLayout);
