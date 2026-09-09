// Powered by OnSpace.AI
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput, Modal,
  ScrollView, Alert, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import { TemplatesService, Template, TEMPLATE_CATEGORIES } from '@/services/templates';

const FILTER_ALL = 'الكل';

export default function TemplatesScreen() {
  const insets = useSafeAreaInsets();
  const { currentTheme, liveBg, appendText } = useApp();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [filter, setFilter] = useState<string>(FILTER_ALL);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState<Template | null>(null);

  // Add form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Custom');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const all = await TemplatesService.getAll();
    setTemplates(all);
  };

  const filtered = templates.filter(t => {
    const matchCat = filter === FILTER_ALL || t.category === filter;
    const matchSearch = !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const allCategories = [FILTER_ALL, ...Array.from(new Set(templates.map(t => t.category)))];

  const handleUse = (t: Template) => {
    appendText(t.content);
    Alert.alert('✓', `"${t.title}" کی بورڈ میں شامل کر دیا گیا۔`);
    setShowDetail(null);
  };

  const handleDelete = async (t: Template) => {
    if (!t.isCustom) { Alert.alert('', 'بلٹ ان ٹیمپلیٹس حذف نہیں کیے جا سکتے۔'); return; }
    Alert.alert('حذف کریں؟', 'یہ ٹیمپلیٹ حذف ہو جائے گا۔', [
      { text: 'نہیں', style: 'cancel' },
      {
        text: 'ہاں', style: 'destructive', onPress: async () => {
          await TemplatesService.delete(t.id);
          setShowDetail(null);
          loadTemplates();
        }
      },
    ]);
  };

  const handleSaveNew = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      Alert.alert('', 'عنوان اور مواد ضروری ہیں۔'); return;
    }
    await TemplatesService.save({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      lang: /[\u0600-\u06FF]/.test(newContent) ? 'ur' : 'en',
    });
    setNewTitle(''); setNewContent(''); setNewCategory('Custom');
    setShowAdd(false);
    loadTemplates();
  };

  const isUrdu = (text: string) => /[\u0600-\u06FF]/.test(text);

  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: currentTheme.bg1 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={currentTheme.bg1} />
      <AnimatedBackground color1={currentTheme.accent} color2={currentTheme.glow} liveBg={liveBg} />

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: currentTheme.accent }]}>📝 ٹیمپلیٹس</Text>
        <Pressable
          onPress={() => setShowAdd(true)}
          style={[styles.addBtn, { backgroundColor: currentTheme.accent }]}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>نیا</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={[styles.searchBox, { borderColor: `${currentTheme.accent}44` }]}>
        <MaterialIcons name="search" size={18} color={currentTheme.accent} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="تلاش کریں..."
          placeholderTextColor={Colors.textDim}
          style={[styles.searchInput, { color: Colors.text }]}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.filterOuter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {allCategories.map(cat => {
            const active = cat === filter;
            return (
              <Pressable
                key={cat}
                onPress={() => setFilter(cat)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? currentTheme.accent : 'rgba(255,255,255,0.88)',
                    borderColor: active ? currentTheme.accent : `${currentTheme.accent}44`,
                    shadowColor: currentTheme.accent,
                    shadowOpacity: active ? 0.7 : 0.1,
                    shadowRadius: active ? 8 : 2,
                    elevation: active ? 8 : 1,
                  },
                ]}
              >
                <Text style={[styles.filterChipText, { color: active ? '#fff' : currentTheme.accent }]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Template Grid */}
      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={[styles.emptyText, { color: currentTheme.accent }]}>کوئی ٹیمپلیٹ نہیں</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setShowDetail(item)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: 'rgba(255,255,255,0.92)',
                borderColor: `${currentTheme.accent}44`,
                shadowColor: currentTheme.accent,
                transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
                shadowOpacity: pressed ? 0.4 : 0.15,
                shadowRadius: pressed ? 10 : 4,
                elevation: pressed ? 8 : 3,
              },
            ]}
          >
            <View style={[styles.cardTag, { backgroundColor: `${currentTheme.accent}22` }]}>
              <Text style={[styles.cardTagText, { color: currentTheme.accent }]}>
                {item.category}
              </Text>
              {item.isCustom && (
                <MaterialIcons name="star" size={11} color={Colors.gold} />
              )}
            </View>
            <Text style={[styles.cardTitle, { color: Colors.text, textAlign: isUrdu(item.title) ? 'right' : 'left' }]}>
              {item.title}
            </Text>
            <Text style={[styles.cardPreview, { textAlign: isUrdu(item.content) ? 'right' : 'left' }]} numberOfLines={3}>
              {item.content}
            </Text>
          </Pressable>
        )}
      />

      {/* Detail Modal */}
      <Modal visible={Boolean(showDetail)} transparent animationType="fade" onRequestClose={() => setShowDetail(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowDetail(null)} />
        {showDetail && (
          <View style={[styles.detailBox, { backgroundColor: '#fff', borderColor: `${currentTheme.accent}55` }]}>
            <View style={styles.detailHeader}>
              <Text style={[styles.detailTitle, { color: currentTheme.accent, textAlign: isUrdu(showDetail.title) ? 'right' : 'left' }]}>
                {showDetail.title}
              </Text>
              <Pressable onPress={() => setShowDetail(null)}>
                <MaterialIcons name="close" size={22} color={Colors.textDim} />
              </Pressable>
            </View>
            <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.detailContent, { textAlign: isUrdu(showDetail.content) ? 'right' : 'left' }]}>
                {showDetail.content}
              </Text>
            </ScrollView>
            <View style={styles.detailActions}>
              <Pressable
                onPress={() => handleUse(showDetail)}
                style={[styles.detailBtn, { backgroundColor: currentTheme.accent }]}
              >
                <MaterialIcons name="keyboard" size={16} color="#fff" />
                <Text style={styles.detailBtnText}>کی بورڈ میں شامل کریں</Text>
              </Pressable>
              {showDetail.isCustom && (
                <Pressable
                  onPress={() => handleDelete(showDetail)}
                  style={[styles.detailBtn, { backgroundColor: Colors.red }]}
                >
                  <MaterialIcons name="delete" size={16} color="#fff" />
                  <Text style={styles.detailBtnText}>حذف</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
      </Modal>

      {/* Add Template Modal */}
      <Modal visible={showAdd} transparent animationType="slide" onRequestClose={() => setShowAdd(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowAdd(false)} />
        <View style={[styles.addBox, { backgroundColor: '#fff' }]}>
          <View style={[styles.addHandle, { backgroundColor: currentTheme.accent }]} />
          <Text style={[styles.addTitle, { color: currentTheme.accent }]}>✏️ نیا ٹیمپلیٹ</Text>

          <Text style={styles.fieldLabel}>عنوان</Text>
          <TextInput
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="ٹیمپلیٹ کا نام..."
            style={[styles.field, { borderColor: `${currentTheme.accent}44` }]}
            placeholderTextColor={Colors.textDim}
          />

          <Text style={styles.fieldLabel}>زمرہ</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {TEMPLATE_CATEGORIES.map(cat => (
                <Pressable
                  key={cat}
                  onPress={() => setNewCategory(cat)}
                  style={[
                    styles.catChip,
                    { backgroundColor: newCategory === cat ? currentTheme.accent : `${currentTheme.accent}18`, borderColor: currentTheme.accent },
                  ]}
                >
                  <Text style={[styles.catChipText, { color: newCategory === cat ? '#fff' : currentTheme.accent }]}>{cat}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.fieldLabel}>مواد</Text>
          <TextInput
            value={newContent}
            onChangeText={setNewContent}
            placeholder="ٹیمپلیٹ کا متن یہاں لکھیں..."
            style={[styles.field, styles.fieldMulti, { borderColor: `${currentTheme.accent}44` }]}
            multiline
            numberOfLines={5}
            placeholderTextColor={Colors.textDim}
            textAlignVertical="top"
          />

          <Pressable onPress={handleSaveNew} style={[styles.saveBtn, { backgroundColor: currentTheme.accent }]}>
            <Text style={styles.saveBtnText}>💾 محفوظ کریں</Text>
          </Pressable>
        </View>
      </Modal>
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
    paddingTop: Spacing.sm,
    paddingBottom: 4,
  },
  title: { fontSize: FontSize.xl, fontWeight: '800' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.pill,
  },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.sm },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 8,
    shadowColor: '#6040ee',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: FontSize.md },
  filterOuter: { marginBottom: 8 },
  filterRow: { paddingHorizontal: Spacing.lg, gap: 7, paddingVertical: 2 },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  filterChipText: { fontSize: FontSize.sm, fontWeight: '700' },
  list: { paddingHorizontal: Spacing.md, paddingBottom: 100, gap: 10 },
  gridRow: { gap: 10, justifyContent: 'space-between' },
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    padding: Spacing.md,
    gap: 6,
    shadowOffset: { width: 0, height: 2 },
    maxWidth: '48%',
  },
  cardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  cardTagText: { fontSize: 10, fontWeight: '700' },
  cardTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.text },
  cardPreview: { fontSize: FontSize.xs, color: Colors.textMuted, lineHeight: 16 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyIcon: { fontSize: 54 },
  emptyText: { fontSize: FontSize.lg, fontWeight: '700' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  detailBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1.5,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  detailTitle: { fontSize: FontSize.lg, fontWeight: '800', flex: 1 },
  detailScroll: { maxHeight: 200, marginBottom: 14 },
  detailContent: { fontSize: FontSize.md, lineHeight: 26, color: Colors.text },
  detailActions: { flexDirection: 'row', gap: 10 },
  detailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: Radius.pill,
  },
  detailBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.sm },

  addBox: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: Spacing.lg,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
    maxHeight: '90%',
  },
  addHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  addTitle: { fontSize: FontSize.xl, fontWeight: '900', textAlign: 'center', marginBottom: 14 },
  fieldLabel: { color: Colors.textMuted, fontSize: FontSize.xs, fontWeight: '700', marginBottom: 4 },
  field: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: '#f8f8ff',
    marginBottom: 10,
  },
  fieldMulti: { minHeight: 100, textAlignVertical: 'top' },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  catChipText: { fontSize: FontSize.xs, fontWeight: '700' },
  saveBtn: {
    borderRadius: Radius.pill,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.md },
});
