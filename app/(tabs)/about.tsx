// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Linking,
  StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { ExportService } from '@/services/export';

// ─── Sub-components ──────────────────────────────────────────────────────────

function InfoCard({
  icon, title, value, onPress,
}: {
  icon: string; title: string; value: string; onPress?: () => void;
}) {
  const { currentTheme } = useApp();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.infoCard,
        {
          borderColor: `${currentTheme.accent}44`,
          backgroundColor: 'rgba(255,255,255,0.88)',
          shadowColor: currentTheme.accent,
          shadowOpacity: pressed ? 0.3 : 0.1,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoTextBlock}>
        <Text style={[styles.infoTitle, { color: Colors.textDim }]}>{title}</Text>
        <Text style={[styles.infoValue, { color: currentTheme.accent }]}>{value}</Text>
      </View>
      {onPress && <MaterialIcons name="open-in-new" size={16} color={Colors.textDim} />}
    </Pressable>
  );
}

function FeatureBadge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: `${color}18`, borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

function LegalSection({ accentColor }: { accentColor: string }) {
  return (
    <View style={[styles.legalCard, { borderColor: 'rgba(230,160,0,0.4)', backgroundColor: 'rgba(255,248,220,0.60)' }]}>
      <Text style={[styles.legalTitle, { color: Colors.gold }]}>📜 قانونی دستاویزات</Text>

      <Text style={[styles.legalSubtitle, { color: accentColor }]}>© کاپی رائٹ</Text>
      <Text style={styles.legalText}>
        {'SMART Voice Keyboard Pro\n'}
        {'© 2024-2026 SMART WORLD ORDER\n'}
        {'تمام حقوق محفوظ ہیں۔\n'}
        {'Vision by Dr M Irfan Qadir Thaheem\n'}
        {'★ The One Man Army ★'}
      </Text>

      <View style={styles.legalDivider} />

      <Text style={[styles.legalSubtitle, { color: accentColor }]}>📋 استعمال کی شرائط</Text>
      <Text style={styles.legalText}>
        {'1. یہ سافٹ ویئر صرف ذاتی اور تعلیمی استعمال کے لیے مجاز ہے۔\n'}
        {'2. کسی بھی تجارتی استعمال کے لیے لکھی ہوئی اجازت ضروری ہے۔\n'}
        {'3. سورس کوڈ کی نقل، تقسیم یا ترمیم ممنوع ہے۔\n'}
        {'4. ریورس انجینئرنگ کی اجازت نہیں ہے۔\n'}
        {'5. تمام آئی پی ایڈریس SMART WORLD ORDER کی ملکیت ہے۔'}
      </Text>

      <View style={styles.legalDivider} />

      <Text style={[styles.legalSubtitle, { color: accentColor }]}>🔒 رازداری کی پالیسی</Text>
      <Text style={styles.legalText}>
        {'• کوئی ذاتی ڈیٹا جمع نہیں کیا جاتا۔\n'}
        {'• تمام ڈیٹا صرف آپ کے آلہ پر محفوظ رہتا ہے۔\n'}
        {'• کوئی ڈیٹا کسی سرور کو نہیں بھیجا جاتا۔\n'}
        {'• آف لائن موڈ میں مکمل رازداری یقینی ہے۔\n'}
        {'• مائیکروفون صرف وائس ٹائپنگ کے دوران استعمال ہوتا ہے۔'}
      </Text>

      <View style={styles.legalDivider} />

      <Text style={[styles.legalSubtitle, { color: accentColor }]}>⚠️ ذمہ داری کا اخراج</Text>
      <Text style={styles.legalText}>
        {'یہ سافٹ ویئر "جیسا ہے" فراہم کیا جاتا ہے۔\n'}
        {'ڈویلپر کسی بھی نقصان کا ذمہ دار نہیں ہے۔\n'}
        {'صرف ذاتی اور تعلیمی استعمال کے لیے۔'}
      </Text>
    </View>
  );
}

// ─── Export & Download Section ───────────────────────────────────────────────

