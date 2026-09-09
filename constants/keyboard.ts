// Powered by OnSpace.AI
// Add emoji mode to KeyboardMode constant
export const URDU_ROWS = [
  ['ق','و','ع','ر','ت','ٹ','ے','ی','ہ','پ'],
  ['ا','س','د','ڈ','ف','گ','ھ','ج','ک','ل'],
  ['ز','ش','چ','ط','ب','ن','م','ں','ث','خ'],
  ['ح','ص','ض','ظ','غ','ذ','ڑ','ژ','آ','ء'],
  ['َ','ِ','ُ','ّ','ً','ٍ','ٌ','ٰ','ٔ','ئ'],
];

export const ENGLISH_ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m'],
];

export const SINDHI_ROWS = [
  ['ڄ','ٿ','ٽ','ث','ڃ','چ','ح','ڇ','خ'],
  ['ق','و','ع','ر','ت','ي','ے','غ','ف'],
  ['ا','س','د','ڊ','ڌ','ڍ','ڏ','ذ'],
  ['پ','ڦ','گ','ڳ','ڪ','ل','ڙ'],
  ['ڻ','ڱ','ں','ڀ','ٺ','ٻ','ھ'],
];

export const SYMBOLS_ROWS = [
  ['+','-','×','÷','=','%','±','√','π','∞'],
  ['@','#','$','^','&','*','/','\\','|','~'],
  ['(',')','{','}','[',']','<','>','`','_'],
  ['!','?',',','.', ':',';',"'",'"','؟','،'],
  ['€','£','¥','₨','₹','¢','©','®','™','°'],
];

export const FN_ROW1 = ['Esc','F1','F2','F3','F4','F5','F6','F7','F8','F9'];
export const FN_ROW2 = ['F10','F11','F12','Tab','Caps','DelW','Sel','Copy','Paste','Cut'];
export const FN_ROW3 = ['Ctrl','Alt','Home','End','Pg↑','Pg↓','Undo','Redo','Clr'];
export const FN_ROW4 = ['↑','↓','←','→','Enter','⌫'];

export const NUMBER_ROW = ['1','2','3','4','5','6','7','8','9','0'];

export type KeyboardMode = 'urdu' | 'english' | 'sindhi' | 'symbols' | 'fn' | 'emoji';

export const MODE_LABELS: Record<KeyboardMode, { label: string; desc: string; lang: string; icon: string }> = {
  urdu:    { label: 'اردو',    desc: '📝 اردو موڈ',     lang: 'ur-PK', icon: '🇵🇰' },
  english: { label: 'English', desc: '🔤 English Mode',  lang: 'en-US', icon: '🔤'  },
  sindhi:  { label: 'سنڌي',   desc: '📜 سنڌي موڊ',     lang: 'sd-PK', icon: '🌸'  },
  symbols: { label: '؟#',      desc: '🔣 علامات موڈ',   lang: 'ur-PK', icon: '🔣'  },
  fn:      { label: 'Fn',      desc: '⚙️ فنکشنل کیز',   lang: 'en-US', icon: '⚙️'  },
  emoji:   { label: '😀',      desc: '😊 ایموجی',        lang: 'ur-PK', icon: '😀'  },
};
