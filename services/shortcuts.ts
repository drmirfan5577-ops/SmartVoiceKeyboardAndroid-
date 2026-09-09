// Powered by OnSpace.AI
import * as Clipboard from 'expo-clipboard';
import { Share } from 'react-native';

export interface ShortcutResult {
  success: boolean;
  message: string;
  newText?: string;
}

// Key shortcut definitions (Ctrl+X combinations)
export const KEYBOARD_SHORTCUTS: Record<string, { label: string; description: string; icon: string }> = {
  'A': { label: 'Ctrl+A', description: 'سب منتخب',       icon: '⬛' },
  'C': { label: 'Ctrl+C', description: 'کاپی',            icon: '📋' },
  'X': { label: 'Ctrl+X', description: 'کٹ',              icon: '✂️' },
  'V': { label: 'Ctrl+V', description: 'پیسٹ',            icon: '📌' },
  'Z': { label: 'Ctrl+Z', description: 'واپس کریں',       icon: '↩️' },
  'Y': { label: 'Ctrl+Y', description: 'آگے کریں',        icon: '↪️' },
  'S': { label: 'Ctrl+S', description: 'محفوظ کریں',      icon: '💾' },
  'B': { label: 'Ctrl+B', description: 'موٹا',             icon: '𝐁' },
  'I': { label: 'Ctrl+I', description: 'ترچھا',           icon: '𝘐' },
  'U': { label: 'Ctrl+U', description: 'خط زیر',          icon: '𝘜̲' },
  'K': { label: 'Ctrl+K', description: 'لنک',             icon: '🔗' },
  'D': { label: 'Ctrl+D', description: 'لائن حذف',        icon: '🗑️' },
  'E': { label: 'Ctrl+E', description: 'درمیان',          icon: '≡' },
  'L': { label: 'Ctrl+L', description: 'بائیں',           icon: '←' },
  'R': { label: 'Ctrl+R', description: 'دائیں',           icon: '→' },
  'P': { label: 'Ctrl+P', description: 'پرنٹ/شیئر',      icon: '🖨️' },
  'W': { label: 'Ctrl+W', description: 'الفاظ گنیں',      icon: '🔢' },
  'H': { label: 'Ctrl+H', description: 'تلاش و تبدیل',   icon: '🔍' },
};

export const ShortcutService = {
  /**
   * Execute a Ctrl+key shortcut
   */
  async execute(
    key: string,
    currentText: string,
    onTextChange: (text: string) => void,
    history: { undo: string[]; redo: string[] }
  ): Promise<ShortcutResult> {
    const upper = key.toUpperCase();

    switch (upper) {
      case 'C': {
        if (!currentText) return { success: false, message: 'متن نہیں ملا' };
        await Clipboard.setStringAsync(currentText);
        return { success: true, message: '✓ متن کاپی ہو گیا!' };
      }

      case 'X': {
        if (!currentText) return { success: false, message: 'متن نہیں ملا' };
        await Clipboard.setStringAsync(currentText);
        history.undo.push(currentText);
        onTextChange('');
        return { success: true, message: '✓ متن کٹ ہو گیا!' };
      }

      case 'V': {
        const pasted = await Clipboard.getStringAsync();
        if (!pasted) return { success: false, message: 'کلپ بورڈ خالی ہے' };
        history.undo.push(currentText);
        onTextChange(currentText + pasted);
        return { success: true, message: '✓ پیسٹ ہو گیا!' };
      }

      case 'Z': {
        if (history.undo.length === 0) return { success: false, message: 'واپس کرنے کے لیے کچھ نہیں' };
        const prev = history.undo.pop()!;
        history.redo.push(currentText);
        onTextChange(prev);
        return { success: true, message: '✓ واپس کیا گیا' };
      }

      case 'Y': {
        if (history.redo.length === 0) return { success: false, message: 'آگے کرنے کے لیے کچھ نہیں' };
        const next = history.redo.pop()!;
        history.undo.push(currentText);
        onTextChange(next);
        return { success: true, message: '✓ آگے کیا گیا' };
      }

      case 'A': {
        return { success: true, message: 'متن منتخب ہے', newText: currentText };
      }

      case 'D': {
        const lines = currentText.split('\n');
        if (lines.length > 1) {
          lines.pop();
          history.undo.push(currentText);
          onTextChange(lines.join('\n'));
          return { success: true, message: '✓ آخری لائن حذف کی گئی' };
        }
        return { success: false, message: 'صرف ایک لائن ہے' };
      }

      case 'P': {
        if (!currentText) return { success: false, message: 'متن نہیں ملا' };
        try {
          await Share.share({ message: currentText, title: 'SMART Voice Keyboard' });
          return { success: true, message: '✓ شیئر کیا گیا' };
        } catch {
          return { success: false, message: 'شیئر نہیں ہو سکا' };
        }
      }

      case 'W': {
        const words = currentText.trim().split(/\s+/).filter(Boolean).length;
        const chars = [...currentText].length;
        const lines = currentText.split('\n').length;
        return {
          success: true,
          message: `الفاظ: ${words} | حروف: ${chars} | لائنیں: ${lines}`,
        };
      }

      default:
        return { success: false, message: `شارٹ کٹ نہیں ملا: Ctrl+${key}` };
    }
  },
};