function ExportDownloadSection({
  accentColor,
  clipboard,
  phrases,
  themeId,
  fontSize,
}: {
  accentColor: string;
  clipboard: any[];
  phrases: any[];
  themeId: string;
  fontSize: number;
}) {
  const [exporting, setExporting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleExportProject = async () => {
    setExporting(true);
    try {
      const backupData = {
        version: '2.0.0',
        exportDate: new Date().toISOString(),
        appName: 'SMART Voice Keyboard Pro',
        author: 'Dr M Irfan Qadir Thaheem',
        copyright: 'SMART World Order',
        clipboard,
        phrases,
        preferences: { theme: themeId, fontSize },
        legalNote: 'تمام حقوق محفوظ ہیں — SMART WORLD ORDER © 2024-2026',
      };
      const ok = await ExportService.createBackup(backupData);
      if (!ok) Alert.alert('خرابی', 'برآمد ناکام رہا۔ دوبارہ کوشش کریں۔');
    } catch (e) {
      Alert.alert('خرابی', 'برآمد کے دوران مسئلہ آیا۔');
    } finally {
      setExporting(false);
    }
  };

  const handleSourceCodeInfo = async () => {
    setDownloading(true);
    try {
      // Export a developer info JSON with instructions on how to download source code
      const devInfo = {
        title: 'SMART Voice Keyboard Pro — Source Code',
        version: '2.0.0',
        author: 'Dr M Irfan Qadir Thaheem',
        copyright: 'SMART World Order © 2024-2026',
        howToDownloadSourceCode: [
          'OnSpace App Builder میں اپنا پروجیکٹ کھولیں',
          'اوپر دائیں کونے میں ٹول بار دیکھیں',
          'Download آئیکن پر کلک کریں',
          '"Export complete source code package" آپشن منتخب کریں',
          'مکمل پروجیکٹ ZIP فائل ڈاؤن لوڈ ہو جائے گی',
        ],
        onspaceToolbar: {
          location: 'Project Page → Top-Right Toolbar',
          buttons: [
            { name: 'Code', function: 'سورس کوڈ دیکھیں' },
            { name: 'Download', function: 'سورس کوڈ ZIP یا APK ڈاؤن لوڈ' },
            { name: 'Publish', function: 'Play Store / App Store پر شائع کریں' },
          ],
        },
        tech: {
          framework: 'React Native + Expo',
          router: 'expo-router',
          storage: 'AsyncStorage',
          tts: 'expo-speech',
          icons: '@expo/vector-icons',
          languages: 12,
        },
        contact: {
          whatsapp: '0300-4737757',
          email: 'dr.mirfan5577@gmail.com',
        },
      };
      const infoText = JSON.stringify(devInfo, null, 2);
      const ok = await ExportService.exportText(infoText, {
        filename: 'smart_keyboard_source_info',
        format: 'json',
        includeMetadata: false,
      });
      if (!ok) Alert.alert('خرابی', 'معلومات برآمد ناکام رہا۔');
    } catch {
      Alert.alert('خرابی', 'ڈاؤن لوڈ کے دوران مسئلہ آیا۔');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={[styles.exportSection, { borderColor: `${accentColor}55`, backgroundColor: 'rgba(255,255,255,0.92)' }]}>
      <Text style={[styles.exportSectionTitle, { color: accentColor }]}>
        💾 برآمد اور ڈاؤن لوڈ
      </Text>
      <Text style={[styles.exportSectionDesc, { color: Colors.textMuted }]}>
        پورا پروجیکٹ ڈیٹا بیک اپ کریں یا سورس کوڈ کی معلومات حاصل کریں
      </Text>

      {/* Export full project backup */}
      <Pressable
        onPress={handleExportProject}
        disabled={exporting}
        style={({ pressed }) => [
          styles.exportBtn,
          {
            backgroundColor: accentColor,
            opacity: pressed || exporting ? 0.75 : 1,
            shadowColor: accentColor,
          },
        ]}
      >
        {exporting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <MaterialIcons name="backup" size={20} color="#fff" />
        )}
        <Text style={styles.exportBtnText}>
          {exporting ? 'برآمد ہو رہا ہے...' : '📦 پورا پروجیکٹ بیک اپ کریں'}
        </Text>
      </Pressable>

      {/* Source Code info download */}
      <Pressable
        onPress={handleSourceCodeInfo}
        disabled={downloading}
        style={({ pressed }) => [
          styles.downloadBtn,
          {
            borderColor: accentColor,
            backgroundColor: `${accentColor}12`,
            opacity: pressed || downloading ? 0.75 : 1,
          },
        ]}
      >
        {downloading ? (
          <ActivityIndicator size="small" color={accentColor} />
        ) : (
          <MaterialIcons name="code" size={20} color={accentColor} />
        )}
        <Text style={[styles.downloadBtnText, { color: accentColor }]}>
          {downloading ? 'تیار ہو رہا ہے...' : '💻 سورس کوڈ ڈاؤن لوڈ گائیڈ'}
        </Text>
      </Pressable>

      {/* OnSpace toolbar instructions */}
      <View style={[styles.toolbarGuide, { borderColor: `${accentColor}33`, backgroundColor: `${accentColor}08` }]}>
        <Text style={[styles.toolbarGuideTitle, { color: accentColor }]}>
          🔧 OnSpace ٹول بار سے ڈاؤن لوڈ
        </Text>
        {[
          '① پروجیکٹ صفحہ کھولیں',
          '② اوپر دائیں ← Download آئیکن',
          '③ "Export source code" منتخب کریں',
          '④ مکمل ZIP فائل ڈاؤن لوڈ ہوگی',
        ].map((step, i) => (
          <Text key={i} style={[styles.toolbarStep, { color: Colors.textMuted }]}>{step}</Text>
        ))}
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { currentTheme, liveBg, clipboard, phrases, themeId, fontSize } = useApp();

  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: currentTheme.bg1 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={currentTheme.bg1} />
      <AnimatedBackground color1={currentTheme.accent} color2={currentTheme.glow} liveBg={liveBg} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroBlock}>
          <Text style={styles.heroEmoji}>🎹</Text>
          <Text style={[styles.heroTitle, { color: currentTheme.accent }]}>SMART Voice Keyboard Pro</Text>
          <Text style={[styles.heroVersion, { color: Colors.textDim }]}>Version 2.0.0</Text>
          <Text style={[styles.heroSub, { color: Colors.textMuted }]}>ایک پراجیکٹ از SMART World Order</Text>
          <Text style={[styles.heroAuthor, { color: currentTheme.glow }]}>✨ Dr M Irfan Qadir Thaheem ✨</Text>
          <Text style={[styles.heroTag, { color: Colors.gold }]}>★ The One Man Army ★</Text>
        </View>

        {/* Export & Download — prominent at top */}
        <ExportDownloadSection
          accentColor={currentTheme.accent}
          clipboard={clipboard}
          phrases={phrases}
          themeId={themeId}
          fontSize={fontSize}
        />

        {/* Features */}
        <Text style={[styles.sectionTitle, { color: currentTheme.accent }]}>🌟 خصوصیات v2.0</Text>
        <View style={styles.badgesRow}>
          {[
            'اردو کی بورڈ', 'English Layout', 'سنڌي', 'Voice Typing',
            '10 Themes', 'Fn Keys', 'Symbols', 'Clipboard',
            'Offline STT', 'Word Prediction', 'Emoji 500+', 'Quick Phrases',
            'Audio→Text', 'Auto Correct', 'TTS', 'Export/PDF',
            'Shortcuts', 'Text Format', 'Whisper AI', 'آف لائن',
          ].map((label, i) => (
            <FeatureBadge
              key={label}
              label={label}
              color={[currentTheme.accent, currentTheme.glow, Colors.gold, Colors.green, Colors.red][i % 5]}
            />
          ))}
        </View>

        {/* Privacy */}
        <View style={[styles.privacyCard, { borderColor: Colors.green, backgroundColor: 'rgba(0,200,100,0.06)' }]}>
          <Text style={[styles.privacyTitle, { color: Colors.green }]}>🔒 آپ کا ڈیٹا 100% محفوظ</Text>
          <Text style={[styles.privacyText, { color: Colors.textMuted }]}>
            تمام ڈیٹا صرف آپ کے آلہ پر محفوظ ہے۔ کوئی ڈیٹا کسی سرور پر نہیں بھیجا جاتا۔
            {'\n'}Secrecy Policy: پرائیویسی کی مکمل ضمانت۔
          </Text>
        </View>

        {/* Legal Documentation */}
        <LegalSection accentColor={currentTheme.accent} />

        {/* Contact */}
        <Text style={[styles.sectionTitle, { color: currentTheme.accent }]}>📞 رابطہ</Text>
        <InfoCard
          icon="📱"
          title="WhatsApp"
          value="0300-4737757"
          onPress={() => Linking.openURL('https://wa.me/923004737757')}
        />
        <InfoCard
          icon="✉️"
          title="Email"
          value="dr.mirfan5577@gmail.com"
          onPress={() => Linking.openURL('mailto:dr.mirfan5577@gmail.com')}
        />
        <InfoCard
          icon="🌐"
          title="Website"
          value="SmartWorldOrder"
          onPress={() => Linking.openURL('https://drmirfan5577-ops.github.io/SmartWorldOrder')}
        />

        {/* Tech Stack */}
        <View style={[styles.techCard, { borderColor: `${currentTheme.accent}44`, backgroundColor: 'rgba(255,255,255,0.88)' }]}>
          <Text style={[styles.techTitle, { color: currentTheme.accent }]}>🛠️ ٹیکنالوجی</Text>
          {[
            ['Framework',  'React Native + Expo'],
            ['STT Engine', '@react-native-voice/voice + Whisper.cpp'],
            ['TTS',        'expo-speech (آف لائن)'],
            ['Storage',    'AsyncStorage (مقامی)'],
            ['Export',     'expo-file-system + expo-sharing'],
            ['Navigation', 'expo-router'],
            ['Languages',  '12 زبانیں'],
          ].map(([key, val]) => (
            <View key={key} style={styles.techRow}>
              <Text style={[styles.techKey, { color: Colors.textDim }]}>{key}</Text>
              <Text style={[styles.techVal, { color: currentTheme.glow }]}>{val}</Text>
            </View>
          ))}
        </View>

        {/* Second export section at bottom (near legal docs) */}
        <View style={[styles.bottomExport, { borderColor: `${currentTheme.accent}33`, backgroundColor: `${currentTheme.accent}08` }]}>
          <Text style={[styles.bottomExportTitle, { color: currentTheme.accent }]}>
            📥 دستاویزات برآمد کریں
          </Text>
          <Text style={[styles.bottomExportDesc, { color: Colors.textMuted }]}>
            قانونی دستاویزات اور ایپ کی معلومات کو PDF یا Text فائل کے طور پر محفوظ کریں
          </Text>
          <Pressable
            onPress={async () => {
              const legalText = [
                'SMART Voice Keyboard Pro — Legal Documentation',
                '═══════════════════════════════════════════',
                '',
                '© COPYRIGHT',
                'SMART Voice Keyboard Pro',
                '© 2024-2026 SMART WORLD ORDER',
                'تمام حقوق محفوظ ہیں',
                'Vision by Dr M Irfan Qadir Thaheem',
                '★ The One Man Army ★',
                '',
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                '',
                '📋 TERMS OF USE / استعمال کی شرائط',
                '1. یہ سافٹ ویئر صرف ذاتی اور تعلیمی استعمال کے لیے مجاز ہے',
                '2. کسی بھی تجارتی استعمال کے لیے لکھی ہوئی اجازت ضروری ہے',
                '3. سورس کوڈ کی نقل، تقسیم یا ترمیم ممنوع ہے',
                '4. ریورس انجینئرنگ کی اجازت نہیں ہے',
                '5. تمام آئی پی ایڈریس SMART WORLD ORDER کی ملکیت ہے',
                '',
                '🔒 PRIVACY POLICY / رازداری کی پالیسی',
                '• کوئی ذاتی ڈیٹا جمع نہیں کیا جاتا',
                '• تمام ڈیٹا صرف آپ کے آلہ پر محفوظ رہتا ہے',
                '• کوئی ڈیٹا کسی سرور کو نہیں بھیجا جاتا',
                '• آف لائن موڈ میں مکمل رازداری یقینی ہے',
                '',
                '⚠️ DISCLAIMER',
                'یہ سافٹ ویئر "جیسا ہے" فراہم کیا جاتا ہے',
                'ڈویلپر کسی بھی نقصان کا ذمہ دار نہیں ہے',
                '',
                '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                'Contact: dr.mirfan5577@gmail.com | 0300-4737757',
                'Version 2.0.0 | Build 2026',
              ].join('\n');
              await ExportService.exportText(legalText, {
                filename: 'smart_keyboard_legal',
                format: 'txt',
                includeMetadata: false,
              });
            }}
            style={({ pressed }) => [
              styles.docExportBtn,
              { backgroundColor: currentTheme.accent, opacity: pressed ? 0.8 : 1, shadowColor: currentTheme.accent },
            ]}
          >
            <MaterialIcons name="description" size={18} color="#fff" />
            <Text style={styles.docExportBtnText}>دستاویزات TXT برآمد کریں</Text>
          </Pressable>
        </View>

        {/* Copyright */}
        <View style={styles.copyright}>
          <Text style={[styles.copyrightTitle, { color: currentTheme.accent }]}>© COPYRIGHT RESERVED</Text>
          <Text style={[styles.copyrightText, { color: Colors.text }]}>SMART WORLD ORDER</Text>
          <Text style={[styles.copyrightSub, { color: Colors.textMuted }]}>
            ہم پوری دنیا کو اتحاد، سالمیت اور عالمگیریت کے تحت{'\n'}بہتر بنانے کے لیے پرعزم ہیں، ان شاء اللہ۔
          </Text>
          <Text style={[styles.disclaimer, { color: Colors.textDim }]}>⚠️ Disclaimer: ذاتی اور تعلیمی استعمال کے لیے</Text>
          <Text style={[styles.version, { color: Colors.textDim }]}>v2.0.0 • Build 2026</Text>
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: 120, gap: Spacing.md },

  heroBlock: { alignItems: 'center', paddingVertical: Spacing.xl, gap: 5 },
  heroEmoji: { fontSize: 64, marginBottom: 4 },
  heroTitle: { fontSize: FontSize.xl, fontWeight: '900', textAlign: 'center' },
  heroVersion: { fontSize: FontSize.xs },
  heroSub: { fontSize: FontSize.md, textAlign: 'center' },
  heroAuthor: { fontSize: FontSize.lg, fontWeight: '800', textAlign: 'center' },
  heroTag: { fontSize: FontSize.sm, fontWeight: '700' },

  // Export & Download Section
  exportSection: {
    borderRadius: Radius.lg,
    borderWidth: 2,
    padding: Spacing.lg,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  exportSectionTitle: { fontSize: FontSize.lg, fontWeight: '900' },
  exportSectionDesc: { fontSize: FontSize.xs, lineHeight: 18, textAlign: 'right' },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: Radius.pill,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  exportBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.md },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: Radius.pill,
    borderWidth: 2,
  },
  downloadBtnText: { fontWeight: '800', fontSize: FontSize.md },
  toolbarGuide: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 5,
  },
  toolbarGuideTitle: { fontSize: FontSize.sm, fontWeight: '800', marginBottom: 2 },
  toolbarStep: { fontSize: FontSize.xs, lineHeight: 20, textAlign: 'right' },

  // Bottom export section
  bottomExport: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  bottomExportTitle: { fontSize: FontSize.md, fontWeight: '800' },
  bottomExportDesc: { fontSize: FontSize.xs, lineHeight: 18, textAlign: 'right' },
  docExportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: Radius.pill,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  docExportBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.sm },

  // Features
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800' },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.pill, borderWidth: 1 },
  badgeText: { fontSize: FontSize.xs, fontWeight: '700' },

  // Privacy
  privacyCard: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, gap: 6 },
  privacyTitle: { fontSize: FontSize.md, fontWeight: '800' },
  privacyText: { fontSize: FontSize.sm, lineHeight: 20, textAlign: 'right' },

  // Contact cards
  infoCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2,
  },
  infoIcon: { fontSize: 24 },
  infoTextBlock: { flex: 1 },
  infoTitle: { fontSize: FontSize.xs },
  infoValue: { fontSize: FontSize.md, fontWeight: '700' },

  // Legal
  legalCard: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, gap: 8 },
  legalTitle: { fontSize: FontSize.lg, fontWeight: '900', textAlign: 'center', marginBottom: 4 },
  legalSubtitle: { fontSize: FontSize.md, fontWeight: '800' },
  legalText: { color: Colors.textDim, fontSize: FontSize.xs, lineHeight: 18, textAlign: 'right' },
  legalDivider: { height: 1, backgroundColor: 'rgba(230,160,0,0.25)' },

  // Tech
  techCard: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, gap: 8 },
  techTitle: { fontSize: FontSize.md, fontWeight: '800', marginBottom: 4 },
  techRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  techKey: { fontSize: FontSize.xs, fontWeight: '700', width: 90 },
  techVal: { fontSize: FontSize.xs, flex: 1, lineHeight: 16 },

  // Copyright
  copyright: { alignItems: 'center', gap: 6, paddingTop: Spacing.md },
  copyrightTitle: { fontSize: FontSize.lg, fontWeight: '900' },
  copyrightText: { fontSize: FontSize.md, fontWeight: '700' },
  copyrightSub: { fontSize: FontSize.sm, textAlign: 'center', lineHeight: 22 },
  disclaimer: { fontSize: FontSize.xs, textAlign: 'center' },
  version: { fontSize: FontSize.xs },
});
