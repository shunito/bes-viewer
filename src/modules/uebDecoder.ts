/**
 * UEB Grade 2 (Unified English Braille) 簡易デコーダー
 * ASCII点字表現（NABCC）を英語の平文（縮約を展開したもの）に変換します。
 */

// Alphabetic Wordsigns (独立した1文字)
const alphabeticWordsigns: Record<string, string> = {
  b: 'but',
  c: 'can',
  d: 'do',
  e: 'every',
  f: 'from',
  g: 'go',
  h: 'have',
  j: 'just',
  k: 'knowledge',
  l: 'like',
  m: 'more',
  n: 'not',
  p: 'people',
  q: 'quite',
  r: 'rather',
  s: 'so',
  t: 'that',
  u: 'us',
  v: 'very',
  w: 'will',
  x: 'it',
  y: 'you',
  z: 'as',
  i: 'I'
}

// Strong Wordsigns / Conjunctions (独立した1文字)
const strongWordsigns: Record<string, string> = {
  '!': 'the',
  '(': 'of',
  '&': 'and',
  ')': 'with',
  '@': 'for',
  '*': 'child',
  '%': 'shall',
  '/': 'still',
  '\\': 'out',
  '8': 'his'
}

// Common UEB Shortforms (短縮語)
const shortforms: Record<string, string> = {
  ab: 'about',
  abv: 'above',
  ac: 'according',
  acr: 'across',
  af: 'after',
  afn: 'afternoon',
  afw: 'afterward',
  al: 'also',
  alm: 'almost',
  alr: 'already',
  alt: 'altogether',
  alw: 'always',
  brl: 'braille',
  'copy"r3': 'copyright',
  cd: 'could',
  dcl: 'declare',
  ei: 'either',
  fr: 'friend',
  gd: 'good',
  grt: 'great',
  ll: 'little',
  lr: 'letter',
  mch: 'much',
  nei: 'neither',
  pd: 'paid',
  rcv: 'receive',
  sd: 'said',
  shd: 'should',
  wd: 'would',
  yr: 'your'
}

// Groupsigns (部分置換ルール) - 適用順序が重要
const groupsigns: Array<[string, string]> = [
  [';n', 'tion'],
  ['!n', 'then'],
  ['!', 'the'],
  ['&', 'and'],
  [')', 'with'],
  ['@', 'for'],
  ['(', 'of'],
  ['*', 'ch'],
  ['%', 'sh'],
  ['/', 'st'],
  ['[', 'ow'],
  ['\\', 'ou'],
  [']', 'er'],
  ['$', 'ed'],
  ['+', 'ing'],
  ['<', 'ar'],
  ['5', 'en'],
  ['9', 'in'],
  ['8', 'ea'],
  ['?', 'th'],
  ['=', 'gg'],
  ['^c', '(c)'] // コピーライトマークなどの特殊記号
]

// 末尾の句読点トリム用マッピング (数符がない場合のみ適用)
const trailingPunctuation: Record<string, string> = {
  '1': ',',
  '2': ';',
  '3': ':',
  '4': '.',
  '6': '!',
  '8': '?',
  '-': '-'
}

/**
 * 1単語トークンをデコードします
 */
