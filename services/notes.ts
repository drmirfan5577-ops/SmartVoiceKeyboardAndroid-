// Powered by OnSpace.AI
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'sw_notes_v2';

export type NoteColor = 'white' | 'yellow' | 'mint' | 'sky' | 'pink' | 'lavender';
export type NotePriority = 'low' | 'medium' | 'high';
export type NoteType = 'note' | 'task';

export interface TaskItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tasks?: TaskItem[];
  type: NoteType;
  color: NoteColor;
  priority: NotePriority;
  pinned: boolean;
  tags: string[];
  fontSize: number;
  rtl: boolean;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  charCount: number;
}

export const NOTE_COLORS: Record<NoteColor, { bg: string; border: string; label: string }> = {
  white:    { bg: '#ffffff',   border: '#c0b8ff', label: 'سفید'    },
  yellow:   { bg: '#fffde7',   border: '#f9c800', label: 'پیلا'    },
  mint:     { bg: '#e8faf2',   border: '#00c97a', label: 'سبز'     },
  sky:      { bg: '#e8f4ff',   border: '#2196f3', label: 'نیلا'    },
  pink:     { bg: '#fff0f6',   border: '#e91e8c', label: 'گلابی'   },
  lavender: { bg: '#f5eeff',   border: '#9c27b0', label: 'بنفشی'  },
};

export const PRIORITY_COLORS: Record<NotePriority, string> = {
  low:    '#4caf50',
  medium: '#ff9800',
  high:   '#f44336',
};

export const NotesService = {
  async getAll(): Promise<Note[]> {
    try {
      const raw = await AsyncStorage.getItem(NOTES_KEY);
      const notes: Note[] = raw ? JSON.parse(raw) : [];
      return notes.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
    } catch {
      return [];
    }
  },

  async save(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'wordCount' | 'charCount'>): Promise<Note> {
    const now = new Date().toLocaleString('ur-PK');
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      wordCount: note.content.trim() ? note.content.trim().split(/\s+/).length : 0,
      charCount: note.content.length,
    };
    const notes = await NotesService.getAll();
    notes.unshift(newNote);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return newNote;
  },

  async update(id: string, updates: Partial<Note>): Promise<Note | null> {
    const notes = await NotesService.getAll();
    const idx = notes.findIndex(n => n.id === id);
    if (idx < 0) return null;
    const content = updates.content ?? notes[idx].content;
    notes[idx] = {
      ...notes[idx],
      ...updates,
      updatedAt: new Date().toLocaleString('ur-PK'),
      wordCount: content.trim() ? content.trim().split(/\s+/).length : 0,
      charCount: content.length,
    };
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return notes[idx];
  },

  async delete(id: string): Promise<void> {
    const notes = await NotesService.getAll();
    const filtered = notes.filter(n => n.id !== id);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
  },

  async togglePin(id: string): Promise<void> {
    const notes = await NotesService.getAll();
    const idx = notes.findIndex(n => n.id === id);
    if (idx >= 0) {
      notes[idx].pinned = !notes[idx].pinned;
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    }
  },

  async toggleTask(noteId: string, taskId: string): Promise<void> {
    const notes = await NotesService.getAll();
    const idx = notes.findIndex(n => n.id === noteId);
    if (idx >= 0 && notes[idx].tasks) {
      const tidx = notes[idx].tasks!.findIndex(t => t.id === taskId);
      if (tidx >= 0) {
        notes[idx].tasks![tidx].done = !notes[idx].tasks![tidx].done;
        notes[idx].updatedAt = new Date().toLocaleString('ur-PK');
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      }
    }
  },
};
