// Powered by OnSpace.AI
// Professional voice response display with real-time partial text overlay
import React, { memo, useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Share, Platform,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, FontSize } from '@/constants/theme';
import { TextFormatting } from '@/components/ui/TextFormattingPanel';

interface Props {
  text: string;
  fontSize: number;
  isRTL: boolean;
  accentColor: string;
  partialText?: string;
  isListening?: boolean;
  onCopy?: () => void;
  onClear?: () => void;
  onFormatPress?: () => void;
  onTTSPress?: () => void;
  onExportPress?: () => void;
  onShortcutsPress?: () => void;
  onFindReplacePress?: () => void;
  formatting?: TextFormatting;
}

async function shareText(text: string) {
  if (!text.trim()) return;
  try {
    await Share.share({ message: text, title: 'SMART Voice Keyboard' }, { dialogTitle: 'متن شیئر کریں' });
  } catch {}
}

function getFormattedTextStyle(f?: TextFormatting, baseFontSize?: number) {
  if (!f) return {};
  const familyMap: Record<string, string | undefined> = {
    default: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    serif: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    monospace: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  };
  return {
    fontWeight: f.bold ? ('700' as const) : ('400' as const),
    fontStyle: f.italic ? ('italic' as const) : ('normal' as const),
    textDecorationLine: f.underline && f.strikethrough
      ? ('underline line-through' as const)
      : f.underline ? ('underline' as const)
      : f.strikethrough ? ('line-through' as const)
      : ('none' as const),
    fontFamily: familyMap[f.fontFamily] || undefined,
    color: f.textColor || '#111',
    backgroundColor: f.highlight !== 'transparent' ? f.highlight : undefined,
    lineHeight: (baseFontSize || 18) * (f.lineSpacing || 1.6),
  };
}

