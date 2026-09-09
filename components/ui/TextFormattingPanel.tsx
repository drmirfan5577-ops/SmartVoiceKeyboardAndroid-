// Powered by OnSpace.AI
import React, { memo, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';

export interface TextFormatting {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  align: 'left' | 'center' | 'right' | 'rtl';
  fontFamily: string;
  textColor: string;
  highlight: string;
  lineSpacing: number;
}

// Export DEFAULT_FORMAT at declaration to prevent any Hermes module resolution issues
export const DEFAULT_FORMAT: TextFormatting = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  align: 'right',
  fontFamily: 'default',
  textColor: '#111111',
  highlight: 'transparent',
  lineSpacing: 1.6,
};

const FONT_FAMILIES = [
  { id: 'default',   label: 'پہلے سے',  sample: 'Abc اردو' },
  { id: 'serif',     label: 'Serif',    sample: 'Abc اردو' },
  { id: 'monospace', label: 'Mono',     sample: 'Abc 123'  },
];

const TEXT_COLORS = [
  { hex: '#111111', label: 'سیاہ'    },
  { hex: '#1a237e', label: 'نیلا'    },
  { hex: '#b71c1c', label: 'سرخ'     },
  { hex: '#1b5e20', label: 'سبز'     },
  { hex: '#f57f17', label: 'نارنجی'  },
  { hex: '#4a148c', label: 'بنفشی'   },
  { hex: '#ffffff', label: 'سفید'    },
];

const HIGHLIGHT_COLORS = [
  { hex: 'transparent', label: 'بند'   },
  { hex: '#fff9c4',     label: 'پیلا'  },
  { hex: '#c8e6c9',     label: 'سبز'   },
  { hex: '#bbdefb',     label: 'نیلا'  },
  { hex: '#ffccbc',     label: 'نارنجی' },
  { hex: '#f8bbd0',     label: 'گلابی'  },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  formatting: TextFormatting;
  onChange: (f: TextFormatting) => void;
  accentColor: string;
}

