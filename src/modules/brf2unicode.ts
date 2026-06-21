const brailleMap: Record<string, string> = {
  ' ': '⠀', '!': '⠮', '"': '⠐', '#': '⠼', '$': '⠫', '%': '⠩', '&': '⠯', "'": '⠄',
  '(': '⠷', ')': '⠾', '*': '⠡', '+': '⠬', ',': '⠠', '-': '⠤', '.': '⠨', '/': '⠌',
  '0': '⠼', '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙', '5': '⠑', '6': '⠋', '7': '⠛',
  '8': '⠓', '9': '⠊', ':': '⠒', ';': '⠲', '<': '⠜', '=': '⠶', '>': '⠕', '?': '⠦',
  '@': '⠿',
  'A': '⠁', 'B': '⠃', 'C': '⠉', 'D': '⠙', 'E': '⠑', 'F': '⠋', 'G': '⠛',
  'H': '⠓', 'I': '⠊', 'J': '⠚', 'K': '⠅', 'L': '⠇', 'M': '⠍', 'N': '⠝', 'O': '⠕',
  'P': '⠏', 'Q': '⠟', 'R': '⠗', 'S': '⠎', 'T': '⠞', 'U': '⠥', 'V': '⠧', 'W': '⠺',
  'X': '⠭', 'Y': '⠽', 'Z': '⠵',
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛',
  'h': '⠓', 'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
  'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺',
  'x': '⠭', 'y': '⠽', 'z': '⠵',
  '[': '⠪', '\\': '⠳', ']': '⠻', '^': '⠘', '_': '⠸'
}

export default function brf2unicode(text: string): string {
  const chars: string[] = []
  for (let i = 0; i < text.length; i++) {
    // Detect control code blocks like @HR@, @LB@, etc., and preserve them as-is
    if (text[i] === '@') {
      const endIdx = text.indexOf('@', i + 1)
      if (endIdx !== -1) {
        const control = text.slice(i, endIdx + 1)
        chars.push(control)
        i = endIdx
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
      chars.push('@PB@')
    } else {
      chars.push(brailleMap[char] || char)
    }
  }
  return chars.join('')
}

const unicodeToAsciiMap: Record<string, string> = {
  '⠀': ' ', '⠮': '!', '⠐': '"', '⠼': '#', '⠫': '$', '⠩': '%', '⠯': '&', '⠄': "'",
  '⠷': '(', '⠾': ')', '⠡': '*', '⠬': '+', '⠠': ',', '⠤': '-', '⠨': '.', '⠌': '/',
  '⠁': 'a', '⠃': 'b', '⠉': 'c', '⠙': 'd', '⠑': 'e', '⠋': 'f', '⠛': 'g', '⠓': 'h',
  '⠊': 'i', '⠚': 'j', '⠅': 'k', '⠇': 'l', '⠍': 'm', '⠝': 'n', '⠕': 'o', '⠏': 'p',
  '⠟': 'q', '⠗': 'r', '⠎': 's', '⠞': 't', '⠥': 'u', '⠧': 'v', '⠺': 'w', '⠭': 'x',
  '⠽': 'y', '⠵': 'z', '⠪': '[', '⠳': '\\', '⠻': ']', '⠘': '^', '⠸': '_'
}

export function unicode2brf(text: string): string {
  const chars: string[] = []
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    chars.push(unicodeToAsciiMap[char] || char)
  }
  return chars.join('')
}

