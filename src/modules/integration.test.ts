import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bes2unicode from './bes2unicode'
import brf2unicode from './brf2unicode'
import { splitbraille } from './brailleParser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEST_FILES_DIR = path.resolve(__dirname, '../../test_files')

// @PB@ / @LB@ / @HR@ はアプリ内部のタグ（コンバーターが制御文字から生成する）。
// 元の点字ファイル（.brf / .bse / .bes）にはこれらのタグは存在しない。
// 結合テストでは「変換後に点字 Unicode が得られ、splitbraille が正常動作する」ことを確認する。

describe('点字ファイルパース結合テスト', () => {
  it('test_all_bes_patterns.bes が正常にデコードおよびパースされること', () => {
    const filePath = path.join(TEST_FILES_DIR, 'test_all_bes_patterns.bes')
    const buffer = fs.readFileSync(filePath)
    const unicodeStr = bes2unicode(new Uint8Array(buffer))

    // 変換結果が空でなく、想定した点字を含んでいること
    expect(unicodeStr.length).toBeGreaterThan(0)
    expect(unicodeStr).toContain('⠁⠃⠉⠙⠑') // 1ページ目の見出し
    expect(unicodeStr).toContain('⠅⠇⠍⠝⠕') // 2ページ目の見出し

    // bes2unicode は \f → @PB@、改ページが含まれていることを確認
    expect(unicodeStr).toContain('@PB@')

    // パース処理の検証
    const parsed = splitbraille(unicodeStr)
    expect(parsed.docTitle).toBe('⠁⠃⠉⠙⠑')
    expect(parsed.title).toContain('⠁⠃⠉⠙⠑')
    expect(parsed.title).toContain('⠅⠇⠍⠝⠕')
    expect(parsed.body.length).toBe(10)
  })

  it('test_all_ascii_braille.brf が正常にデコードおよびパースされること', () => {
    const filePath = path.join(TEST_FILES_DIR, 'test_all_ascii_braille.brf')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const unicodeStr = brf2unicode(fileContent)

    // brf2unicode は \f → @PB@ に変換する
    expect(unicodeStr.length).toBeGreaterThan(0)
    expect(unicodeStr).toContain('@PB@')
    expect(unicodeStr).toContain('⠠⠮⠀⠠⠗⠥⠇⠑⠎⠀⠷')

    // パース処理の検証
    const parsed = splitbraille(unicodeStr)
    expect(parsed.docTitle).toContain('⠠⠮⠀⠠⠗⠥⠇⠑⠎⠀⠷')
    expect(parsed.body.length).toBe(10)
  })

  it('test_all_bse_patterns.bse が正常にデコードおよびパースされること', () => {
    const filePath = path.join(TEST_FILES_DIR, 'test_all_bse_patterns.bse')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const unicodeStr = brf2unicode(fileContent)

    // brf2unicode は \f → @PB@ に変換する
    expect(unicodeStr.length).toBeGreaterThan(0)
    expect(unicodeStr).toContain('@PB@')

    // パース処理の検証
    const parsed = splitbraille(unicodeStr)
    expect(parsed.docTitle).toBe('⠁⠃⠉⠙⠑') // 1ページ目の見出し
    expect(parsed.body.length).toBe(10)
  })
})
