// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, FlatList, Pressable, StyleSheet, StatusBar,
  ScrollView, TextInput, Alert, Modal, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { THEMES, LiveBgType } from '@/constants/theme';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';

// Live background picker options
const LIVE_BG_OPTIONS: { id: LiveBgType; label: string; emoji: string; desc: string }[] = [
  { id: 'none',     label: 'بند',      emoji: '◻️', desc: 'لائیو بیک گراؤنڈ بند' },
  { id: 'sparkles', label: 'چمک',      emoji: '✨', desc: 'چمکتے نقطے' },
  { id: 'bubbles',  label: 'بلبلے',    emoji: '🫧', desc: 'اڑتے بلبلے' },
  { id: 'waves',    label: 'لہریں',    emoji: '🌊', desc: 'روشن لہریں' },
  { id: 'stars',    label: 'ستارے',    emoji: '⭐', desc: 'ٹمٹماتے ستارے' },
];

// Custom Theme Builder
function CustomThemeBuilder({ accentColor, onClose, onApply }: {
  accentColor: string;
  onClose: () => void;
  onApply: (theme: any) => void;
}) {
  const [name, setName] = useState('میری تھیم');
  const [emoji, setEmoji] = useState('🌟');
  const [bg1, setBg1] = useState('#f5f0ff');
  const [bg2, setBg2] = useState('#ede8ff');
  const [accent, setAccent] = useState('#6040ee');
  const [glow, setGlow] = useState('#9060ff');

  const PRESET_COMBOS = [
    { label: 'نیلا', bg1: '#f0f8ff', bg2: '#d8eeff', accent: '#1155cc', glow: '#4488ff' },
    { label: 'گلابی', bg1: '#fff0f8', bg2: '#ffd8ee', accent: '#cc1166', glow: '#ff44aa' },
    { label: 'نارنجی', bg1: '#fff8f0', bg2: '#ffe8cc', accent: '#cc5500', glow: '#ff8800' },
    { label: 'سبز', bg1: '#f0fff8', bg2: '#d0f8e4', accent: '#007744', glow: '#00cc77' },
    { label: 'یاقوتی', bg1: '#fff5f5', bg2: '#ffd8d8', accent: '#cc1122', glow: '#ff4455' },
    { label: 'آسمانی', bg1: '#f0fdff', bg2: '#c8f0ff', accent: '#006699', glow: '#00bbdd' },
    { label: 'بنفشی', bg1: '#fdf0ff', bg2: '#f0d0ff', accent: '#8800bb', glow: '#cc44ff' },
    { label: 'سنہری', bg1: '#fffbf0', bg2: '#fff0c0', accent: '#997700', glow: '#ddaa00' },
  ];

  const BG_COLORS = [
    '#ffffff','#f8f9ff','#fff8f8','#f8fff8','#fff8ff','#fffff8',
    '#f0f0ff','#fff0f0','#f0fff0','#f0ffff','#fff0ff','#ffff f0',
    '#ffe8e8','#e8f8ff','#e8ffe8','#ffe8ff','#e8ffff','#ffffe8',
  ];

  const ACCENT_COLORS = [
    '#4040ee','#6040cc','#0066cc','#cc0044','#008844','#cc6600',
    '#880088','#006688','#cc4400','#0088aa','#cc0088','#447700',
    '#1155cc','#cc1155','#115511','#8811cc','#cc8800','#008888',
  ];

  const applyCombo = (c: typeof PRESET_COMBOS[0]) => {
    setBg1(c.bg1); setBg2(c.bg2); setAccent(c.accent); setGlow(c.glow);
  };

  const ColorPicker = ({ label, value, onChange, colors }: {
    label: string; value: string; onChange: (c: string) => void; colors: string[];
  }) => (
    <View style={styles.cpSection}>
      <Text style={styles.cpLabel}>{label}</Text>
      <View style={styles.cpRow}>
        {colors.map(c => (
          <Pressable
            key={c}
            onPress={() => onChange(c)}
            style={[
              styles.cpSwatch,
              { backgroundColor: c, borderColor: value === c ? accentColor : 'rgba(0,0,0,0.12)' },
              value === c && styles.cpSwatchActive,
            ]}
          >
            {value === c && <MaterialIcons name="check" size={12} color={value === '#ffffff' ? '#000' : '#fff'} />}
          </Pressable>
        ))}
      </View>
      <View style={styles.cpCurrentRow}>
        <View style={[styles.cpCurrent, { backgroundColor: value }]} />
        <Text style={styles.cpCurrentText}>{value}</Text>
      </View>
    </View>
  );

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={[styles.builderRoot, { backgroundColor: bg1 }]}>
        {/* Toolbar */}
        <View style={[styles.builderToolbar, { backgroundColor: bg1, borderBottomColor: `${accent}44` }]}>
          <Pressable onPress={onClose} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={accent} />
          </Pressable>
          <Text style={[styles.builderTitle, { color: accent }]}>🎨 کسٹم تھیم بنائیں</Text>
          <Pressable
            onPress={() => onApply({ id: `custom_${Date.now()}`, name, emoji, bg1, bg2, accent, glow, dark: false })}
            style={[styles.applyBtn, { backgroundColor: accent }]}
          >
            <Text style={styles.applyBtnText}>لگائیں</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.builderScroll} showsVerticalScrollIndicator={false}>
          {/* Preview */}
          <View style={[styles.previewCard, { backgroundColor: bg2, borderColor: `${accent}55` }]}>
            <Text style={[styles.previewTitle, { color: accent }]}>{emoji} {name}</Text>
            <View style={styles.previewKeyRow}>
              {['ا','ب','پ','ت','ث','Aa','1','@'].map(k => (
                <View key={k} style={[styles.previewKey, { backgroundColor: 'rgba(255,255,255,0.92)', borderColor: `${accent}44`, shadowColor: accent }]}>
                  <Text style={[styles.previewKeyText, { color: accent }]}>{k}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.previewAccentBar, { backgroundColor: accent }]} />
            <View style={[styles.previewGlowBar, { backgroundColor: glow }]} />
          </View>

          {/* Name & Emoji */}
          <View style={styles.nameRow}>
            <TextInput
              value={emoji}
              onChangeText={setEmoji}
              style={[styles.emojiInput, { borderColor: `${accent}44` }]}
              maxLength={2}
            />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="تھیم کا نام..."
              style={[styles.nameInput, { borderColor: `${accent}44`, color: Colors.text, flex: 1 }]}
              placeholderTextColor={Colors.textDim}
            />
          </View>

          {/* Quick Combos */}
          <Text style={[styles.sectionLabel, { color: accent }]}>⚡ تیار کمبی نیشنز</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.combosScroll}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {PRESET_COMBOS.map(c => (
                <Pressable key={c.label} onPress={() => applyCombo(c)}
                  style={[styles.comboChip, { backgroundColor: c.bg2, borderColor: c.accent }]}>
                  <View style={[styles.comboDot, { backgroundColor: c.accent }]} />
                  <Text style={[styles.comboLabel, { color: c.accent }]}>{c.label}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <ColorPicker label="بیک گراؤنڈ 1 (اوپر)" value={bg1} onChange={setBg1} colors={BG_COLORS} />
          <ColorPicker label="بیک گراؤنڈ 2 (نیچے)" value={bg2} onChange={setBg2} colors={BG_COLORS} />
          <ColorPicker label="ایکسنٹ رنگ (بٹنز)" value={accent} onChange={setAccent} colors={ACCENT_COLORS} />
          <ColorPicker label="گلو رنگ (چمک)" value={glow} onChange={setGlow} colors={ACCENT_COLORS} />
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function ThemesScreen() {
  const insets = useSafeAreaInsets();
  const { themeId, setThemeId, currentTheme, liveBg, setLiveBg } = useApp();
  const [showBuilder, setShowBuilder] = useState(false);
  const [customTheme, setCustomTheme] = useState<any | null>(null);

  const allThemes = customTheme ? [customTheme, ...THEMES] : THEMES;

  const handleApplyCustom = (theme: any) => {
    setCustomTheme(theme);
    setThemeId(theme.id);
    setShowBuilder(false);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: currentTheme.bg1 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={currentTheme.bg1} />
      <AnimatedBackground color1={currentTheme.accent} color2={currentTheme.glow} liveBg={liveBg} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: currentTheme.accent }]}>🎨 تھیمز</Text>
          <Pressable
            onPress={() => setShowBuilder(true)}
            style={[styles.buildBtn, { backgroundColor: currentTheme.accent }]}
          >
            <MaterialIcons name="palette" size={16} color="#fff" />
            <Text style={styles.buildBtnText}>کسٹم بنائیں</Text>
          </Pressable>
        </View>

        {/* Live Background Section */}
        <View style={[styles.sectionCard, { borderColor: `${currentTheme.accent}44` }]}>
          <Text style={[styles.sectionTitle, { color: currentTheme.accent }]}>✨ لائیو بیک گراؤنڈ</Text>
          <View style={styles.liveBgRow}>
            {LIVE_BG_OPTIONS.map(opt => {
              const active = liveBg === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setLiveBg(opt.id)}
                  style={[
                    styles.liveBgChip,
                    {
                      backgroundColor: active ? currentTheme.accent : 'rgba(255,255,255,0.88)',
                      borderColor: active ? currentTheme.accent : `${currentTheme.accent}44`,
                      shadowColor: currentTheme.accent,
                      shadowOpacity: active ? 0.7 : 0.1,
                      shadowRadius: active ? 10 : 2,
                      elevation: active ? 8 : 1,
                    },
                  ]}
                >
                  <Text style={styles.liveBgEmoji}>{opt.emoji}</Text>
                  <Text style={[styles.liveBgLabel, { color: active ? '#fff' : currentTheme.accent }]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[styles.liveBgDesc, { color: Colors.textMuted }]}>
            {LIVE_BG_OPTIONS.find(o => o.id === liveBg)?.desc || ''}
          </Text>
        </View>

        {/* Theme Grid */}
        <Text style={[styles.sectionTitle, { color: currentTheme.accent, marginBottom: 10 }]}>🎨 10 روشن تھیمز</Text>
        <View style={styles.grid}>
          {allThemes.map(item => {
            const active = item.id === themeId;
            return (
              <Pressable
                key={item.id}
                onPress={() => setThemeId(item.id)}
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: item.bg2,
                    borderColor: active ? item.accent : `${item.accent}44`,
                    shadowColor: item.accent,
                    shadowOpacity: active ? 0.7 : 0.15,
                    shadowRadius: active ? 14 : 4,
                    elevation: active ? 12 : 3,
                    transform: pressed ? [{ scale: 0.95 }] : active ? [{ scale: 1.03 }] : [{ scale: 1 }],
                  },
                ]}
              >
                <View style={[styles.cardInner, { backgroundColor: item.bg1 }]}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                  <Text style={[styles.themeLabel, { color: item.accent }]}>{item.name}</Text>
                  {/* Simulated keyboard keys */}
                  <View style={styles.miniKeys}>
                    {['ا', 'ب', 'Aa'].map(k => (
                      <View key={k} style={[styles.miniKey, {
                        backgroundColor: 'rgba(255,255,255,0.90)',
                        borderColor: `${item.accent}55`,
                        shadowColor: item.accent,
                        shadowOpacity: 0.4,
                        shadowRadius: 4,
                        elevation: 4,
                      }]}>
                        <Text style={[styles.miniKeyText, { color: item.accent }]}>{k}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.colorDots}>
                    {[item.bg1, item.bg2, item.accent, item.glow].map((c, i) => (
                      <View key={i} style={[styles.dot, { backgroundColor: c, borderColor: `${c}88` }]} />
                    ))}
                  </View>
                  {active && (
                    <View style={[styles.checkBadge, { backgroundColor: item.accent }]}>
                      <MaterialIcons name="check" size={14} color="#fff" />
                    </View>
                  )}
                  {item.id.startsWith('custom_') && (
                    <View style={[styles.customBadge, { backgroundColor: Colors.gold }]}>
                      <Text style={styles.customBadgeText}>کسٹم</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Custom Theme Builder */}
      {showBuilder && (
        <CustomThemeBuilder
          accentColor={currentTheme.accent}
          onClose={() => setShowBuilder(false)}
          onApply={handleApplyCustom}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.md, paddingBottom: 100, gap: Spacing.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
  title: { fontSize: FontSize.xl, fontWeight: '800' },
  buildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    shadowColor: '#6040ee',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  buildBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.sm },

  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    gap: 10,
    shadowColor: '#6040ee',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800' },
  liveBgRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  liveBgChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  liveBgEmoji: { fontSize: 16 },
  liveBgLabel: { fontSize: FontSize.sm, fontWeight: '700' },
  liveBgDesc: { fontSize: FontSize.xs, textAlign: 'center' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    borderRadius: Radius.lg,
    borderWidth: 2,
    overflow: 'hidden',
    minHeight: 150,
    shadowOffset: { width: 0, height: 0 },
  },
  cardInner: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    position: 'relative',
    minHeight: 150,
  },
  emoji: { fontSize: 28 },
  themeLabel: { fontSize: FontSize.md, fontWeight: '900' },
  miniKeys: { flexDirection: 'row', gap: 4, marginVertical: 2 },
  miniKey: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
  },
  miniKeyText: { fontSize: 11, fontWeight: '800' },
  colorDots: { flexDirection: 'row', gap: 5, marginTop: 2 },
  dot: { width: 11, height: 11, borderRadius: 6, borderWidth: 1 },
  checkBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  customBadge: {
    position: 'absolute', top: 8, left: 8,
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: Radius.pill,
  },
  customBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },

  // Builder styles
  builderRoot: { flex: 1 },
  builderToolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: 12, borderBottomWidth: 1,
  },
  builderTitle: { fontSize: FontSize.lg, fontWeight: '800' },
  applyBtn: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: Radius.pill },
  applyBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.sm },
  builderScroll: { padding: Spacing.lg, gap: 16, paddingBottom: 60 },

  previewCard: {
    borderRadius: Radius.lg,
    borderWidth: 2,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  previewTitle: { fontSize: FontSize.xl, fontWeight: '900' },
  previewKeyRow: { flexDirection: 'row', gap: 5, flexWrap: 'wrap', justifyContent: 'center' },
  previewKey: {
    paddingHorizontal: 10, paddingVertical: 8,
    borderRadius: Radius.sm, borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 6,
  },
  previewKeyText: { fontSize: 15, fontWeight: '800' },
  previewAccentBar: { height: 6, width: '80%', borderRadius: 3, opacity: 0.8 },
  previewGlowBar: { height: 3, width: '60%', borderRadius: 2, opacity: 0.5 },

  nameRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  emojiInput: {
    width: 48, height: 48, borderWidth: 1.5, borderRadius: Radius.md,
    textAlign: 'center', fontSize: 22, backgroundColor: 'rgba(255,255,255,0.88)',
  },
  nameInput: {
    borderWidth: 1.5, borderRadius: Radius.md,
    paddingHorizontal: 12, paddingVertical: 10,
    fontSize: FontSize.md, backgroundColor: 'rgba(255,255,255,0.88)',
  },

  sectionLabel: { fontSize: FontSize.md, fontWeight: '800' },
  combosScroll: { marginBottom: 4 },
  comboChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: Radius.pill, borderWidth: 2,
  },
  comboDot: { width: 10, height: 10, borderRadius: 5 },
  comboLabel: { fontSize: FontSize.sm, fontWeight: '800' },

  cpSection: { gap: 8 },
  cpLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted },
  cpRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cpSwatch: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
  },
  cpSwatchActive: { borderWidth: 3, transform: [{ scale: 1.2 }] },
  cpCurrentRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cpCurrent: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)' },
  cpCurrentText: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '700' },
});
