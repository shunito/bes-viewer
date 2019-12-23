// BESファイルのUnicode変換試作

const list:any = []
list['a0'] = '⠀'
list['fe'] = '@LB@'
list['0d'] = ''
list['0c'] = '@LB@'
list['fd'] = '@PB@'
list['f4'] = '@LB@@HR@@LB@'

list['a1'] = '⠁'
list['a3'] = '⠃'
list['a9'] = '⠉'
list['b9'] = '⠙'
list['b1'] = '⠑'
list['ab'] = '⠋'
list['bb'] = '⠛'
list['b3'] = '⠓'
list['aa'] = '⠊'
list['ba'] = '⠚'

list['a5'] = '⠅'
list['a7'] = '⠇'
list['ad'] = '⠍'
list['bd'] = '⠝'
list['b5'] = '⠕'
list['af'] = '⠏'
list['bf'] = '⠟'
list['b7'] = '⠗'
list['ae'] = '⠎'
list['be'] = '⠞'

list['c5'] = '⠥'
list['c7'] = '⠧'
list['cd'] = '⠭'
list['dd'] = '⠽'
list['d5'] = '⠵'
list['cf'] = '⠯'
list['df'] = '⠿'
list['d7'] = '⠷'
list['ce'] = '⠮'
list['de'] = '⠾'

list['c1'] = '⠡'
list['c3'] = '⠣'
list['c9'] = '⠩'
list['d9'] = '⠹'
list['d1'] = '⠱'
list['cb'] = '⠫'
list['db'] = '⠻'
list['d3'] = '⠳'
list['ca'] = '⠪'
list['da'] = '⠺'

list['a2'] = '⠂'
list['a6'] = '⠆'
list['b2'] = '⠒'
list['d2'] = '⠲'
list['c2'] = '⠢'
list['b6'] = '⠖'
list['d6'] = '⠶'
list['c6'] = '⠦'
list['b4'] = '⠔'
list['d4'] = '⠴'

list['ac'] = '⠌'
list['cc'] = '⠬'
list['bc'] = '⠜'
list['dc'] = '⠼'
list['a4'] = '⠄'
list['c4'] = '⠤'

list['a8'] = '⠈'
list['b8'] = '⠘'
list['d8'] = '⠸'
list['b0'] = '⠐'
list['c8'] = '⠨'
list['d0'] = '⠰'
list['c0'] = '⠠'

function bes2unicode (bytes:Uint8Array) {
  const headerByte = 1029

  let char:string
  let byte:number
  let chars = []

  for (var i = headerByte, n = bytes.length; i < n; i++) {
    byte = bytes[i]
    char = byte.toString(16)
    if (char.length < 2) {
      char = '0' + char
    }

    if (list[char] === undefined) {
      // console.log(char, list[char])
      // chars.push('@' + char + '@')
    } else {
      chars.push(list[char])
    }
  }
  return chars.join('')
}

export default bes2unicode
