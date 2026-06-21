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

describe('点字ファイルパース結合テスト', () => {
  it('test_all_bes_patterns.bes が正常にデコードおよびパースされること', () => {
    const filePath = path.join(TEST_FILES_DIR, 'test_all_bes_patterns.bes')
    const buffer = fs.readFileSync(filePath)
    const unicodeStr = bes2unicode(new Uint8Array(buffer))

    // 変換結果が空でなく、想定した点字を含んでいること
    expect(unicodeStr.length).toBeGreaterThan(0)
    expect(unicodeStr).toContain('⠁⠃⠉⠙⠑') // 1ページ目の見出し
    expect(unicodeStr).toContain('⠅⠇⠍⠝⠕') // 2ページ目の見出し
    expect(unicodeStr).toContain('@PB@') // 改ページが入っていること
    expect(unicodeStr).toContain('@HR@') // 水平線が入っていること

    // パース処理の検証
    const parsed = splitbraille(unicodeStr)
    expect(parsed.docTitle).toBe('⠁⠃⠉⠙⠑') // ドキュメントタイトルが正しく抽出されること
    expect(parsed.title).toContain('⠁⠃⠉⠙⠑') // 1ページ目の見出し
    expect(parsed.title).toContain('⠅⠇⠍⠝⠕') // 2ページ目の見出し
    expect(parsed.body.length).toBe(2) // 2ページ構成であること
  })

  it('test_all_ascii_braille.brf が正常にデコードおよびパースされること', () => {
    const filePath = path.join(TEST_FILES_DIR, 'test_all_ascii_braille.brf')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const unicodeStr = brf2unicode(fileContent)

    expect(unicodeStr.length).toBeGreaterThan(0)
    expect(unicodeStr).toContain('⠁⠃⠉⠙⠑') // "abcde" に相当する点字
    expect(unicodeStr).toContain('@PB@') // フォームフィードが改ページとしてパースされていること
    expect(unicodeStr).toContain('⠁⠇⠇') // "ALL" に相当する点字

    // パース処理の検証
    const parsed = splitbraille(unicodeStr)
    expect(parsed.docTitle).toContain('⠁⠇⠇') // "ALL"
    expect(parsed.body.length).toBe(2)
  })

  it('test_all_bse_patterns.bse が正常にデコードおよびパースされること', () => {
    const filePath = path.join(TEST_FILES_DIR, 'test_all_bse_patterns.bse')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const unicodeStr = brf2unicode(fileContent)

    expect(unicodeStr.length).toBeGreaterThan(0)
    expect(unicodeStr).toContain('@PB@')
    expect(unicodeStr).toContain('@HR@')

    const parsed = splitbraille(unicodeStr)
    expect(parsed.docTitle).toBe('⠁⠃⠉⠙⠑') // 1ページ目の見出し
    expect(parsed.body.length).toBe(2)
  })
})
