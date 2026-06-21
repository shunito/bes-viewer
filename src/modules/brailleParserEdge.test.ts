import { describe, it, expect } from 'vitest';
import { splitbraille } from './brailleParser';

// splitbraille は brf2unicode / bes2unicode が生成した内部表現文字列を受け取る。
// @PB@ = ページ区切り（元ファイルの \f に相当）
// @LB@ = 行区切り（元ファイルの \n に相当）
// これらはアプリ内部タグであり、元の点字ファイルには存在しない。

describe('splitbraille - 内部表現のパース', () => {
  it('単一ページ（@PB@ なし）は body が 1 要素', () => {
    const result = splitbraille('⠓⠑⠇⠇⠕@LB@⠺⠕⠗⠇⠙');
    expect(result.body.length).toBe(1);
  });

  it('@PB@ で 2 ページに分割される', () => {
    const result = splitbraille('⠓⠑⠇⠇⠕@LB@⠇⠊⠝⠑2@PB@⠎⠑⠉⠕⠝⠙@LB@⠏⠁⠛⠑');
    expect(result.body.length).toBe(2);
    // 1 ページ目の先頭行
    expect(result.body[0][0]).toContain('⠓⠑⠇⠇⠕');
    // 2 ページ目の先頭行
    expect(result.body[1][0]).toContain('⠎⠑⠉⠕⠝⠙');
  });

  it('@LB@ でページ内の行が分割される', () => {
    const result = splitbraille('⠁@LB@⠃@LB@⠉');
    expect(result.body[0].length).toBe(3);
  });

  it('1 ページ目の見出しは docTitle と @H1@ タグが付く', () => {
    const result = splitbraille('⠓⠑⠇⠇⠕⠀⠺⠕⠗⠇⠙@LB@⠇⠊⠝⠑2');
    expect(result.docTitle).toBeTruthy();
    expect(result.body[0][0]).toMatch(/@H1@/);
  });

  it('2 ページ目の見出しには @H2@ タグが付く', () => {
    const result = splitbraille('⠓⠑⠇⠇⠕@LB@⠇⠊⠝⠑2@PB@⠎⠑⠉⠕⠝⠙⠀⠏⠁⠛⠑@LB@⠉⠕⠝⠞⠑⠝⠞');
    expect(result.body[1][0]).toMatch(/@H2@/);
  });

  it('空文字列を渡してもクラッシュしない', () => {
    expect(() => splitbraille('')).not.toThrow();
  });

  it('見出しなしページは title に空白スペース（⠀⠀）が入る', () => {
    // 4 文字以下は isHeader = false
    const result = splitbraille('⠁⠃⠉');
    expect(result.docTitle).toBe(false);
    expect(result.title[0]).toBe('⠀⠀');
  });
});