function TextFormattingPanel({ visible, onClose, formatting, onChange, accentColor }: Props) {
  const update = useCallback((partial: Partial<TextFormatting>) => {
    onChange({ ...formatting, ...partial });
  }, [formatting, onChange]);

  const Toggle = ({ field, icon, label }: { field: keyof TextFormatting; icon: string; label: string }) => {
    const active = Boolean(formatting[field]);
    return (
      <Pressable
        onPress={() => update({ [field]: !active } as any)}
        style={[
          styles.toggleBtn,
          { borderColor: active ? accentColor : 'rgba(100,80,255,0.25)', backgroundColor: active ? `${accentColor}22` : 'rgba(255,255,255,0.80)' },
        ]}
      >
        <Text style={[styles.toggleIcon, { color: active ? accentColor : '#555' }]}>{icon}</Text>
        <Text style={[styles.toggleLabel, { color: active ? accentColor : '#888' }]}>{label}</Text>
      </Pressable>
    );
  };

  const AlignBtn = ({ value, icon }: { value: TextFormatting['align']; icon: string }) => (
    <Pressable
      onPress={() => update({ align: value })}
      style={[
        styles.alignBtn,
        {
          borderColor: formatting.align === value ? accentColor : 'rgba(100,80,255,0.25)',
          backgroundColor: formatting.align === value ? `${accentColor}22` : 'rgba(255,255,255,0.80)',
        },
      ]}
    >
      <MaterialIcons
        name={icon as any}
        size={20}
        color={formatting.align === value ? accentColor : '#888'}
      />
    </Pressable>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.panel}>
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: accentColor }]} />

        <Text style={[styles.title, { color: accentColor }]}>✏️ متن فارمیٹنگ</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Bold / Italic / Underline / Strikethrough */}
          <Text style={styles.sectionLabel}>طرز</Text>
          <View style={styles.toggleRow}>
            <Toggle field="bold"          icon="𝐁"  label="موٹا" />
            <Toggle field="italic"        icon="𝘐"  label="ترچھا" />
            <Toggle field="underline"     icon="U̲"  label="خط زیر" />
            <Toggle field="strikethrough" icon="S̶"  label="خط بین" />
          </View>

          {/* Text Alignment */}
          <Text style={styles.sectionLabel}>سیدھ</Text>
          <View style={styles.alignRow}>
            <AlignBtn value="right"  icon="format-align-right" />
            <AlignBtn value="center" icon="format-align-center" />
            <AlignBtn value="left"   icon="format-align-left" />
            <AlignBtn value="rtl"    icon="format-textdirection-r-to-l" />
          </View>

          {/* Line Spacing */}
          <Text style={styles.sectionLabel}>لائن فاصلہ</Text>
          <View style={styles.spacingRow}>
            {[1.2, 1.4, 1.6, 1.8, 2.0, 2.2].map(v => (
              <Pressable
                key={v}
                onPress={() => update({ lineSpacing: v })}
                style={[
                  styles.spacingBtn,
                  {
                    borderColor: formatting.lineSpacing === v ? accentColor : 'rgba(100,80,255,0.25)',
                    backgroundColor: formatting.lineSpacing === v ? `${accentColor}22` : 'rgba(255,255,255,0.80)',
                  },
                ]}
              >
                <Text style={[styles.spacingLabel, { color: formatting.lineSpacing === v ? accentColor : '#888' }]}>
                  {v.toFixed(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Font Family */}
          <Text style={styles.sectionLabel}>خط</Text>
          <View style={styles.fontRow}>
            {FONT_FAMILIES.map(f => (
              <Pressable
                key={f.id}
                onPress={() => update({ fontFamily: f.id })}
                style={[
                  styles.fontBtn,
                  {
                    borderColor: formatting.fontFamily === f.id ? accentColor : 'rgba(100,80,255,0.25)',
                    backgroundColor: formatting.fontFamily === f.id ? `${accentColor}18` : 'rgba(255,255,255,0.80)',
                  },
                ]}
              >
                <Text style={[styles.fontBtnLabel, { color: formatting.fontFamily === f.id ? accentColor : '#888' }]}>
                  {f.label}
                </Text>
                <Text style={styles.fontSample}>{f.sample}</Text>
              </Pressable>
            ))}
          </View>

          {/* Text Color */}
          <Text style={styles.sectionLabel}>متن کا رنگ</Text>
          <View style={styles.colorRow}>
            {TEXT_COLORS.map(c => (
              <Pressable
                key={c.hex}
                onPress={() => update({ textColor: c.hex })}
                style={[
                  styles.colorDot,
                  { backgroundColor: c.hex, borderColor: c.hex === '#ffffff' ? '#aaa' : c.hex },
                  formatting.textColor === c.hex && styles.colorDotSelected,
                ]}
              >
                {formatting.textColor === c.hex && (
                  <MaterialIcons name="check" size={14} color={c.hex === '#111111' ? '#fff' : '#111'} />
                )}
              </Pressable>
            ))}
          </View>

          {/* Highlight Color */}
          <Text style={styles.sectionLabel}>ہائی لائٹ</Text>
          <View style={styles.colorRow}>
            {HIGHLIGHT_COLORS.map(c => (
              <Pressable
                key={c.hex}
                onPress={() => update({ highlight: c.hex })}
                style={[
                  styles.colorDot,
                  {
                    backgroundColor: c.hex === 'transparent' ? 'rgba(200,200,220,0.4)' : c.hex,
                    borderColor: c.hex === 'transparent' ? 'rgba(100,80,255,0.3)' : c.hex,
                  },
                  formatting.highlight === c.hex && styles.colorDotSelected,
                ]}
              >
                {c.hex === 'transparent' && <Text style={{ fontSize: 10, color: '#888' }}>✕</Text>}
                {formatting.highlight === c.hex && c.hex !== 'transparent' && (
                  <MaterialIcons name="check" size={14} color="#333" />
                )}
              </Pressable>
            ))}
          </View>

          {/* Reset button */}
          <Pressable
            onPress={() => onChange(DEFAULT_FORMAT)}
            style={[styles.resetBtn, { borderColor: Colors.red }]}
          >
            <Text style={[styles.resetText, { color: Colors.red }]}>🔄 ڈیفالٹ بحال کریں</Text>
          </Pressable>

        </ScrollView>
      </View>
    </Modal>
  );
}

export default memo(TextFormattingPanel);

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  panel: {
    backgroundColor: '#f4f2ff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    maxHeight: '75%',
    borderTopWidth: 2,
    borderColor: 'rgba(100,80,255,0.20)',
    shadowColor: '#6040ee',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  title: { fontSize: FontSize.lg, fontWeight: '800', textAlign: 'center', marginBottom: Spacing.md },
  scrollContent: { gap: Spacing.sm, paddingBottom: Spacing.xl },
  sectionLabel: { color: '#888', fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase', marginTop: 6 },

  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    gap: 2,
  },
  toggleIcon: { fontSize: 16 },
  toggleLabel: { fontSize: 9, fontWeight: '700' },

  alignRow: { flexDirection: 'row', gap: 8 },
  alignBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },

  spacingRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  spacingBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  spacingLabel: { fontSize: FontSize.sm, fontWeight: '700' },

  fontRow: { flexDirection: 'row', gap: 8 },
  fontBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    gap: 2,
  },
  fontBtnLabel: { fontSize: FontSize.xs, fontWeight: '800' },
  fontSample: { fontSize: 10, color: '#aaa' },

  colorRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  colorDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: { borderWidth: 3, transform: [{ scale: 1.1 }] },

  resetBtn: {
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(255,75,110,0.06)',
  },
  resetText: { fontSize: FontSize.sm, fontWeight: '700' },
});
