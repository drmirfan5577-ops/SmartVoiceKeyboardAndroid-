// Powered by OnSpace.AI
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEMPLATES_KEY = 'sw_templates_v2';

export interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
  lang: 'ur' | 'en' | 'both';
  createdAt: string;
  isCustom?: boolean;
}

export const BUILT_IN_TEMPLATES: Template[] = [
  // Urdu templates
  { id: 'bt1',  title: 'سلام',              category: 'عام',        lang: 'ur', createdAt: '', content: 'السلام علیکم! امید ہے آپ بخیر ہوں گے۔' },
  { id: 'bt2',  title: 'شکریہ',             category: 'عام',        lang: 'ur', createdAt: '', content: 'آپ کا بہت بہت شکریہ! اللہ آپ کو خوش رکھے۔ جزاک اللہ خیر' },
  { id: 'bt3',  title: 'معافی',             category: 'عام',        lang: 'ur', createdAt: '', content: 'مجھے معاف کریں، مجھ سے غلطی ہو گئی۔ آئندہ خیال رکھوں گا۔' },
  { id: 'bt4',  title: 'مبارکباد',          category: 'تہوار',      lang: 'ur', createdAt: '', content: 'آپ کو دلی مبارکباد! اللہ تعالیٰ آپ کو ہمیشہ خوش رکھے اور ہر قدم پر کامیابی عطا فرمائے۔ آمین' },
  { id: 'bt5',  title: 'عیدین مبارک',       category: 'تہوار',      lang: 'ur', createdAt: '', content: 'عید مبارک! اللہ تعالیٰ آپ کی عید قبول فرمائے اور ہم سب کو گناہوں سے پاک کرے۔ آمین' },
  { id: 'bt6',  title: 'واٹس ایپ سلام',    category: 'سوشل میڈیا', lang: 'ur', createdAt: '', content: 'السلام علیکم ورحمۃ اللہ وبرکاتہ\nامید ہے آپ اور آپ کا خاندان بالکل ٹھیک ہوں گے۔' },
  { id: 'bt7',  title: 'دعائے خیر',         category: 'دعا',        lang: 'ur', createdAt: '', content: 'اللہ تعالیٰ آپ کو صحت، خوشحالی اور کامیابی عطا فرمائے۔ انشاءاللہ' },
  { id: 'bt8',  title: 'رمضان مبارک',       category: 'تہوار',      lang: 'ur', createdAt: '', content: 'رمضان المبارک مبارک ہو! اللہ تعالیٰ آپ کے روزے قبول فرمائے۔ آمین' },
  { id: 'bt9',  title: 'خط کا آغاز',       category: 'دفتر',       lang: 'ur', createdAt: '', content: 'جناب عالی،\nبموجب خط ہذا گزارش ہے کہ' },
  { id: 'bt10', title: 'خط کا اختتام',     category: 'دفتر',       lang: 'ur', createdAt: '', content: 'والسلام\nآپ کا مخلص\n\nتاریخ:' },
  { id: 'bt11', title: 'درخواست',           category: 'دفتر',       lang: 'ur', createdAt: '', content: 'جناب/محترمہ\nبڑے ادب کے ساتھ گزارش ہے کہ\n\nلہٰذا التماس ہے کہ مجھے اجازت مرحمت فرمائی جائے۔\nشکریہ' },
  { id: 'bt12', title: 'SMS سلام',          category: 'سوشل میڈیا', lang: 'ur', createdAt: '', content: 'آداب 🙏 آپ سے رابطہ کرنا تھا۔ کیا آپ کے پاس تھوڑا وقت ہے؟' },

  // English templates
  { id: 'bt13', title: 'Hello',            category: 'General',    lang: 'en', createdAt: '', content: 'Hello! Hope you are doing well. I wanted to get in touch with you.' },
  { id: 'bt14', title: 'Thank You',        category: 'General',    lang: 'en', createdAt: '', content: 'Thank you so much for your help and support. I really appreciate it!' },
  { id: 'bt15', title: 'Email Opening',    category: 'Office',     lang: 'en', createdAt: '', content: 'Dear Sir/Madam,\n\nI hope this email finds you in good health. I am writing to inform you that' },
  { id: 'bt16', title: 'Email Closing',    category: 'Office',     lang: 'en', createdAt: '', content: 'Best regards,\n\n[Your Name]\n[Position]\n[Contact]' },
  { id: 'bt17', title: 'Leave Request',    category: 'Office',     lang: 'en', createdAt: '', content: 'Dear Manager,\n\nI would like to request leave from [date] to [date] due to [reason].\n\nThank you for your consideration.\n\nRegards,' },
  { id: 'bt18', title: 'WhatsApp Greet',  category: 'Social',     lang: 'en', createdAt: '', content: 'Hi! How are you doing? Hope everything is going great on your end! 😊' },
  { id: 'bt19', title: 'Birthday Wish',   category: 'Occasions',  lang: 'en', createdAt: '', content: 'Happy Birthday! 🎂 Wishing you a wonderful day filled with joy and happiness! May all your dreams come true!' },
  { id: 'bt20', title: 'Apology',         category: 'General',    lang: 'en', createdAt: '', content: 'I sincerely apologize for any inconvenience caused. I take full responsibility and will make sure this does not happen again.' },
];

export const TEMPLATE_CATEGORIES = ['عام', 'تہوار', 'دعا', 'دفتر', 'سوشل میڈیا', 'General', 'Office', 'Social', 'Occasions', 'Custom'];

export const TemplatesService = {
  async getAll(): Promise<Template[]> {
    try {
      const raw = await AsyncStorage.getItem(TEMPLATES_KEY);
      const custom: Template[] = raw ? JSON.parse(raw) : [];
      return [...BUILT_IN_TEMPLATES, ...custom];
    } catch {
      return [...BUILT_IN_TEMPLATES];
    }
  },

  async getCustom(): Promise<Template[]> {
    try {
      const raw = await AsyncStorage.getItem(TEMPLATES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async save(template: Omit<Template, 'id' | 'createdAt' | 'isCustom'>): Promise<Template> {
    const newTpl: Template = {
      ...template,
      id: `ct_${Date.now()}`,
      createdAt: new Date().toLocaleString('ur-PK'),
      isCustom: true,
    };
    try {
      const customs = await TemplatesService.getCustom();
      customs.push(newTpl);
      await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(customs));
    } catch {}
    return newTpl;
  },

  async delete(id: string): Promise<void> {
    try {
      const customs = await TemplatesService.getCustom();
      const filtered = customs.filter(t => t.id !== id);
      await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered));
    } catch {}
  },

  async update(id: string, updates: Partial<Template>): Promise<void> {
    try {
      const customs = await TemplatesService.getCustom();
      const idx = customs.findIndex(t => t.id === id);
      if (idx >= 0) {
        customs[idx] = { ...customs[idx], ...updates };
        await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(customs));
      }
    } catch {}
  },
};
