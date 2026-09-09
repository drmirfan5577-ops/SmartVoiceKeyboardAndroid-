// Powered by OnSpace.AI
import AsyncStorage from '@react-native-async-storage/async-storage';

const FREQ_KEY = 'sw_word_freq';

// Common Urdu words for prediction
const URDU_COMMON = [
  'ہے','ہیں','کا','کی','کے','میں','اور','یہ','وہ','ہو',
  'کر','سے','پر','نے','کو','ہوں','تھا','تھی','گا','گی',
  'آپ','میں','ہم','تم','وہ','کیا','نہیں','ہاں','بھی','تو',
  'اب','جب','کب','کہاں','کیوں','کیسے','کون','کیا','جو','جب',
  'لیکن','اگر','کیونکہ','اس','اس','ان','اسے','انہیں','آج','کل',
  'ابھی','پھر','صرف','بہت','زیادہ','کم','اچھا','برا','بڑا','چھوٹا',
  'پاکستان','اللہ','محمد','اسلام','دل','وقت','زندگی','گھر','کام','باتیں',
  'السلام','علیکم','شکریہ','معاف','خوش','آمدید','مبارک','انشاءاللہ','ماشاءاللہ','الحمدللہ',
  'ضروری','اہم','خاص','عام','پہلے','بعد','ساتھ','بغیر','نیچے','اوپر',
];

// Common English words
const ENGLISH_COMMON = [
  'the','and','for','are','but','not','you','all','can','her',
  'was','one','our','out','day','get','has','him','his','how',
  'its','new','now','old','see','two','way','who','boy','did',
  'does','from','have','here','this','that','they','with','will','your',
  'been','good','more','very','when','come','here','just','like','long',
  'make','many','over','such','take','than','them','well','were',
  'hello','please','thank','sorry','great','today','time','work','home',
  'Pakistan','love','life','world','people','year','know','think','help',
];

// Urdu word pairs (common bigrams for better prediction)
const URDU_PAIRS: Record<string, string[]> = {
  'آپ': ['کا','کی','سے','نے','کو','کے'],
  'میں': ['نے','کا','ہوں','بھی','آپ'],
  'یہ': ['ہے','تھا','ہیں','کیا'],
  'وہ': ['ہے','گیا','آیا','کہا'],
  'کیا': ['ہے','آپ','میں','وہ'],
  'نہیں': ['ہے','ہوں','کرتا','کریں'],
  'اللہ': ['تعالیٰ','کریم','رحیم','حافظ'],
  'السلام': ['علیکم','و'],
};

// English word pairs
const ENGLISH_PAIRS: Record<string, string[]> = {
  'the': ['best', 'most', 'first', 'last', 'only'],
  'i': ['am', 'will', 'have', 'can', 'would'],
  'you': ['are', 'can', 'will', 'have', 'should'],
  'this': ['is', 'was', 'will', 'has', 'can'],
  'how': ['are', 'is', 'can', 'do', 'much'],
  'thank': ['you', 'god'],
  'please': ['help', 'let', 'note'],
};

async function getFrequencyMap(): Promise<Record<string, number>> {
  try {
    const raw = await AsyncStorage.getItem(FREQ_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const PredictionService = {
  async getPredictions(text: string, lang: string): Promise<string[]> {
    if (!text) return [];

    const isUrdu = lang === 'ur' || lang === 'urdu' || text.match(/[\u0600-\u06FF]/);
    const wordList = isUrdu ? URDU_COMMON : ENGLISH_COMMON;
    const pairMap = isUrdu ? URDU_PAIRS : ENGLISH_PAIRS;

    const trimmed = text.trim();
    const words = trimmed.split(/\s+/);
    const lastWord = words[words.length - 1] || '';
    const prevWord = words[words.length - 2] || '';

    const freqMap = await getFrequencyMap();

    // 1. Check bigram predictions from last complete word
    if (prevWord && pairMap[prevWord]) {
      const bigramSuggestions = pairMap[prevWord].slice(0, 3);
      if (bigramSuggestions.length >= 2) return bigramSuggestions;
    }

    // 2. Prefix match from last partial word
    if (lastWord.length >= 1) {
      const matches = wordList
        .filter(w => w.startsWith(lastWord) && w !== lastWord)
        .sort((a, b) => (freqMap[b] || 0) - (freqMap[a] || 0))
        .slice(0, 3);
      if (matches.length > 0) return matches;
    }

    // 3. Frequency-based suggestions
    const freqSorted = Object.entries(freqMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([w]) => w);
    if (freqSorted.length > 0) return freqSorted;

    // 4. Fallback common words
    return isUrdu
      ? ['ہے', 'اور', 'کیا']
      : ['the', 'and', 'for'];
  },

  async learnWord(word: string): Promise<void> {
    if (!word || word.trim().length < 2) return;
    try {
      const freq = await getFrequencyMap();
      const w = word.trim();
      freq[w] = (freq[w] || 0) + 1;
      const trimmed: Record<string, number> = Object.fromEntries(
        Object.entries(freq)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 500)
      );
      await AsyncStorage.setItem(FREQ_KEY, JSON.stringify(trimmed));
    } catch {}
  },
};
