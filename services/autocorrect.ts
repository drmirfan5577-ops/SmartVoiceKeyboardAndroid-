// Powered by OnSpace.AI
import AsyncStorage from '@react-native-async-storage/async-storage';

const CUSTOM_DICT_KEY = 'sw_custom_dict';
const CORRECTIONS_KEY = 'sw_corrections';

// Urdu common misspelling map: misspelled → correct
const URDU_CORRECTIONS: Record<string, string> = {
  'ھے': 'ہے',
  'ھیں': 'ہیں',
  'ھو': 'ہو',
  'ھوں': 'ہوں',
  'ھوگا': 'ہوگا',
  'ھوگی': 'ہوگی',
  'انشاللہ': 'انشاءاللہ',
  'ماشاللہ': 'ماشاءاللہ',
  'الحمد للہ': 'الحمدللہ',
  'پاکستن': 'پاکستان',
  'آپبیتی': 'آپ بیتی',
  'السلاملیکم': 'السلام علیکم',
  'میرا': 'میرا',
  'تمہارا': 'تمہارا',
  'کیلئے': 'کے لیے',
  'لئے': 'لیے',
  'آیئے': 'آیے',
  'جائیے': 'جائیے',
  'دیکھئے': 'دیکھیے',
};

// English common corrections
const ENGLISH_CORRECTIONS: Record<string, string> = {
  'teh': 'the',
  'adn': 'and',
  'fo': 'of',
  'hte': 'the',
  'taht': 'that',
  'thsi': 'this',
  'wiht': 'with',
  'recieve': 'receive',
  'beleive': 'believe',
  'seperate': 'separate',
  'occured': 'occurred',
  'tommorow': 'tomorrow',
  'tomoro': 'tomorrow',
  'plase': 'please',
  'thnks': 'thanks',
  'thnakyou': 'thank you',
  'youre': "you're",
  'dont': "don't",
  'cant': "can't",
  'wont': "won't",
  'isnt': "isn't",
  'wasnt': "wasn't",
  'alot': 'a lot',
  'alright': 'all right',
};

// Urdu dictionary for spell checking
const URDU_DICTIONARY = new Set([
  'کا','کی','کے','میں','اور','یہ','وہ','ہے','ہیں','ہو',
  'کر','سے','پر','نے','کو','ہوں','تھا','تھی','گا','گی',
  'آپ','ہم','تم','کیا','نہیں','ہاں','بھی','تو','اب','جب',
  'کب','کہاں','کیوں','کیسے','کون','جو','لیکن','اگر','کیونکہ',
  'اس','ان','اسے','انہیں','آج','کل','ابھی','پھر','صرف','بہت',
  'زیادہ','کم','اچھا','برا','بڑا','چھوٹا','پاکستان','اللہ',
  'محمد','اسلام','دل','وقت','زندگی','گھر','کام','ضروری',
  'اہم','خاص','عام','پہلے','بعد','ساتھ','بغیر','نیچے','اوپر',
  'آنا','جانا','کرنا','دیکھنا','سننا','پڑھنا','لکھنا','کھانا',
  'پینا','سونا','اٹھنا','بیٹھنا','چلنا','دوڑنا','ہنسنا','رونا',
  'السلام','علیکم','شکریہ','معاف','خوش','آمدید','مبارک',
  'انشاءاللہ','ماشاءاللہ','الحمدللہ','سبحان','اللہ','اکبر',
]);

// English dictionary (small subset for speed)
const ENGLISH_DICTIONARY = new Set([
  'the','and','for','are','but','not','you','all','can','her',
  'was','one','our','out','day','get','has','him','his','how',
  'its','new','now','old','see','two','way','who','boy','did',
  'does','from','have','here','this','that','they','with','will',
  'your','been','good','more','very','when','come','just','like',
  'long','make','many','over','such','take','than','them','well',
  'were','hello','please','thank','sorry','great','today','time',
  'work','home','love','life','world','people','year','know',
  'think','help','want','need','give','call','keep','let','put',
  'use','also','back','into','look','most','into','like','only',
  'other','then','some','those','same','both','each','which','after',
]);

export interface CorrectionResult {
  original: string;
  corrected: string;
  wasChanged: boolean;
}