function TextDisplay({
  text, fontSize, isRTL, accentColor, partialText = '', isListening = false,
  onCopy, onClear, onFormatPress, onTTSPress, onExportPress, onShortcutsPress,
  onFindReplacePress, formatting,
}: Props) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = [...text].length;

  // Voice response banner: show for 3 seconds after listening ends with new text
  const [showVoiceResponse, setShowVoiceResponse] = useState(false);
  const [lastVoiceText, setLastVoiceText] = useState('');
  const bannerOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isListening && partialText === '' && lastVoiceText !== text && text.length > 0) {
      const newWords = text.slice(lastVoiceText.length).trim();
      if (newWords.length > 2) {
        setShowVoiceResponse(true);
        setLastVoiceText(text);
        Animated.sequence([
          Animated.timing(bannerOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.timing(bannerOpacity, { toValue: 1, duration: 2500, useNativeDriver: true }),
          Animated.timing(bannerOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start(() => setShowVoiceResponse(false));
      }
    }
  }, [isListening, partialText, text]);

  const textAlign = formatting?.align === 'center'
    ? 'center'
    : formatting?.align === 'left' ? 'left'
    : isRTL || formatting?.align === 'rtl' ? 'right'
    : 'left';

  const formattedStyle = getFormattedTextStyle(formatting, fontSize);

  // Compose display: main text + partial (voice live preview)
  const mainText = text || '';

  return (
    <View style={[styles.container, { borderColor: accentColor, shadowColor: accentColor }]}>
      {/* ── Voice Live Partial Text Overlay ── */}
      {isListening && partialText ? (
        <View style={[styles.partialBanner, { backgroundColor: `${accentColor}14`, borderColor: `${accentColor}44` }]}>
          <View style={styles.partialBannerInner}>
            <View style={[styles.micDot, { backgroundColor: Colors.red }]} />
            <Text style={[styles.partialBannerText, { color: accentColor }]} numberOfLines={3}>
              {partialText}
            </Text>
          </View>
        </View>
      ) : null}

      {/* ── Voice Success Response Banner ── */}
      {showVoiceResponse && (
        <Animated.View style={[styles.voiceResponseBanner, {
          backgroundColor: `${accentColor}18`,
          borderColor: `${accentColor}55`,
          opacity: bannerOpacity,
        }]}>
          <MaterialIcons name="check-circle" size={16} color={accentColor} />
          <Text style={[styles.voiceResponseText, { color: accentColor }]}>
            وائس متن شامل ہو گیا
          </Text>
        </Animated.View>
      )}

      {/* ── Main Text Area ── */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.text,
            { fontSize, textAlign, writingDirection: isRTL ? 'rtl' : 'ltr' },
            formattedStyle,
          ]}
          selectable
        >
          {mainText || ' '}
          <Text style={[styles.cursor, { color: accentColor }]}>|</Text>
        </Text>
      </ScrollView>

      {/* ── Stats Row ── */}
      <View style={[styles.statsRow, { backgroundColor: `${accentColor}08` }]}>
        <Text style={[styles.stat, { color: accentColor }]}>{wordCount} الفاظ</Text>
        <Text style={[styles.stat, { color: accentColor }]}>{charCount} حروف</Text>
        {isListening && (
          <View style={[styles.liveTag, { backgroundColor: `${accentColor}22`, borderColor: accentColor }]}>
            <View style={[styles.liveDot, { backgroundColor: Colors.red }]} />
            <Text style={[styles.liveTagText, { color: accentColor }]}>LIVE</Text>
          </View>
        )}
        {formatting?.bold && <Text style={styles.statBadge}>B</Text>}
        {formatting?.italic && <Text style={styles.statBadge}>I</Text>}
        {formatting?.underline && <Text style={styles.statBadge}>U</Text>}
      </View>

      {/* ── Toolbar Row 1: primary actions ── */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={onCopy} style={styles.toolBtn} activeOpacity={0.7}>
          <MaterialIcons name="content-copy" size={14} color={Colors.textMuted} />
          <Text style={styles.toolBtnText}>کاپی</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => shareText(text)}
          style={[styles.toolBtn, styles.shareBtn, { borderColor: accentColor }]}
          activeOpacity={0.7}
        >
          <MaterialIcons name="share" size={14} color={accentColor} />
          <Text style={[styles.toolBtnText, { color: accentColor, fontWeight: '800' }]}>شیئر</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClear} style={styles.toolBtn} activeOpacity={0.7}>
          <MaterialIcons name="delete-outline" size={14} color={Colors.red} />
          <Text style={[styles.toolBtnText, { color: Colors.red }]}>صاف</Text>
        </TouchableOpacity>
      </View>

      {/* ── Toolbar Row 2: advanced tools ── */}
      <View style={[styles.toolbar, styles.toolbar2]}>
        <TouchableOpacity onPress={onFormatPress} style={styles.toolBtn2} activeOpacity={0.7}>
          <MaterialIcons name="format-bold" size={14} color={Colors.textMuted} />
          <Text style={styles.toolBtnText2}>فارمیٹ</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onTTSPress} style={styles.toolBtn2} activeOpacity={0.7}>
          <MaterialIcons name="volume-up" size={14} color={Colors.textMuted} />
          <Text style={styles.toolBtnText2}>TTS</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onExportPress} style={styles.toolBtn2} activeOpacity={0.7}>
          <MaterialIcons name="download" size={14} color={Colors.textMuted} />
          <Text style={styles.toolBtnText2}>برآمد</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onFindReplacePress} style={styles.toolBtn2} activeOpacity={0.7}>
          <MaterialIcons name="find-replace" size={14} color={Colors.textMuted} />
          <Text style={styles.toolBtnText2}>تلاش</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onShortcutsPress} style={styles.toolBtn2} activeOpacity={0.7}>
          <MaterialIcons name="keyboard" size={14} color={Colors.textMuted} />
          <Text style={styles.toolBtnText2}>شارٹ کٹ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: Radius.lg,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },

  // Partial voice text
  partialBanner: {
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  partialBannerInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  micDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
    opacity: 0.9,
  },
  partialBannerText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'right',
    fontStyle: 'italic',
  },

  // Voice response confirmation banner
  voiceResponseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderBottomWidth: 1,
  },
  voiceResponseText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },

  scroll: {
    minHeight: 70,
    maxHeight: 130,
    padding: Spacing.sm,
  },
  text: {
    color: '#111',
    lineHeight: 28,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  cursor: { fontWeight: '900' },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  stat: { fontSize: 10, fontWeight: '700' },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  liveTagText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#555',
    backgroundColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    backgroundColor: 'rgba(96,64,238,0.07)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(96,64,238,0.12)',
  },
  toolbar2: {
    backgroundColor: 'rgba(96,64,238,0.05)',
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(96,64,238,0.10)',
  },
  shareBtn: { borderWidth: 1, backgroundColor: 'transparent' },
  toolBtnText: { fontSize: FontSize.xs, color: '#333', fontWeight: '600' },
  toolBtn2: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 5,
  },
  toolBtnText2: { fontSize: 9, color: Colors.textMuted, fontWeight: '600' },
});

export default memo(TextDisplay);
