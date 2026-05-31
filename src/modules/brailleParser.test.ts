import { describe, it, expect } from 'vitest'
import { isHeader, splitbraille } from './brailleParser'

describe('isHeader', () => {
  it('4文字以下 → false', () => {
    expect(isHeader('⠁⠃⠉⠙')).toBe(false)
  })

  it('空文字列 → false', () => {
    expect(isHeader('')).toBe(false)
  })

  it('5文字以上・⠒ が0個 → true', () => {
    expect(isHeader('⠁⠃⠉⠙⠑')).toBe(true)
  })

  it('5文字以上・⠒ が5個（split で6要素）→ false', () => {
    // split('⠒').length > 5 なら false → 5個以上が対象
    // 5個の ⠒ → split で 6要素 → false
    expect(isHeader('⠁⠒⠁⠒⠁⠒⠁⠒⠁⠒⠁')).toBe(false)
  })

  it('5文字以上・⠒ が4個（split で5要素）→ true', () => {
    // 4個の ⠒ → split で 5要素 → true
    expect(isHeader('⠁⠒⠁⠒⠁⠒⠁⠒⠁⠁')).toBe(true)
  })
})

describe('splitbraille', () => {
  it('空文字列 → クラッシュしない', () => {
    const result = splitbraille('')
    expect(result).toBeDefined()
    expect(result.docTitle).toBe(false)
    expect(result.body).toHaveLength(1)
  })

  it('見出しのない単一ページ → docTitle: false、title に空白スペース', () => {
    // 5文字未満の行のみなので見出しなし
    const result = splitbraille('⠁⠃⠉@LB@⠙⠑')
    expect(result.docTitle).toBe(false)
    expect(result.title).toHaveLength(1)
    expect(result.title[0]).toBe('⠀⠀')
  })

  it('単一ページ・見出しあり → docTitle がセットされ @H1@ プレフィックスが付く', () => {
    // 5文字以上の行を含む1ページ
    const heading = '⠁⠃⠉⠙⠑'
    const result = splitbraille(heading)
    expect(result.docTitle).toBe(heading)
    expect(result.title[0]).toBe(heading)
    // body の最初の行は @H1@ プレフィックス付き
    expect(result.body[0][0]).toBe('@H1@' + heading)
  })

  it('複数ページ → body の長さがページ数と一致', () => {
    const str = '⠁⠃⠉⠙⠑@PB@⠋⠛⠓⠊⠚@PB@⠅⠇⠍⠝⠕'
    const result = splitbraille(str)
    expect(result.body).toHaveLength(3)
  })

  it('2ページ目の見出しは @H2@ プレフィックス', () => {
    const heading1 = '⠁⠃⠉⠙⠑'
    const heading2 = '⠋⠛⠓⠊⠚'
    const result = splitbraille(`${heading1}@PB@${heading2}`)
    expect(result.body[0][0]).toBe('@H1@' + heading1)
    expect(result.body[1][0]).toBe('@H2@' + heading2)
    expect(result.docTitle).toBe(heading1)
  })

  it('title 配列の長さがページ数と一致', () => {
    const str = '⠁⠃⠉⠙⠑@PB@⠋⠛⠓⠊⠚'
    const result = splitbraille(str)
    expect(result.title).toHaveLength(2)
  })

  it('@LB@ でページ内が複数行に分割される', () => {
    const result = splitbraille('⠁@LB@⠃@LB@⠉')
    expect(result.body[0]).toHaveLength(3)
  })

  it('先頭・末尾の点字スペース（⠀）はトリムされて見出し判定される', () => {
    // ⠀ でパディングされた5文字以上の行は見出しと判定される
    const heading = '⠀⠀⠁⠃⠉⠙⠑⠀'
    const result = splitbraille(heading)
    // trimLine は '⠁⠃⠉⠙⠑' → isHeader: true
    expect(result.docTitle).toBe('⠁⠃⠉⠙⠑')
  })
})
