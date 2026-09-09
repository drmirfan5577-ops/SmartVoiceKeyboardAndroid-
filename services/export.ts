// Powered by OnSpace.AI
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform, Share } from 'react-native';

export type ExportFormat = 'txt' | 'json' | 'html' | 'pdf' | 'md';

export interface ExportOptions {
  filename?: string;
  format?: ExportFormat;
  includeMetadata?: boolean;
}

export interface BackupData {
  version: string;
  exportDate: string;
  appName: string;
  author: string;
  copyright?: string;
  clipboard: any[];
  phrases: any[];
  preferences: {
    theme: string;
    fontSize: number;
  };
  legalNote?: string;
  [key: string]: any;
}

export const ExportService = {
  /**
   * Export typed text to a file and share/download it
   */
  async exportText(text: string, options: ExportOptions = {}): Promise<boolean> {
    try {
      const {
        filename = 'smart_keyboard_text',
        format = 'txt',
        includeMetadata = true,
      } = options;

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const fullName = `${filename}_${timestamp}.${format}`;
      const filePath = `${FileSystem.documentDirectory}${fullName}`;

      const meta = includeMetadata
        ? `SMART Voice Keyboard Pro\nتاریخ: ${new Date().toLocaleString('ur-PK')}\n${'─'.repeat(40)}\n\n`
        : '';

      let content = '';
      switch (format) {
        case 'txt':
          content = meta + text;
          break;

        case 'md':
          content = `# SMART Voice Keyboard Export\n\n**تاریخ:** ${new Date().toLocaleString('ur-PK')}\n\n---\n\n${text}`;
          break;

        case 'html':
          content = `<!DOCTYPE html>
<html dir="auto" lang="ur">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SMART Keyboard Export</title>
  <style>
    body { font-family: Arial, sans-serif; direction: rtl; padding: 2rem; line-height: 1.8; color: #333; }
    h1 { color: #4c35e8; }
    .meta { color: #888; font-size: 0.9em; margin-bottom: 2rem; }
    .content { font-size: 1.1em; white-space: pre-wrap; }
    footer { margin-top: 3rem; color: #aaa; font-size: 0.8em; }
  </style>
</head>
<body>
  <h1>SMART Voice Keyboard Pro</h1>
  <div class="meta">تاریخ: ${new Date().toLocaleString('ur-PK')}</div>
  <div class="content">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</div>
  <footer>© SMART World Order — Dr M Irfan Qadir Thaheem</footer>
</body>
</html>`;
          break;

        case 'json':
          content = JSON.stringify({
            text,
            exportDate: new Date().toISOString(),
            app: 'SMART Voice Keyboard Pro',
            author: 'Dr M Irfan Qadir Thaheem',
            copyright: 'SMART World Order',
          }, null, 2);
          break;

        default:
          content = meta + text;
      }

      await FileSystem.writeAsStringAsync(filePath, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await ExportService._shareFile(filePath, getMimeType(format as ExportFormat), fullName, text);
      return true;
    } catch (e) {
      console.error('[ExportService] exportText error:', e);
      return false;
    }
  },

  /**
   * Export text as PDF — uses HTML export as fallback if expo-print unavailable
   */
  async exportPDF(text: string, filename = 'smart_keyboard'): Promise<boolean> {
    try {
      // Try expo-print; fall back to HTML export if module not available
      let Print: any = null;
      try {
        Print = require('expo-print');
      } catch {
        Print = null;
      }

      const htmlContent = `<!DOCTYPE html>
<html dir="auto" lang="ur">
<head>
  <meta charset="UTF-8">
  <title>SMART Keyboard Export</title>
  <style>
    body { font-family: Arial, sans-serif; direction: rtl; padding: 40px; line-height: 2.0; color: #222; font-size: 16px; }
    h1 { color: #4c35e8; font-size: 24px; margin-bottom: 8px; }
    .meta { color: #888; font-size: 12px; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 12px; }
    .content { font-size: 18px; white-space: pre-wrap; line-height: 2.2; }
    footer { margin-top: 50px; color: #aaa; font-size: 11px; border-top: 1px solid #eee; padding-top: 12px; text-align: center; }
  </style>
</head>
<body>
  <h1>SMART Voice Keyboard Pro</h1>
  <div class="meta">تاریخ برآمد: ${new Date().toLocaleString('ur-PK')}</div>
  <div class="content">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</div>
  <footer>© SMART World Order | Dr M Irfan Qadir Thaheem</footer>
</body>
</html>`;

      if (Print) {
        const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });
        const timestamp = new Date().toISOString().slice(0, 10);
        const destPath = `${FileSystem.documentDirectory}${filename}_${timestamp}.pdf`;
        await FileSystem.moveAsync({ from: uri, to: destPath });
        await ExportService._shareFile(destPath, 'application/pdf', `${filename}.pdf`, '');
      } else {
        // Fallback: export as HTML
        return ExportService.exportText(text, { filename, format: 'html', includeMetadata: true });
      }
      return true;
    } catch (e) {
      console.error('[ExportService] exportPDF error:', e);
      return false;
    }
  },

  /**
   * Create a full backup of app data and share it
   */
  async createBackup(data: BackupData): Promise<boolean> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `smart_keyboard_backup_${timestamp}.json`;
      const filePath = `${FileSystem.documentDirectory}${filename}`;

      const content = JSON.stringify(data, null, 2);
      await FileSystem.writeAsStringAsync(filePath, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await ExportService._shareFile(filePath, 'application/json', filename, content);
      return true;
    } catch (e) {
      console.error('[ExportService] createBackup error:', e);
      return false;
    }
  },

  /**
   * Internal share helper — uses native Sharing if available, falls back to Share
   */
  async _shareFile(filePath: string, mimeType: string, filename: string, fallbackText: string): Promise<void> {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(filePath, {
          mimeType,
          dialogTitle: 'فائل شیئر/ڈاؤن لوڈ کریں',
        });
      } else {
        await Share.share({ message: fallbackText || filename, title: filename });
      }
    } catch (e) {
      console.warn('[ExportService] share error:', e);
    }
  },

  /**
   * List saved exports in the document directory
   */
  async listExports(): Promise<string[]> {
    try {
      const dir = FileSystem.documentDirectory;
      if (!dir) return [];
      const files = await FileSystem.readDirectoryAsync(dir);
      return files.filter(f =>
        f.startsWith('smart_keyboard') &&
        (f.endsWith('.txt') || f.endsWith('.json') || f.endsWith('.pdf') || f.endsWith('.html') || f.endsWith('.md'))
      );
    } catch {
      return [];
    }
  },
};

function getMimeType(format: ExportFormat): string {
  const map: Record<ExportFormat, string> = {
    txt:  'text/plain',
    json: 'application/json',
    html: 'text/html',
    pdf:  'application/pdf',
    md:   'text/markdown',
  };
  return map[format] ?? 'text/plain';
}
