import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Braille from './Braille.vue'
import { useI18n } from '../modules/i18n'

describe('Braille.vue コンポーネントテスト', () => {
  it('ファイルが読み込まれていない初期状態：プレースホルダーが表示されること (日本語デフォルト)', () => {
    const { locale } = useI18n()
    locale.value = 'ja'
    const wrapper = mount(Braille, {
      props: {
        braille: ''
      }
    })
    expect(wrapper.text()).toContain('ファイルを選択してください')
  })

  it('ファイルが読み込まれていない初期状態：英語設定時に英語のプレースホルダーが表示されること', () => {
    const { locale } = useI18n()
    locale.value = 'en'

    const wrapper = mount(Braille, {
      props: {
        braille: ''
      }
    })
    expect(wrapper.text()).toContain('Please select a file')

    // ロケールを日本語に戻しておく
    locale.value = 'ja'
  })

  it('点字データ指定時：点字本文と目次への戻りリンク（点字）が表示されること (日本語ロケール)', () => {
    const testBraille = '⠁⠃⠉⠙⠑@LB@⠅⠇⠍⠝⠕'
    const wrapper = mount(Braille, {
      props: {
        braille: testBraille
      }
    })

    // 点字本文のレンダリング
    expect(wrapper.text()).toContain('⠁⠃⠉⠙⠑')
    expect(wrapper.text()).toContain('⠅⠇⠍⠝⠕')

    // 「もくじへ もどる」の日本語点字表示
    expect(wrapper.text()).toContain('⠾⠩⠐⠳⠯⠀⠾⠐⠞⠙')
  })

  it('点字データ指定時：英語設定時に英語の「back to toc」点字が表示されること', () => {
    const { locale } = useI18n()
    locale.value = 'en'

    const testBraille = '⠁⠃⠉⠙⠑@LB@⠅⠇⠍⠝⠕'
    const wrapper = mount(Braille, {
      props: {
        braille: testBraille
      }
    })

    // 英語の「back to toc」点字表示
    expect(wrapper.text()).toContain('⠃⠁⠉⠅⠀⠞⠕⠀⠞⠕⠉')

    locale.value = 'ja'
  })

  it('checkYomi有効時：点字に対応する「読み（平文）」カラムが表示されること (日本語＝ひらがな)', () => {
    // ⠁⠃⠉⠙⠑ は 「あいうえお」 に相当
    const testBraille = '⠁⠃⠉⠙⠑'
    const wrapper = mount(Braille, {
      props: {
        braille: testBraille,
        checkYomi: true,
        isBrf: false
      }
    })

    // 読み仮名「あいうえお」が含まれていること
    expect(wrapper.text()).toContain('あいうえお')
    // 「もくじへ もどる」の平文表記が含まれていること
    expect(wrapper.text()).toContain('もくじへ もどる')
  })

  it('checkYomi有効時：BRFファイルかつ英語設定時に「読み（Plain Text）」がアルファベット平文で表示されること', () => {
    // ⠁⠃⠉⠙⠑ (ASCII Braille では 'abcde')
    const testBraille = '⠁⠃⠉⠙⠑'
    const wrapper = mount(Braille, {
      props: {
        braille: testBraille,
        checkYomi: true,
        isBrf: true
      }
    })

    // アルファベット平文 'abcde' が含まれていること
    expect(wrapper.text()).toContain('abcde')
  })
})