function decodeWord(token: string): string {
  if (token.length === 0) return ''

  // 大文字化フラグの抽出
  let cleanToken = token
  let capitalizeFirst = false
  let capitalizeAll = false

  // 先頭の大文字符 "," のカウント
  let capCount = 0
  while (capCount < cleanToken.length && cleanToken[capCount] === ',') {
    capCount++
  }
  if (capCount > 0) {
    cleanToken = cleanToken.slice(capCount)
    if (capCount >= 2) {
      capitalizeAll = true
    } else {
      capitalizeFirst = true
    }
  }

  // 数符 "#" の判定
  let isNumber = false
  if (cleanToken.startsWith('#')) {
    isNumber = true
    cleanToken = cleanToken.slice(1)
  }

  if (isNumber) {
    // 数字モード: a-j を 1-0 に変換
    const numMap: Record<string, string> = {
      a: '1', b: '2', c: '3', d: '4', e: '5', f: '6', g: '7', h: '8', i: '9', j: '0',
      A: '1', B: '2', C: '3', D: '4', E: '5', F: '6', G: '7', H: '8', I: '9', J: '0'
    }
    let numStr = ''
    for (let i = 0; i < cleanToken.length; i++) {
      const ch = cleanToken[i]
      numStr += numMap[ch] || ch
    }
    return numStr
  }

  // 1. まず句読点をトリムする前に Wordsigns / shortforms の完全一致チェックを行う
  const checkWordsign = (str: string): string | null => {
    const lower = str.toLowerCase()
    if (lower in alphabeticWordsigns) {
      return alphabeticWordsigns[lower]
    }
    if (str in strongWordsigns) {
      return strongWordsigns[str]
    }
    if (lower in shortforms) {
      return shortforms[lower]
    }
    return null
  }

  let decoded: string
  const checked = checkWordsign(cleanToken)
  let suffix = ''

  if (checked !== null) {
    decoded = checked
  } else {
    // 2. 一致しなかった場合、末尾の句読点を退避
    while (cleanToken.length > 0) {
      const lastChar = cleanToken[cleanToken.length - 1]
      if (lastChar in trailingPunctuation) {
        suffix = trailingPunctuation[lastChar] + suffix
        cleanToken = cleanToken.slice(0, -1)
      } else {
        break
      }
    }

    if (cleanToken.length === 0) {
      return suffix
    }

    // トリム後の本体で再度 Wordsigns / shortforms をチェック
    const checkTrimmed = checkWordsign(cleanToken)
    if (checkTrimmed !== null) {
      decoded = checkTrimmed
    } else {
      // 3. それでも一致しなければ、Groupsigns (部分置換) を適用
      let tempDecoded = cleanToken
      for (const [pattern, replacement] of groupsigns) {
        // 複数出現をすべて置換
        while (tempDecoded.includes(pattern)) {
          tempDecoded = tempDecoded.replace(pattern, replacement)
        }
      }
      decoded = tempDecoded
    }
  }

  // 大文字化の適用
  if (capitalizeAll) {
    decoded = decoded.toUpperCase()
  } else if (capitalizeFirst && decoded.length > 0) {
    decoded = decoded[0].toUpperCase() + decoded.slice(1)
  }

  return decoded + suffix
}

/**
 * 英語点字の行をデコードして展開された平文を返します
 */
export function decodeUEB(asciiText: string): string {
  if (!asciiText) return ''

  // トークン分割 (スペース、@トークン、通常の単語)
  const tokens: string[] = []
  let i = 0
  while (i < asciiText.length) {
    if (asciiText[i] === ' ') {
      let start = i
      while (i < asciiText.length && asciiText[i] === ' ') {
        i++
      }
      tokens.push(asciiText.slice(start, i))
    } else if (asciiText[i] === '@') {
      const endIdx = asciiText.indexOf('@', i + 1)
      if (endIdx !== -1) {
        tokens.push(asciiText.slice(i, endIdx + 1))
        i = endIdx + 1
      } else {
        tokens.push(asciiText[i])
        i++
      }
    } else {
      let start = i
      while (i < asciiText.length && asciiText[i] !== ' ' && asciiText[i] !== '@') {
        i++
      }
      tokens.push(asciiText.slice(start, i))
    }
  }

  // 各トークンの処理
  const decodedTokens = tokens.map(token => {
    // スペースや制御トークンはそのまま返す
    if (token.startsWith(' ') || (token.length > 2 && token.startsWith('@') && token.endsWith('@'))) {
      return token
    }
    
    // ハイフンで繋がっている場合は個別にデコード
    if (token.includes('-') && token !== '-') {
      return token.split('-').map(part => decodeWord(part)).join('-')
    }

    return decodeWord(token)
  })

  return decodedTokens.join('')
}
