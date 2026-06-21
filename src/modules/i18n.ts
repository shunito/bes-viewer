import { ref, computed } from 'vue'

export type Locale = 'ja' | 'en'

const messages = {
  ja: {
    title: 'BES Viewer α',
    selectFile: 'ファイル',
    closeFile: 'ファイルを閉じる',
    yomiLabel: '読み',
    show: '表示',
    hide: '非表示',
    placeholder: 'ファイルを選択してください',
    backToToc: 'もくじへ もどる',
    toc: '目次',
    backToTocBraille: '⠾⠩⠐⠳⠯⠀⠾⠐⠞⠙'
  },
  en: {
    title: 'Braille Viewer α',
    selectFile: 'File',
    closeFile: 'Close File',
    yomiLabel: 'Plain Text',
    show: 'Show',
    hide: 'Hide',
    placeholder: 'Please select a file',
    backToToc: 'Back to TOC',
    toc: 'TOC',
    backToTocBraille: '⠃⠁⠉⠅⠀⠞⠕⠀⠞⠕⠉'
  }
}

const getInitialLocale = (): Locale => {
  if (typeof navigator === 'undefined') {
    return 'en'
  }
  const lang = navigator.language || 'en'
  return lang.startsWith('ja') ? 'ja' : 'en'
}

const currentLocale = ref<Locale>(getInitialLocale())

export function useI18n() {
  const t = (key: keyof typeof messages['ja']) => {
    return messages[currentLocale.value]?.[key] || messages['en'][key]
  }

  const locale = computed({
    get: () => currentLocale.value,
    set: (val: Locale) => {
      currentLocale.value = val
    }
  })

  return {
    t,
    locale
  }
}