export const AutoCorrect = {
  async getCustomDictionary(): Promise<Set<string>> {
    try {
      const raw = await AsyncStorage.getItem(CUSTOM_DICT_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  },

  async addCustomWord(word: string): Promise<void> {
    try {
      const dict = await AutoCorrect.getCustomDictionary();
      dict.add(word.trim());
      await AsyncStorage.setItem(CUSTOM_DICT_KEY, JSON.stringify([...dict]));
    } catch {}
  },

  async removeCustomWord(word: string): Promise<void> {
    try {
      const dict = await AutoCorrect.getCustomDictionary();
      dict.delete(word.trim());
      await AsyncStorage.setItem(CUSTOM_DICT_KEY, JSON.stringify([...dict]));
    } catch {}
  },

  async getCustomWords(): Promise<string[]> {
    const dict = await AutoCorrect.getCustomDictionary();
    return [...dict].sort();
  },

  async getUserCorrections(): Promise<Record<string, string>> {
    try {
      const raw = await AsyncStorage.getItem(CORRECTIONS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  async saveUserCorrection(wrong: string, right: string): Promise<void> {
    try {
      const map = await AutoCorrect.getUserCorrections();
      map[wrong.toLowerCase()] = right;
      await AsyncStorage.setItem(CORRECTIONS_KEY, JSON.stringify(map));
    } catch {}
  },

  /**
   * Correct the last word in the text
   */
  async correctLastWord(text: string): Promise<CorrectionResult> {
    if (!text) return { original: '', corrected: '', wasChanged: false };

    const words = text.split(/(\s+)/);
    const lastWord = words[words.length - 1];
    if (!lastWord || lastWord.trim().length < 2) {
      return { original: lastWord, corrected: lastWord, wasChanged: false };
    }

    const trimmed = lastWord.trim();
    const isUrdu = /[\u0600-\u06FF]/.test(trimmed);

    // Check user-defined corrections first
    const userMap = await AutoCorrect.getUserCorrections();
    if (userMap[trimmed.toLowerCase()]) {
      const corrected = userMap[trimmed.toLowerCase()];
      return { original: trimmed, corrected, wasChanged: true };
    }

    // Check built-in corrections
    if (isUrdu && URDU_CORRECTIONS[trimmed]) {
      return { original: trimmed, corrected: URDU_CORRECTIONS[trimmed], wasChanged: true };
    }
    if (!isUrdu && ENGLISH_CORRECTIONS[trimmed.toLowerCase()]) {
      return { original: trimmed, corrected: ENGLISH_CORRECTIONS[trimmed.toLowerCase()], wasChanged: true };
    }

    return { original: trimmed, corrected: trimmed, wasChanged: false };
  },

  /**
   * Check if a word is misspelled (not in dictionary)
   */
  async isSpellingError(word: string, customDict: Set<string>): Promise<boolean> {
    if (!word || word.trim().length < 2) return false;
    const trimmed = word.trim();
    const isUrdu = /[\u0600-\u06FF]/.test(trimmed);

    // Custom dictionary always valid
    if (customDict.has(trimmed)) return false;

    // Check built-in corrections (if it HAS a correction → it's wrong)
    if (isUrdu) return trimmed in URDU_CORRECTIONS;
    return trimmed.toLowerCase() in ENGLISH_CORRECTIONS;
  },

  /**
   * Get suggestions for a misspelled word
   */
  getSuggestions(word: string, max = 3): string[] {
    const isUrdu = /[\u0600-\u06FF]/.test(word);

    if (isUrdu && URDU_CORRECTIONS[word]) return [URDU_CORRECTIONS[word]];
    if (!isUrdu && ENGLISH_CORRECTIONS[word.toLowerCase()]) {
      return [ENGLISH_CORRECTIONS[word.toLowerCase()]];
    }

    // Fuzzy match from dictionary
    const dict = isUrdu ? [...URDU_DICTIONARY] : [...ENGLISH_DICTIONARY];
    return dict
      .filter(w => w.startsWith(word.slice(0, 2)) && Math.abs(w.length - word.length) <= 2)
      .slice(0, max);
  },
};
