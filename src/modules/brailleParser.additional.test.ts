import { describe, it, expect } from 'vitest'
import { isHeader, splitbraille } from './brailleParser'

describe('isHeader - additional', () => {
  it('5つの ⠒ を含む文字列（split で6要素）→ false', () => {
    // '⠁⠒⠁⠒⠁⠒⠁⠒⠁⠒⠁' は11文字・⠒が5個 → split で6要素 → false
    expect(isHeader('⠁⠒⠁⠒⠁⠒⠁⠒⠁⠒⠁')).toBe(false)
  })
})

describe('splitbraille - additional', () => {
  it('見出し行の後続行には @H1@/@H2@ プレフィックスが付かない', () => {
    const heading = '⠁⠃⠉⠙⠑'
    const body1 = '⠋⠛'
    const body2 = '⠓⠊'
    const result = splitbraille(`${heading}@LB@${body1}@LB@${body2}`)
    expect(result.body[0][0]).toBe('@H1@' + heading)
    expect(result.body[0][1]).toBe(body1)
    expect(result.body[0][2]).toBe(body2)
  })

  it('3ページすべてに見出しがある場合 → docTitle は最初のページの見出しのみ', () => {
    const h1 = '⠁⠃⠉⠙⠑'
    const h2 = '⠋⠛⠓⠊⠚'
    const h3 = '⠅⠇⠍⠝⠕'
    const result = splitbraille(`${h1}@PB@${h2}@PB@${h3}`)
    expect(result.docTitle).toBe(h1)
    expect(result.title[0]).toBe(h1)
    expect(result.title[1]).toBe(h2)
    expect(result.title[2]).toBe(h3)
  })

  it('@LB@ のみのページ（空行のみ）→ title に ⠀⠀ が追加される', () => {
    const h1 = '⠁⠃⠉⠙⠑'
    const result = splitbraille(`${h1}@PB@@LB@@LB@`)
    expect(result.title[1]).toBe('⠀⠀')
  })
})
