// Powered by OnSpace.AI
import React, { memo, useState, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, Modal, ScrollView,
  ActivityIndicator, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ExportService, ExportFormat } from '@/services/export';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  text: string;
  accentColor: string;
  backupData?: any;
}

const FORMAT_OPTIONS: { id: ExportFormat; label: string; desc: string; icon: string; color: string }[] = [
  { id: 'txt',  label: 'Plain Text (.txt)',  desc: 'سادہ متن فائل',           icon: '📄', color: '#607d8b' },
  { id: 'md',   label: 'Markdown (.md)',     desc: 'فارمیٹڈ متن',             icon: '📝', color: '#0288d1' },
  { id: 'html', label: 'HTML (.html)',       desc: 'ویب صفحہ فارمیٹ',         icon: '🌐', color: '#e65100' },
  { id: 'json', label: 'JSON (.json)',       desc: 'ڈیٹا فارمیٹ + میٹا ڈیٹا', icon: '🔧', color: '#827717' },
  { id: 'pdf',  label: 'PDF (.pdf)',         desc: 'خوبصورت دستاویز',         icon: '📕', color: '#b71c1c' },
];

function ExportPanel({ visible, onClose, text, accentColor, backupData }: Props) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('txt');
  const [loading, setLoading] = useState(false);
  const [includeMetadata, setIncludeMetadata] = useState(true);

  const handleExport = useCallback(async () => {
    if (!text.trim()) {
      Alert.alert('', 'پہلے متن ٹائپ کریں۔');
      return;
    }
    setLoading(true);
    try {
      let success: boolean;
      if (selectedFormat === 'pdf') {
        success = await ExportService.exportPDF(text);
      } else {
        success = await ExportService.exportText(text, {
          format: selectedFormat,
          includeMetadata,
          filename: 'smart_keyboard_export',
        });
      }
      if (success) onClose();
    } catch (e) {
      Alert.alert('خرابی', 'فائل برآمد نہیں ہو سکی۔');
    } finally {
      setLoading(false);
    }
  }, [text, selectedFormat, includeMetadata, onClose]);

  const handleBackup = useCallback(async () => {
    if (!backupData) return;
    setLoading(true);
    try {
      await ExportService.createBackup(backupData);
      onClose();
    } catch {
      Alert.alert('خرابی', 'بیک اپ نہیں بن سکی۔');
    } finally {
      setLoading(false);
    }
  }, [backupData, onClose]);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = [...text].length;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.panel}>
        <View style={[styles.handle, { backgroundColor: accentColor }]} />
        <Text style={[styles.title, { color: accentColor }]}>📥 برآمد و ڈاؤن لوڈ</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Stats */}
          <View style={[styles.statsRow, { borderColor: `${accentColor}33` }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: accentColor }]}>{wordCount}</Text>
              <Text style={styles.statLabel}>الفاظ</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: accentColor }]}>{charCount}</Text>
              <Text style={styles.statLabel}>حروف</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: accentColor }]}>{text.split('\n').length}</Text>
              <Text style={styles.statLabel}>لائنیں</Text>
            </View>
          </View>

          {/* Format Selection */}
          <Text style={styles.sectionLabel}>فارمیٹ منتخب کریں</Text>
          {FORMAT_OPTIONS.map(f => (
            <Pressable
              key={f.id}
              onPress={() => setSelectedFormat(f.id)}
              style={[
                styles.formatCard,
                selectedFormat === f.id && {
                  borderColor: accentColor,
                  backgroundColor: `${accentColor}11`,
                },
              ]}
            >
              <Text style={styles.formatIcon}>{f.icon}</Text>
              <View style={styles.formatInfo}>
                <Text style={[styles.formatLabel, selectedFormat === f.id && { color: accentColor }]}>
                  {f.label}
                </Text>
                <Text style={styles.formatDesc}>{f.desc}</Text>
              </View>
              {selectedFormat === f.id && (
                <MaterialIcons name="check-circle" size={20} color={accentColor} />
              )}
            </Pressable>
          ))}

          {/* Options */}
          <Pressable
            onPress={() => setIncludeMetadata(v => !v)}
            style={styles.optionRow}
          >
            <View style={[styles.checkbox, includeMetadata && { backgroundColor: accentColor, borderColor: accentColor }]}>
              {includeMetadata && <MaterialIcons name="check" size={14} color="#fff" />}
            </View>
            <Text style={styles.optionLabel}>میٹا ڈیٹا شامل کریں (تاریخ، نام)</Text>
          </Pressable>

          {/* Export Button */}
          <Pressable
            onPress={handleExport}
            disabled={loading}
            style={[styles.exportBtn, { backgroundColor: accentColor, opacity: loading ? 0.7 : 1 }]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.exportBtnText}>
                📤 برآمد کریں ({selectedFormat.toUpperCase()})
              </Text>
            )}
          </Pressable>

          {/* Backup Section */}
          <View style={[styles.backupSection, { borderColor: `${accentColor}44` }]}>
            <Text style={[styles.backupTitle, { color: accentColor }]}>💾 مکمل بیک اپ</Text>
            <Text style={styles.backupDesc}>
              کلپ بورڈ، فقرے، اور ترجیحات سب محفوظ کریں۔
            </Text>
            <Pressable
              onPress={handleBackup}
              disabled={loading}
              style={[styles.backupBtn, { borderColor: accentColor, opacity: loading ? 0.6 : 1 }]}
            >
              <Text style={[styles.backupBtnText, { color: accentColor }]}>
                🗂️ بیک اپ بنائیں (.json)
              </Text>
            </Pressable>
          </View>

          {/* Legal Note */}
          <View style={[styles.legalCard, { borderColor: `rgba(255,200,0,0.4)` }]}>
            <Text style={[styles.legalTitle, { color: Colors.gold }]}>📜 قانونی دستاویز</Text>
            <Text style={styles.legalText}>
              {'© COPYRIGHT RESERVED — SMART WORLD ORDER\n'}
              {'Vision by Dr M Irfan Qadir Thaheem\n\n'}
              {'استعمال کی شرائط:\n'}
              {'• صرف ذاتی اور تعلیمی استعمال کی اجازت ہے\n'}
              {'• تجارتی استعمال سے پہلے اجازت لازمی ہے\n'}
              {'• سورس کوڈ کی نقل ممنوع ہے\n'}
              {'• آپ کا ڈیٹا آپ کے آلہ پر 100% محفوظ ہے\n\n'}
              {'Privacy Policy: کوئی ڈیٹا سرور کو نہیں بھیجا جاتا'}
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  panel: {
    backgroundColor: '#f0f4ff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    maxHeight: '88%',
    borderTopWidth: 2,
    borderColor: 'rgba(100,80,255,0.20)',
    shadowColor: '#6040ee',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 8 },
  title: { fontSize: FontSize.lg, fontWeight: '800', textAlign: 'center', marginBottom: Spacing.sm },
  scroll: { gap: Spacing.sm, paddingBottom: 20 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    padding: Spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statNum: { fontSize: FontSize.xxl, fontWeight: '900' },
  statLabel: { color: '#888', fontSize: FontSize.xs },
  statDivider: { width: 1, backgroundColor: 'rgba(100,80,255,0.2)', marginVertical: 4 },

  sectionLabel: { color: '#888', fontSize: FontSize.xs, fontWeight: '700', textTransform: 'uppercase', marginTop: 4 },
  formatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(100,80,255,0.22)',
  },
  formatIcon: { fontSize: 26 },
  formatInfo: { flex: 1 },
  formatLabel: { color: Colors.text, fontSize: FontSize.md, fontWeight: '700' },
  formatDesc: { color: '#888', fontSize: FontSize.xs, marginTop: 2 },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: { color: '#555', fontSize: FontSize.sm },

  exportBtn: {
    borderRadius: Radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  exportBtnText: { color: '#fff', fontWeight: '900', fontSize: FontSize.md },

  backupSection: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    padding: Spacing.md,
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.80)',
  },
  backupTitle: { fontSize: FontSize.md, fontWeight: '800' },
  backupDesc: { color: '#888', fontSize: FontSize.xs },
  backupBtn: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingVertical: 10,
    alignItems: 'center',
  },
  backupBtnText: { fontSize: FontSize.sm, fontWeight: '700' },

  legalCard: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    padding: Spacing.md,
    backgroundColor: 'rgba(255,248,220,0.80)',
    gap: 8,
  },
  legalTitle: { fontSize: FontSize.md, fontWeight: '800' },
  legalText: { color: '#666', fontSize: FontSize.xs, lineHeight: 18, textAlign: 'right' },
});

export default memo(ExportPanel);
