import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// BRF用のダミーコンテンツ生成 (1ページあたり300行)
const generateBrfDummy = (pageNo) => {
  const lines = [];
  const baseLines = [
    `  ,this is dummy line #IDX for volume scale testing in page #P.`,
    "  b c d e f g h j k l m n p q r s t u v w x y z",
    "  ! ( & ) @ * % / \\ 8",
    "  ab ac af yr gd grt shd wd cd",
    "  child shall still out under",
    "  education transcription declaration"
  ];
  for (let i = 0; i < 300; i++) {
    lines.push(baseLines[i % baseLines.length].replace('#IDX', i).replace('#P', pageNo));
  }
  return lines.join('\n');
};

// 1. test_all_ascii_braille.brf の生成 (10ページ x 300行以上 = 3000行以上)
const brfPages = [
  `         ,! ,rules (\n     ,unifi$ ,5gli% ,brl\n      ,?ird ,$i;n #bjbd\n\n  ,$it$ by ,mat!w ,horspool\n\n         ,publi%$ by\n      ,9t]na;nal ,c\\ncil\n        on ,5gli% ,brl\n\n,,isbn3 #igh-#a-#gchcffa-#j-#a\n` + generateBrfDummy(1),
  `         ,volume #b\n\n,this is ,page #b.\n,we are testing ,ueb ,grade #b contractions.\n` + generateBrfDummy(2),
  `         ,volume #c\n\n,this is ,page #c.\n,b c d e f g h j k l m n p q r s t u v w x y z\n` + generateBrfDummy(3),
  `         ,volume #d\n\n,this is ,page #d.\n,! ( & ) @ * % / \\ 8\n` + generateBrfDummy(4),
  `         ,volume #e\n\n,this is ,page #e.\n,ab ac af yr gd grt shd wd cd\n` + generateBrfDummy(5),
  `         ,volume #f\n\n,this is ,page #f.\n,child shall still out under\n` + generateBrfDummy(6),
  `         ,volume #g\n\n,this is ,page #g.\n,education transcription declaration\n` + generateBrfDummy(7),
  `         ,volume #h\n\n,this is ,page #h.\n,,isbn3 #igh-#a-#gchcffa-#j-#a\n` + generateBrfDummy(8),
  `         ,volume #i\n\n,this is ,page #i.\n,edited by ,mat!w ,horspool\n` + generateBrfDummy(9),
  `         ,volume #aj\n\n,this is ,page #aj.\n,end of ,! ,test document.\n` + generateBrfDummy(10)
];
const brfContent = brfPages.join('\f') + '\n';
fs.writeFileSync(path.join(projectRoot, 'test_files/test_all_ascii_braille.brf'), brfContent);
console.log('Generated test_all_ascii_braille.brf (3000+ lines)');


// BES/BSE用のダミーコンテンツ生成 (1ページあたり300行)
const generateBesDummy = () => {
  const lines = [];
  const baseLines = [
    '⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚', // あ〜こ
    '⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞', // か〜そ
    '⠥⠧⠭⠽⠵⠯⠿⠷⠮⠾', // た〜と
    '⠡⠣⠩⠹⠱⠫⠻⠳⠪⠺', // な〜の
    '⠂⠆⠒⠲⠢⠖⠶⠦⠔⠴', // は〜ほ
    '⠌⠬⠜⠼⠄⠤⠈⠘⠸⠐⠨⠰⠠' // ま〜よ
  ];
  for (let i = 0; i < 300; i++) {
    lines.push(baseLines[i % baseLines.length]);
  }
  return lines.join('@LB@');
};

// 2. test_all_bes_patterns.bes と test_all_bse_patterns.bse の生成 (10ページ x 300行以上 = 3000行以上)
const list = {
  'a0': '⠀', 'fe': '@LB@', '0c': '@LB@', 'fd': '@PB@', 'f4': '@LB@@HR@@LB@',
  'a1': '⠁', 'a3': '⠃', 'a9': '⠉', 'b9': '⠙', 'b1': '⠑', 'ab': '⠋', 'bb': '⠛', 'b3': '⠓', 'aa': '⠊', 'ba': '⠚',
  'a5': '⠅', 'a7': '⠇', 'ad': '⠍', 'bd': '⠝', 'b5': '⠕', 'af': '⠏', 'bf': '⠟', 'b7': '⠗', 'ae': '⠎', 'be': '⠞',
  'c5': '⠥', 'c7': '⠧', 'cd': '⠭', 'dd': '⠽', 'd5': '⠵', 'cf': '⠯', 'df': '⠿', 'd7': '⠷', 'ce': '⠮', 'de': '⠾',
  'c1': '⠡', 'c3': '⠣', 'c9': '⠩', 'd9': '⠹', 'd1': '⠱', 'cb': '⠫', 'db': '⠻', 'd3': '⠳', 'ca': '⠪', 'da': '⠺',
  'a2': '⠂', 'a6': '⠆', 'b2': '⠒', 'd2': '⠲', 'c2': '⠢', 'b6': '⠖', 'd6': '⠶', 'c6': '⠦', 'b4': '⠔', 'd4': '⠴',
  'ac': '⠌', 'cc': '⠬', 'bc': '⠜', 'dc': '⠼', 'a4': '⠄', 'c4': '⠤',
  'a8': '⠈', 'b8': '⠘', 'd8': '⠸', 'b0': '⠐', 'c8': '⠨', 'd0': '⠰', 'c0': '⠠'
};

