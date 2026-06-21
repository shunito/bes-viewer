import { describe, it, expect } from 'vitest'
import brf2unicode, { unicode2brf } from './brf2unicode'

describe('brf2unicode', () => {
  it('空文字列の変換 → 空文字列', () => {
    expect(brf2unicode('')).toBe('')
  })

  it('アルファベット大文字の変換 (A, B, C) → (⠁, ⠃, ⠉)', () => {
    expect(brf2unicode('ABC')).toBe('⠁⠃⠉')
  })

  it('アルファベット小文字の変換 (a, b, c) → (⠁, ⠃, ⠉)', () => {
    expect(brf2unicode('abc')).toBe('⠁⠃⠉')
  })

  it('数字の変換 (1, 2, 3) → (⠁, ⠃, ⠉)', () => {
    expect(brf2unicode('123')).toBe('⠁⠃⠉')
  })

  it('改行コードの変換 (LF, CRLF) → @LB@', () => {
    expect(brf2unicode('A\nB')).toBe('⠁@LB@⠃')
    expect(brf2unicode('A\r\nB')).toBe('⠁@LB@⠃')
  })

  it('フォームフィード (改ページ) の変換 (\f, \x0c) → @PB@', () => {
    expect(brf2unicode('A\fB')).toBe('⠁@PB@⠃')
    expect(brf2unicode('A\x0cB')).toBe('⠁@PB@⠃')
  })

  it('スペースの変換 → ⠀ (U+2800)', () => {
    expect(brf2unicode(' ')).toBe('⠀')
  })

  it('マップにない文字 → そのまま出力', () => {
    expect(brf2unicode('あ')).toBe('あ')
  })

  it('複合的な文書の変換 (Hello World)', () => {
    expect(brf2unicode('hello, world!')).toBe('⠓⠑⠇⠇⠕⠠⠀⠺⠕⠗⠇⠙⠮')
  })

  it('unicode2brf: Unicode点字からASCIIアルファベット小文字への逆変換', () => {
    expect(unicode2brf('⠁⠃⠉')).toBe('abc')
    expect(unicode2brf('⠓⠑⠇⠇⠕⠠⠀⠺⠕⠗⠇⠙⠮')).toBe('hello, world!')
    expect(unicode2brf('⠁@LB@⠃')).toBe('a@LB@b')
  })
})
