// Powered by OnSpace.AI
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, TextInput,
  Modal, ScrollView, Alert, StatusBar, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from '@/hooks/useApp';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { Colors, Spacing, Radius, FontSize } from '@/constants/theme';
import {
  NotesService, Note, NoteColor, NotePriority, NoteType,
  NOTE_COLORS, PRIORITY_COLORS, TaskItem,
} from '@/services/notes';

const FONT_SIZES = [13, 15, 16, 18, 20, 22, 24];

function getWordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

// Note Editor Modal
function NoteEditor({
  note, onClose, onSave, accentColor,
}: {
  note: Partial<Note> | null;
  onClose: () => void;
  onSave: (data: any) => void;
  accentColor: string;
}) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [type, setType] = useState<NoteType>(note?.type || 'note');
  const [color, setColor] = useState<NoteColor>(note?.color || 'white');
  const [priority, setPriority] = useState<NotePriority>(note?.priority || 'medium');
  const [fontSize, setFontSize] = useState(note?.fontSize || 16);
  const [rtl, setRtl] = useState(note?.rtl !== undefined ? note.rtl : true);
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [tasks, setTasks] = useState<TaskItem[]>(note?.tasks || []);
  const [taskInput, setTaskInput] = useState('');

  const noteColor = NOTE_COLORS[color];
  const isUrdu = (t: string) => /[\u0600-\u06FF]/.test(t);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const addTask = () => {
    const t = taskInput.trim();
    if (t) {
      setTasks([...tasks, { id: `task_${Date.now()}`, text: t, done: false }]);
      setTaskInput('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(tk => tk.id === id ? { ...tk, done: !tk.done } : tk));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(tk => tk.id !== id));
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={[styles.editorRoot, { backgroundColor: noteColor.bg }]}>
        {/* Toolbar */}
        <View style={[styles.editorToolbar, { backgroundColor: noteColor.bg, borderBottomColor: noteColor.border }]}>
          <Pressable onPress={onClose} hitSlop={8}>
            <MaterialIcons name="arrow-back" size={24} color={accentColor} />
          </Pressable>
          <Text style={[styles.editorToolbarTitle, { color: accentColor }]}>
            {note?.id ? 'ترمیم' : 'نئی نوٹ'}
          </Text>
          <Pressable onPress={() => onSave({ title, content, type, color, priority, fontSize, rtl, tags, tasks })}
            style={[styles.saveNoteBtn, { backgroundColor: accentColor }]}>
            <Text style={styles.saveNoteBtnText}>محفوظ</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.editorScroll}>
          {/* Type */}
          <View style={styles.editorRow}>
            <Text style={styles.editorLabel}>قسم:</Text>
            {(['note', 'task'] as NoteType[]).map(t => (
              <Pressable key={t} onPress={() => setType(t)}
                style={[styles.typeChip, { backgroundColor: type === t ? accentColor : `${accentColor}18`, borderColor: accentColor }]}>
                <Text style={[styles.typeChipText, { color: type === t ? '#fff' : accentColor }]}>
                  {t === 'note' ? '📝 نوٹ' : '✅ ٹاسک'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Priority */}
          <View style={styles.editorRow}>
            <Text style={styles.editorLabel}>اہمیت:</Text>
            {(['low', 'medium', 'high'] as NotePriority[]).map(p => (
              <Pressable key={p} onPress={() => setPriority(p)}
                style={[styles.typeChip, {
                  backgroundColor: priority === p ? PRIORITY_COLORS[p] : `${PRIORITY_COLORS[p]}18`,
                  borderColor: PRIORITY_COLORS[p],
                }]}>
                <Text style={[styles.typeChipText, { color: priority === p ? '#fff' : PRIORITY_COLORS[p] }]}>
                  {p === 'low' ? '🟢 کم' : p === 'medium' ? '🟠 درمیانی' : '🔴 زیادہ'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Color */}
          <View style={styles.editorRow}>
            <Text style={styles.editorLabel}>رنگ:</Text>
            {(Object.keys(NOTE_COLORS) as NoteColor[]).map(c => (
              <Pressable key={c} onPress={() => setColor(c)}
                style={[styles.colorCircle, {
                  backgroundColor: NOTE_COLORS[c].bg,
                  borderColor: color === c ? NOTE_COLORS[c].border : 'rgba(0,0,0,0.1)',
                  borderWidth: color === c ? 3 : 1.5,
                  transform: color === c ? [{ scale: 1.2 }] : [{ scale: 1 }],
                }]} />
            ))}
          </View>

          {/* Font size */}
          <View style={styles.editorRow}>
            <Text style={styles.editorLabel}>خط:</Text>
            {FONT_SIZES.map(s => (
              <Pressable key={s} onPress={() => setFontSize(s)}
                style={[styles.fsSwatch, {
                  backgroundColor: fontSize === s ? accentColor : `${accentColor}18`,
                  borderColor: accentColor,
                }]}>
                <Text style={[styles.fsSwatchText, { color: fontSize === s ? '#fff' : accentColor }]}>{s}</Text>
              </Pressable>
            ))}
          </View>

          {/* RTL */}
          <View style={styles.editorRow}>
            <Text style={styles.editorLabel}>اردو (RTL):</Text>
            <Switch
              value={rtl}
              onValueChange={setRtl}
              trackColor={{ false: '#ddd', true: `${accentColor}55` }}
              thumbColor={rtl ? accentColor : '#bbb'}
            />
          </View>

          {/* Title */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={rtl ? 'عنوان...' : 'Title...'}
            placeholderTextColor="rgba(0,0,0,0.3)"
            style={[styles.titleInput, {
              textAlign: rtl ? 'right' : 'left',
              fontSize: Math.min(fontSize + 4, 26),
              borderBottomColor: noteColor.border,
              color: Colors.text,
            }]}
          />

          {/* Content (note mode) */}
          {type === 'note' && (
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder={rtl ? 'یہاں لکھیں... (لامحدود)' : 'Write here... (unlimited)'}
              placeholderTextColor="rgba(0,0,0,0.3)"
              style={[styles.contentInput, {
                textAlign: rtl ? 'right' : 'left',
                fontSize,
                color: Colors.text,
              }]}
              multiline
              scrollEnabled={false}
              textAlignVertical="top"
            />
          )}

          {/* Task mode */}
          {type === 'task' && (
            <View style={styles.taskSection}>
              <View style={styles.taskInputRow}>
                <TextInput
                  value={taskInput}
                  onChangeText={setTaskInput}
                  placeholder="نیا کام شامل کریں..."
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  style={[styles.taskInput, { borderColor: `${accentColor}55` }]}
                  onSubmitEditing={addTask}
                  returnKeyType="done"
                />
                <Pressable onPress={addTask} style={[styles.taskAddBtn, { backgroundColor: accentColor }]}>
                  <MaterialIcons name="add" size={20} color="#fff" />
                </Pressable>
              </View>
              {tasks.map(tk => (
                <Pressable key={tk.id} onPress={() => toggleTask(tk.id)} style={styles.taskItem}>
                  <MaterialIcons
                    name={tk.done ? 'check-circle' : 'radio-button-unchecked'}
                    size={22}
                    color={tk.done ? Colors.green : accentColor}
                  />
                  <Text style={[styles.taskItemText, tk.done && styles.taskDone, { fontSize }]}>
                    {tk.text}
                  </Text>
                  <Pressable onPress={() => removeTask(tk.id)} hitSlop={8}>
                    <MaterialIcons name="close" size={16} color={Colors.red} />
                  </Pressable>
                </Pressable>
              ))}
            </View>
          )}

          {/* Tags */}
          <View style={styles.tagSection}>
            <View style={styles.tagInputRow}>
              <TextInput
                value={tagInput}
                onChangeText={setTagInput}
                placeholder="ٹیگ شامل کریں..."
                placeholderTextColor="rgba(0,0,0,0.3)"
                style={[styles.tagInput, { borderColor: `${accentColor}44` }]}
                onSubmitEditing={addTag}
                returnKeyType="done"
              />
              <Pressable onPress={addTag} style={[styles.tagAddBtn, { backgroundColor: `${accentColor}22`, borderColor: accentColor }]}>
                <MaterialIcons name="add" size={16} color={accentColor} />
              </Pressable>
            </View>
            <View style={styles.tagRow}>
              {tags.map(tag => (
                <Pressable key={tag} onPress={() => setTags(tags.filter(t => t !== tag))}
                  style={[styles.tagChip, { backgroundColor: `${accentColor}18`, borderColor: accentColor }]}>
                  <Text style={[styles.tagText, { color: accentColor }]}>#{tag}</Text>
                  <MaterialIcons name="close" size={11} color={accentColor} />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Stats */}
          <Text style={styles.statsText}>
            کلمات: {getWordCount(content)} | حروف: {content.length}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

// Note Card component
function NoteCard({
  note, onPress, onPin, onDelete, accentColor,
}: {
  note: Note;
  onPress: () => void;
  onPin: () => void;
  onDelete: () => void;
  accentColor: string;
}) {
  const nc = NOTE_COLORS[note.color];
  const done = note.tasks?.filter(t => t.done).length ?? 0;
  const total = note.tasks?.length ?? 0;
  const progress = total > 0 ? done / total : 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.noteCard,
        {
          backgroundColor: nc.bg,
          borderColor: nc.border,
          shadowColor: nc.border,
          transform: pressed ? [{ scale: 0.96 }] : [{ scale: 1 }],
          shadowOpacity: pressed ? 0.4 : 0.15,
          shadowRadius: pressed ? 12 : 4,
          elevation: pressed ? 10 : 3,
        },
      ]}
    >
      {/* Priority stripe */}
      <View style={[styles.priorityStripe, { backgroundColor: PRIORITY_COLORS[note.priority] }]} />

      <View style={styles.noteCardHeader}>
        <Text style={[styles.noteCardTitle, { fontSize: note.fontSize, textAlign: note.rtl ? 'right' : 'left' }]}
          numberOfLines={2}>
          {note.title || (note.type === 'task' ? '✅ ٹاسک' : '📝 نوٹ')}
        </Text>
        <View style={styles.noteCardActions}>
          <Pressable onPress={onPin} hitSlop={6}>
            <MaterialIcons name={note.pinned ? 'push-pin' : 'push-pin'} size={16}
              color={note.pinned ? accentColor : 'rgba(0,0,0,0.25)'} />
          </Pressable>
        </View>
      </View>

      {note.type === 'note' && note.content ? (
        <Text style={[styles.noteCardPreview, { textAlign: note.rtl ? 'right' : 'left', fontSize: note.fontSize - 2 }]}
          numberOfLines={4}>
          {note.content}
        </Text>
      ) : null}

      {note.type === 'task' && total > 0 && (
        <View style={styles.taskProgress}>
          <View style={styles.taskProgressBg}>
            <View style={[styles.taskProgressFill, { width: `${progress * 100}%`, backgroundColor: PRIORITY_COLORS[note.priority] }]} />
          </View>
          <Text style={styles.taskProgressText}>{done}/{total} مکمل</Text>
        </View>
      )}

      {note.tags.length > 0 && (
        <View style={styles.noteTagRow}>
          {note.tags.slice(0, 3).map(tag => (
            <View key={tag} style={[styles.noteTagChip, { backgroundColor: `${accentColor}14` }]}>
              <Text style={[styles.noteTagText, { color: accentColor }]}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.noteCardDate}>{note.updatedAt}</Text>
    </Pressable>
  );
}

export default function NotepadScreen() {
  const insets = useSafeAreaInsets();
  const { currentTheme, liveBg } = useApp();

  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'note' | 'task' | 'pinned'>('all');
  const [editNote, setEditNote] = useState<Partial<Note> | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [viewNote, setViewNote] = useState<Note | null>(null);

  useEffect(() => { loadNotes(); }, []);

  const loadNotes = async () => {
    const all = await NotesService.getAll();
    setNotes(all);
  };

  const filtered = notes.filter(n => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'note' && n.type === 'note') ||
      (filter === 'task' && n.type === 'task') ||
      (filter === 'pinned' && n.pinned);
    const matchSearch = !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const openNew = () => { setEditNote(null); setShowEditor(true); };

  const openEdit = (n: Note) => { setEditNote(n); setShowDetail(null); setShowEditor(true); };

  const [showDetail, setShowDetail] = useState<Note | null>(null);

  const handleSave = useCallback(async (data: any) => {
    if (editNote?.id) {
      await NotesService.update(editNote.id, data);
    } else {
      await NotesService.save(data);
    }
    setShowEditor(false);
    setEditNote(null);
    loadNotes();
  }, [editNote]);

  const handleDelete = useCallback(async (id: string) => {
    Alert.alert('حذف کریں؟', 'یہ نوٹ مستقل طور پر حذف ہو جائے گا۔', [
      { text: 'نہیں', style: 'cancel' },
      {
        text: 'ہاں', style: 'destructive', onPress: async () => {
          await NotesService.delete(id);
          setShowDetail(null);
          loadNotes();
        }
      },
    ]);
  }, []);

  const handlePin = useCallback(async (id: string) => {
    await NotesService.togglePin(id);
    loadNotes();
  }, []);

  const handleTaskToggle = useCallback(async (noteId: string, taskId: string) => {
    await NotesService.toggleTask(noteId, taskId);
    loadNotes();
  }, []);

  const FILTER_TABS = [
    { key: 'all',    label: 'سب'   },
    { key: 'note',   label: '📝 نوٹ' },
    { key: 'task',   label: '✅ ٹاسک' },
    { key: 'pinned', label: '📌 پن' },
  ];

  const totals = {
    words: notes.reduce((a, n) => a + n.wordCount, 0),
    chars: notes.reduce((a, n) => a + n.charCount, 0),
    tasks: notes.filter(n => n.type === 'task').length,
    done: notes.reduce((a, n) => a + (n.tasks?.filter(t => t.done).length ?? 0), 0),
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: currentTheme.bg1 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={currentTheme.bg1} />
      <AnimatedBackground color1={currentTheme.accent} color2={currentTheme.glow} liveBg={liveBg} />

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: currentTheme.accent }]}>📓 نوٹ پیڈ</Text>
        <Pressable
          onPress={openNew}
          style={[styles.fabBtn, { backgroundColor: currentTheme.accent, shadowColor: currentTheme.accent }]}
        >
          <MaterialIcons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      {/* Stats bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
        {[
          { label: 'نوٹس', value: notes.length },
          { label: 'کلمات', value: totals.words },
          { label: 'حروف', value: totals.chars },
          { label: 'ٹاسک مکمل', value: totals.done },
        ].map(s => (
          <View key={s.label} style={[styles.statBox, { borderColor: `${currentTheme.accent}44` }]}>
            <Text style={[styles.statNum, { color: currentTheme.accent }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Search */}
      <View style={[styles.searchBox, { borderColor: `${currentTheme.accent}44` }]}>
        <MaterialIcons name="search" size={18} color={currentTheme.accent} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="نوٹ تلاش کریں..."
          placeholderTextColor={Colors.textDim}
          style={[styles.searchInput, { color: Colors.text }]}
        />
        {search ? (
          <Pressable onPress={() => setSearch('')}>
            <MaterialIcons name="close" size={16} color={Colors.textDim} />
          </Pressable>
        ) : null}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterOuter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTER_TABS.map(f => {
            const active = f.key === filter;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key as any)}
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
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Notes Grid */}
      <FlatList
        data={filtered}
        keyExtractor={n => n.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📓</Text>
            <Text style={[styles.emptyText, { color: currentTheme.accent }]}>کوئی نوٹ نہیں</Text>
            <Text style={styles.emptyHint}>+ بٹن سے نیا نوٹ یا ٹاسک شامل کریں</Text>
            <Pressable onPress={openNew} style={[styles.emptyAddBtn, { backgroundColor: currentTheme.accent }]}>
              <Text style={styles.emptyAddBtnText}>+ نیا نوٹ</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            accentColor={currentTheme.accent}
            onPress={() => setShowDetail(item)}
            onPin={() => handlePin(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />

      {/* Detail Modal */}
      <Modal visible={Boolean(showDetail)} transparent animationType="fade" onRequestClose={() => setShowDetail(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setShowDetail(null)} />
        {showDetail && (
          <View style={[styles.detailBox, { backgroundColor: NOTE_COLORS[showDetail.color].bg }]}>
            <View style={styles.detailHeader}>
              <Text style={[styles.detailTitleText, { color: currentTheme.accent }]}>{showDetail.title}</Text>
              <View style={styles.detailHeaderRight}>
                <Pressable onPress={() => openEdit(showDetail)} hitSlop={8}>
                  <MaterialIcons name="edit" size={20} color={currentTheme.accent} />
                </Pressable>
                <Pressable onPress={() => handleDelete(showDetail.id)} hitSlop={8}>
                  <MaterialIcons name="delete" size={20} color={Colors.red} />
                </Pressable>
                <Pressable onPress={() => setShowDetail(null)} hitSlop={8}>
                  <MaterialIcons name="close" size={20} color={Colors.textDim} />
                </Pressable>
              </View>
            </View>
            <ScrollView style={{ maxHeight: 350 }} showsVerticalScrollIndicator={false}>
              {showDetail.type === 'note' ? (
                <Text style={[styles.detailContent, { textAlign: showDetail.rtl ? 'right' : 'left', fontSize: showDetail.fontSize }]}>
                  {showDetail.content}
                </Text>
              ) : (
                showDetail.tasks?.map(tk => (
                  <Pressable key={tk.id} onPress={() => handleTaskToggle(showDetail.id, tk.id)} style={styles.taskItem}>
                    <MaterialIcons
                      name={tk.done ? 'check-circle' : 'radio-button-unchecked'}
                      size={22}
                      color={tk.done ? Colors.green : currentTheme.accent}
                    />
                    <Text style={[styles.taskItemText, tk.done && styles.taskDone]}>
                      {tk.text}
                    </Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
            <Text style={styles.detailMeta}>
              🕐 {showDetail.updatedAt} • {showDetail.wordCount} کلمے • {showDetail.charCount} حروف
            </Text>
          </View>
        )}
      </Modal>

      {/* Editor */}
      {showEditor && (
        <NoteEditor
          note={editNote}
          onClose={() => { setShowEditor(false); setEditNote(null); }}
          onSave={handleSave}
          accentColor={currentTheme.accent}
        />
      )}
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
    paddingBottom: 6,
  },
  title: { fontSize: FontSize.xl, fontWeight: '800' },
  fabBtn: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  statsRow: { paddingHorizontal: Spacing.lg, gap: 10, paddingBottom: 8 },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#6040ee',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNum: { fontSize: FontSize.xl, fontWeight: '900' },
  statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  filterChipText: { fontSize: FontSize.sm, fontWeight: '700' },
  list: { paddingHorizontal: Spacing.md, paddingBottom: 100, gap: 10 },
  gridRow: { gap: 10, justifyContent: 'space-between' },
  noteCard: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    padding: Spacing.md,
    gap: 6,
    maxWidth: '48%',
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
    overflow: 'hidden',
  },
  priorityStripe: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg },
  noteCardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 4 },
  noteCardTitle: { fontWeight: '800', flex: 1, color: Colors.text },
  noteCardActions: { flexDirection: 'row', gap: 4 },
  noteCardPreview: { color: Colors.textMuted, lineHeight: 18 },
  taskProgress: { gap: 4 },
  taskProgressBg: { height: 5, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' },
  taskProgressFill: { height: 5, borderRadius: 3 },
  taskProgressText: { fontSize: FontSize.xs, color: Colors.textMuted },
  noteTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  noteTagChip: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.pill },
  noteTagText: { fontSize: 10, fontWeight: '700' },
  noteCardDate: { fontSize: 10, color: 'rgba(0,0,0,0.3)', textAlign: 'right' },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyIcon: { fontSize: 60 },
  emptyText: { fontSize: FontSize.lg, fontWeight: '700' },
  emptyHint: { color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center' },
  emptyAddBtn: { paddingHorizontal: 24, paddingVertical: 11, borderRadius: Radius.pill, marginTop: 4 },
  emptyAddBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.md },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  detailBox: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: Spacing.lg,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 20,
  },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  detailTitleText: { fontSize: FontSize.xl, fontWeight: '900', flex: 1 },
  detailHeaderRight: { flexDirection: 'row', gap: 12 },
  detailContent: { lineHeight: 26, color: Colors.text },
  detailMeta: { fontSize: FontSize.xs, color: Colors.textDim, textAlign: 'center', marginTop: 12 },

  // Editor styles
  editorRoot: { flex: 1 },
  editorToolbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: 12,
    borderBottomWidth: 1,
  },
  editorToolbarTitle: { fontSize: FontSize.lg, fontWeight: '800' },
  saveNoteBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.pill },
  saveNoteBtnText: { color: '#fff', fontWeight: '800', fontSize: FontSize.sm },
  editorScroll: { padding: Spacing.lg, gap: 12, paddingBottom: 60 },
  editorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  editorLabel: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '700', width: 50 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill, borderWidth: 1.5 },
  typeChipText: { fontSize: FontSize.xs, fontWeight: '700' },
  colorCircle: { width: 28, height: 28, borderRadius: 14 },
  fsSwatch: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.pill, borderWidth: 1.5 },
  fsSwatchText: { fontSize: FontSize.xs, fontWeight: '700' },
  titleInput: {
    borderBottomWidth: 1.5,
    paddingVertical: 8,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  contentInput: {
    minHeight: 200,
    lineHeight: 26,
    color: Colors.text,
  },
  taskSection: { gap: 8 },
  taskInputRow: { flexDirection: 'row', gap: 8 },
  taskInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: FontSize.md,
    backgroundColor: 'rgba(255,255,255,0.8)',
    color: Colors.text,
  },
  taskAddBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  taskItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  taskItemText: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  taskDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  tagSection: { gap: 6 },
  tagInputRow: { flexDirection: 'row', gap: 8 },
  tagInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: FontSize.sm,
    backgroundColor: 'rgba(255,255,255,0.8)',
    color: Colors.text,
  },
  tagAddBtn: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: Radius.md, borderWidth: 1.5, justifyContent: 'center' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.pill, borderWidth: 1 },
  tagText: { fontSize: FontSize.xs, fontWeight: '700' },
  statsText: { fontSize: FontSize.xs, color: Colors.textDim, textAlign: 'center' },
});
