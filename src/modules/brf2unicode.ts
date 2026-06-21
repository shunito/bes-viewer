const brailleMap: Record<string, string> = {
  ' ': '⠀', // U+2800
  '!': '⠮', // U+282E
  '"': '⠐', // U+2810
  '#': '⠼', // U+283C
  '$': '⠫', // U+282B
  '%': '⠩', // U+2829
  '&': '⠯', // U+282F
  "'": '⠄', // U+2804
  '(': '⠷', // U+2837
  ')': '⠾', // U+283E
  '*': '⠡', // U+2821
  '+': '⠬', // U+282C
  ',': '⠠', // U+2820
  '-': '⠤', // U+2824
  '.': '⠨', // U+2828
  '/': '⠌', // U+280C
  '0': '⠴', // U+2834
  '1': '⠂', // U+2802
  '2': '⠆', // U+2806
  '3': '⠒', // U+2812
  '4': '⠲', // U+2832
  '5': '⠢', // U+2822
  '6': '⠖', // U+2816
  '7': '⠶', // U+2836
  '8': '⠦', // U+2826
  '9': '⠔', // U+2814
  ':': '⠱', // U+2831
  ';': '⠰', // U+2830
  '<': '⠣', // U+2823
  '=': '⠿', // U+283F
  '>': '⠜', // U+281C
  '?': '⠹', // U+2839
  '@': '⠈', // U+2808
  'A': '⠁', 'B': '⠃', 'C': '⠉', 'D': '⠙', 'E': '⠑', 'F': '⠋', 'G': '⠛', 'H': '⠓',
  'I': '⠊', 'J': '⠚', 'K': '⠅', 'L': '⠇', 'M': '⠍', 'N': '⠝', 'O': '⠕', 'P': '⠏',
  'Q': '⠟', 'R': '⠗', 'S': '⠎', 'T': '⠞', 'U': '⠥', 'V': '⠧', 'W': '⠺', 'X': '⠭',
  'Y': '⠽', 'Z': '⠵',
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓',
  'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏',
  'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
  'y': '⠽', 'z': '⠵',
  '[': '⠪', '\\': '⠳', ']': '⠻', '^': '⠘', '_': '⠸'
}

export default function brf2unicode(text: string): string {
  const chars: string[] = []
  for (let i = 0; i < text.length; i++) {
    // Detect control code blocks like @HR@, @LB@, etc., and preserve them as-is
    if (text[i] === '@') {
      const nextFour = text.slice(i, i + 4)
      if (nextFour === '@LB@' || nextFour === '@PB@' || nextFour === '@HR@' || nextFour === '@H1@' || nextFour === '@H2@') {
        chars.push(nextFour)
        i += 3
        continue
      }
    }
    const char = text[i]
    if (char === '\r') {
      continue
    }
    if (char === '\n') {
      chars.push('@LB@')
    } else if (char === '\f' || char === '\x0c') {
      // BRF の慣例: \f の後の同行はページ番号行（スペースのみ）のため読み飛ばす。
      // 非スペース文字が続く場合（テスト用合成入力など）は通常通り変換する。
      chars.push('@PB@')
      let j = i + 1
      let onlySpaces = true
      while (j < text.length && text[j] !== '\n') {
        if (text[j] !== ' ' && text[j] !== '\r') {
          onlySpaces = false
          break
        }
        j++
      }
      if (onlySpaces) {
        i = j // 行末 \n の手前まで進める（次のループで \n を処理）
      }

    } else {
      chars.push(brailleMap[char] || char)
    }
  }
  return chars.join('')
}

const unicodeToAsciiMap: Record<string, string> = {
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
}

export function unicode2brf(text: string): string {
  const chars: string[] = []
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    chars.push(unicodeToAsciiMap[char] || char)
  }
  return chars.join('')
}
