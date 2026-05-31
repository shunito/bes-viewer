<template>
  <div id="app">
    <header>
      <nav class="navbar is-dark" title="メインナビゲーション" id="main-header">
        <div class="navbar-brand">
          <h1 class="navbar-item">BES Viewer α</h1>
        </div>

        <div id="navbarMenu" class="navbar-menu is-active">
          <div class="navbar-start">
            <div class="navbar-item">
              <label>ファイル <input type="file" id="file" name="file" accept=".bes" @change="onFileChange" /></label>
            </div>
            <div class="navbar-item">
              <button class="button is-small is-light" id="closeFile" :disabled="isFileClosed" @click="onFileClose">ファイルを閉じる</button>
            </div>
            <div class="navbar-item">
              読み
                <o-switch size="small" v-model="isYomiChecked">
                  {{ isYomiChecked ? '表示' : '非表示' }}
                </o-switch>
            </div>
          </div>
          <div class="navbar-end">
            <p class="navbar-item">⠰⠠⠃⠠⠑⠠⠎⠀⠤⠢⠥⠃⠙⠀⠘⠭⠒⠁⠒</p>
          </div>
        </div>
      </nav>
    </header>

    <div class="container is-fluid">
        <main class="section">
          <Braille :braille="bes" :checkYomi="isYomiChecked"></Braille>
        </main>
    </div>

    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>BES Viewer α</strong> by <a href="https://twitter.com/shunito">Shunsuke Ito</a>.
          The <a href="https://github.com/shunito/bes-viewer">source code</a> is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Braille from './components/Braille.vue'
import bes2unicode from './modules/bes2unicode'

const isYomiChecked = ref(false)
const openFile = ref(false)
const navIsActive = ref(false)
const str = ref('')

const bes = computed(() => str.value)
const isFileClosed = computed(() => !openFile.value)

const toggleMenu = () => {
  navIsActive.value = !navIsActive.value
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || !files.length) return

  const reader = new FileReader()
  reader.onloadend = (theFile) => {
    const target = theFile.target as FileReader
    if (target && target.readyState === FileReader.DONE) {
      openFile.value = true
      navIsActive.value = false
      const result = target.result as ArrayBuffer
      const arr = new Uint8Array(result)
      str.value = bes2unicode(arr)
    }
  }
  reader.readAsArrayBuffer(files[0])
}

const onFileClose = () => {
  str.value = ''
  openFile.value = false
}

const onGetBesUrl = (url: string) => {
  fetch(url, { method: 'GET' })
    .then(response => response.arrayBuffer())
    .then(buf => {
      str.value = bes2unicode(new Uint8Array(buf))
      openFile.value = true
      navIsActive.value = false
    })
}

onMounted(() => {
  const params = new URL(window.location.href).searchParams
  const targetUrl = params.get('url')
  if (targetUrl && targetUrl.length > 5 && targetUrl.slice(-4).toLowerCase() === '.bes') {
    onGetBesUrl(targetUrl)
  }
})
</script>

<style lang="scss">
</style>
