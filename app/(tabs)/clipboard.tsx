// Powered by OnSpace.AI
import React from 'react';
import {
  View, Text, FlatList, Pressable, StyleSheet, Alert, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { ClipEntry } from '@/services/storage';

export default function ClipboardScreen() {
  const insets = useSafeAreaInsets();
  const { clipboard, deleteClipEntry, clearClipboard, appendText, currentTheme, liveBg } = useApp();

  const handleUse = (entry: ClipEntry) => {
    appendText(entry.text);
    Alert.alert('✓', 'متن کی بورڈ میں شامل کر دیا گیا۔');
  };

  const handleDelete = (id: string) => {
    Alert.alert('حذف کریں؟', 'کیا آپ یہ اندراج حذف کرنا چاہتے ہیں؟', [
      { text: 'نہیں', style: 'cancel' },
      { text: 'ہاں', style: 'destructive', onPress: () => deleteClipEntry(id) },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert('سب صاف کریں؟', 'تمام کلپ بورڈ ڈیٹا حذف ہو جائے گا۔', [
      { text: 'نہیں', style: 'cancel' },
      { text: 'ہاں', style: 'destructive', onPress: clearClipboard },
    ]);
  };

  const renderItem = ({ item }: { item: ClipEntry }) => (
    <View style={[styles.card, { borderColor: `${currentTheme.accent}33` }]}>
      <Text style={styles.cardText} numberOfLines={3}>{item.text}</Text>
      <Text style={styles.time}>{item.time}</Text>
      <View style={styles.cardActions}>
        <Pressable onPress={() => handleUse(item)} style={[styles.actionBtn, { borderColor: currentTheme.accent }]}>
          <Text style={[styles.actionText, { color: currentTheme.accent }]}>📝 استعمال کریں</Text>
        </Pressable>
        <Pressable onPress={() => handleDelete(item.id)} style={[styles.actionBtn, { borderColor: Colors.red }]}>
          <Text style={[styles.actionText, { color: Colors.red }]}>🗑️ حذف</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: currentTheme.bg1 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={currentTheme.bg1} />
      <AnimatedBackground color1={currentTheme.accent} color2={currentTheme.glow} liveBg={liveBg} />

      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: currentTheme.accent }]}>📋 کلپ بورڈ</Text>
        {clipboard.length > 0 && (
          <Pressable onPress={handleClearAll} style={styles.clearBtn}>
            <MaterialIcons name="delete-sweep" size={20} color={Colors.red} />
            <Text style={styles.clearText}>سب صاف کریں</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={clipboard}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>کوئی محفوظ متن نہیں</Text>
            <Text style={styles.emptyHint}>کی بورڈ پر ٹائپ کریں اور متن یہاں محفوظ ہو جائے گا</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: { fontSize: FontSize.xl, fontWeight: '800' },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,75,110,0.12)',
    borderWidth: 1,
    borderColor: Colors.red,
  },
  clearText: { color: Colors.red, fontSize: FontSize.xs, fontWeight: '600' },
  list: { paddingHorizontal: Spacing.md, paddingBottom: 80, gap: 10 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
  cardText: {
    color: Colors.text,
    fontSize: FontSize.md,
    lineHeight: 22,
    marginBottom: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '500',
  },
  time: { color: Colors.textDim, fontSize: FontSize.xs, marginBottom: Spacing.xs },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  actionText: { fontSize: FontSize.xs, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyIcon: { fontSize: 60 },
  emptyText: { color: Colors.textMuted, fontSize: FontSize.lg, fontWeight: '700' },
  emptyHint: { color: Colors.textDim, fontSize: FontSize.sm, textAlign: 'center', paddingHorizontal: 40 },
});