const unicodeToBesByte = {};
for (const [byteStr, uniStr] of Object.entries(list)) {
  if (uniStr) {
    unicodeToBesByte[uniStr] = parseInt(byteStr, 16);
  }
}
unicodeToBesByte['@LB@'] = 0xfe;
unicodeToBesByte['@PB@'] = 0xfd;

const besUnicodePages = [
  '⠁⠃⠉⠙⠑@LB@' + generateBesDummy(), // あいうえお (見出し) + ダミー
  '⠅⠇⠍⠝⠕@LB@' + generateBesDummy(), // かきくけこ
  '⠎⠏⠗⠞⠕@LB@' + generateBesDummy(), // さしすせそ
  '⠕⠗⠞⠋⠕@LB@' + generateBesDummy(), // たちつてと
  '⠝⠇⠍⠝⠕@LB@' + generateBesDummy(), // なにぬねの
  '⠓⠊⠎⠋⠕@LB@' + generateBesDummy(), // はひふへほ
  '⠍⠇⠍⠝⠕@LB@' + generateBesDummy(), // まみむめも
  '⠽⠇⠍⠝⠕@LB@' + generateBesDummy(), // やいゆえよ
  '⠗⠇⠍⠝⠕@LB@' + generateBesDummy(), // らりるれろ
  '⠺⠇⠍⠝⠕@LB@' + generateBesDummy()  // わいうえを
];
const besUnicodeContent = besUnicodePages.join('@PB@');

// 2.1 test_all_bes_patterns.bes のバイナリデータ作成
const header = new Uint8Array(1029);
const bodyBytes = [];
let idx = 0;
while (idx < besUnicodeContent.length) {
  if (besUnicodeContent.startsWith('@LB@', idx)) {
    bodyBytes.push(unicodeToBesByte['@LB@']);
    idx += 4;
  } else if (besUnicodeContent.startsWith('@PB@', idx)) {
    bodyBytes.push(unicodeToBesByte['@PB@']);
    idx += 4;
  } else {
    const char = besUnicodeContent[idx];
    const byteVal = unicodeToBesByte[char];
    if (byteVal !== undefined) {
      bodyBytes.push(byteVal);
    }
    idx++;
  }
}
const besFileBytes = new Uint8Array(header.length + bodyBytes.length);
besFileBytes.set(header, 0);
besFileBytes.set(new Uint8Array(bodyBytes), header.length);
fs.writeFileSync(path.join(projectRoot, 'test_files/test_all_bes_patterns.bes'), besFileBytes);
console.log('Generated test_all_bes_patterns.bes (3000+ lines)');

// 2.2 test_all_bse_patterns.bse のテキストデータ作成
const unicodeToAsciiMap = {
  '⠀': ' ', '⠮': '!', '⠐': '"', '⠼': '#', '⠫': '$', '⠩': '%', '⠯': '&', '⠄': "'",
  '⠷': '(', '⠾': ')', '⠡': '*', '⠬': '+', '⠠': ',', '⠤': '-', '⠨': '.', '⠌': '/',
  '⠴': '0', '⠂': '1', '⠆': '2', '⠒': '3', '⠲': '4', '⠢': '5', '⠖': '6', '⠶': '7',
  '⠦': '8', '⠔': '9', '⠱': ':', '⠰': ';', '⠣': '<', '⠿': '=', '⠜': '>', '⠹': '?',
  '⠈': '@',
  '⠁': 'a', '⠃': 'b', '⠉': 'c', '⠙': 'd', '⠑': 'e', '⠋': 'f', '⠛': 'g', '⠓': 'h',
  '⠊': 'i', '⠚': 'j', '⠅': 'k', '⠇': 'l', '⠍': 'm', '⠝': 'n', '⠕': 'o', '⠏': 'p',
  '⠟': 'q', '⠗': 'r', '⠎': 's', '⠞': 't', '⠥': 'u', '⠧': 'v', '⠺': 'w', '⠭': 'x',
  '⠽': 'y', '⠵': 'z',
  '⠪': '[', '⠳': '\\', '⠻': ']', '⠘': '^', '⠸': '_'
};

let bseContent = '';
let j = 0;
while (j < besUnicodeContent.length) {
  if (besUnicodeContent.startsWith('@LB@', j)) {
    bseContent += '\n';
    j += 4;
  } else if (besUnicodeContent.startsWith('@PB@', j)) {
    bseContent += '\f';
    j += 4;
  } else {
    const char = besUnicodeContent[j];
    bseContent += unicodeToAsciiMap[char] || char;
    j++;
  }
}
fs.writeFileSync(path.join(projectRoot, 'test_files/test_all_bse_patterns.bse'), bseContent + '\n');
console.log('Generated test_all_bse_patterns.bse (3000+ lines)');
