import { describe, it, expect } from 'vitest'
import bes2unicode from './bes2unicode'

const HEADER_SIZE = 1029

function makeBytes(...dataBytes: number[]): Uint8Array {
  const buf = new Uint8Array(HEADER_SIZE + dataBytes.length)
  dataBytes.forEach((b, i) => { buf[HEADER_SIZE + i] = b })
  return buf
}

describe('bes2unicode', () => {
  it('ヘッダーのみ（データなし）→ 空文字列', () => {
    const buf = new Uint8Array(HEADER_SIZE)
    expect(bes2unicode(buf)).toBe('')
  })

  it('ヘッダー未満のバイト列 → 空文字列', () => {
    const buf = new Uint8Array(10)
    expect(bes2unicode(buf)).toBe('')
  })

  it('0xa0 → 点字スペース ⠀', () => {
    expect(bes2unicode(makeBytes(0xa0))).toBe('⠀')
  })

  it('0xfe → @LB@', () => {
    expect(bes2unicode(makeBytes(0xfe))).toBe('@LB@')
  })

  it('0x0c → @LB@', () => {
    expect(bes2unicode(makeBytes(0x0c))).toBe('@LB@')
  })

  it('0xfd → @PB@', () => {
    expect(bes2unicode(makeBytes(0xfd))).toBe('@PB@')
  })

  it('0xf4 → @LB@@HR@@LB@', () => {
    expect(bes2unicode(makeBytes(0xf4))).toBe('@LB@@HR@@LB@')
  })

  it('0x0d → 空文字（スキップ）', () => {
    expect(bes2unicode(makeBytes(0x0d))).toBe('')
  })

  it('0xa1 → ⠁', () => {
    expect(bes2unicode(makeBytes(0xa1))).toBe('⠁')
  })

  it('0xb2 → ⠒', () => {
    expect(bes2unicode(makeBytes(0xb2))).toBe('⠒')
  })

  it('未定義バイト → 出力なし（スキップ）', () => {
    // 0x00 は list に定義されていない
    expect(bes2unicode(makeBytes(0x00))).toBe('')
  })

  it('複数バイトを連続して変換', () => {
    // ⠁⠃⠒ のシーケンス
    expect(bes2unicode(makeBytes(0xa1, 0xa3, 0xb2))).toBe('⠁⠃⠒')
  })

  it('点字とトークンが混在する場合', () => {
    expect(bes2unicode(makeBytes(0xa1, 0xfe, 0xa3))).toBe('⠁@LB@⠃')
  })
})
