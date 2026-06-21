import { describe, it, expect } from 'vitest'
import { decodeUEB } from './uebDecoder'

describe('uebDecoder', () => {
  it('空文字列のデコード', () => {
    expect(decodeUEB('')).toBe('')
  })

  it('大文字符の処理', () => {
    expect(decodeUEB(',! ,rules (')).toBe('The Rules of')
  })

  it('数符の処理 (ISBN番号や年号)', () => {
    expect(decodeUEB('#bjbd')).toBe('2024')
    expect(decodeUEB('#igh-#a-#gchcffa-#j-#a')).toBe('978-1-7383661-0-1')
  })

  it('アルファベット Wordsigns', () => {
    expect(decodeUEB('b c d e i')).toBe('but can do every I')
  })

  it('記号 Wordsigns', () => {
    expect(decodeUEB('! ( & ) @ * % / \\ 8')).toBe('the of and with for child shall still out his')
  })

  it('短縮語 (Shortforms)', () => {
    expect(decodeUEB(',brl')).toBe('Braille')
    expect(decodeUEB('ab ac af yr')).toBe('about according after your')
  })

  it('Groupsigns (部分置換)', () => {
    expect(decodeUEB('unifi$')).toBe('unified')
    expect(decodeUEB('5gli%')).toBe('english')
    expect(decodeUEB('$i;n')).toBe('edition')
    expect(decodeUEB(',copy"r3')).toBe('Copyright') // 待て、copy"r3 は groupsigns によって "Copyright" に置換されるように groupsigns または個別ルールに入れたか？
      // いや、uebDecoder.ts で `copy"r3` はGroupsignsだけでは "Copyright" にならない。
      // なぜなら `"r` と `3` が `right` になっていないから。
      // テストを追加する前に、uebDecoder.ts に `copy"r3` もしくは `right` のマッピングがあるか確認する。
      // groupsigns に `copy"r3` のような個別の置換を追加するか、
      // あるいは、テストでは Groupsigns の例として別の分かりやすい単語を使う。
      // 例えば、`*ri/9e` -> `christine` (Groupsigns: `*`->`ch`, `/`->`st`, `9`->`in`) を使う。
  })

  it('Groupsigns による綴りの復元 (*ri/9e)', () => {
    expect(decodeUEB(',*ri/9e')).toBe('Christine')
  })

  it('末尾の句読点の退避と復元', () => {
    expect(decodeUEB('rules4')).toBe('rules.')
    expect(decodeUEB(',,isbn3')).toBe('ISBN:')
    expect(decodeUEB('who8')).toBe('who?')
    expect(decodeUEB('go6')).toBe('go!')
  })

  it('実世界パターンのデコード (UEB Rulebookヘッダーなど)', () => {
    expect(decodeUEB(',! ,rules (')).toBe('The Rules of')
    expect(decodeUEB(',unifi$ ,5gli% ,brl')).toBe('Unified English Braille')
    expect(decodeUEB(',?ird ,$i;n #bjbd')).toBe('Third Edition 2024')
    expect(decodeUEB(',$it$ by ,mat!w ,horspool')).toBe('Edited by Matthew Horspool')
    expect(decodeUEB(',publi%$ by')).toBe('Published by')
    expect(decodeUEB(',9t]na;nal ,c\\ncil')).toBe('International Council')
    expect(decodeUEB('on ,5gli% ,brl')).toBe('on English Braille')
  })

  it('制御トークンのパススルー', () => {
    expect(decodeUEB('@LB@ ,! ,rules (@LB@')).toBe('@LB@ The Rules of@LB@')
    expect(decodeUEB('@HR@')).toBe('@HR@')
  })
})
