<template>
  <div id="app">
    <header>
      <nav class="navbar is-dark">
        <div class="navbar-brand">
          <h1 class="navbar-item">BES Viewer α</h1>
        </div>

        <div id="navbarMenu" class="navbar-menu is-active">
          <div class="navbar-start">
            <div class="navbar-item">
              <label>ファイル <input type="file" id="file" name="file" accept=".bes" @change="onFileChange" /></label>
            </div>
            <div class="navbar-item">
              <button class="button is-small is-light" id="closeFile" v-bind:disabled="isFileClosed" @click="onFileClose">ファイルを閉じる</button>
            </div>
            <div class="navbar-item">
              <b-switch size="is-small" v-model="isYomiChecked">
                {{ isYomiChecked ? '読みを表示する' : '読みを表示しない' }}
              </b-switch>
            </div>
          </div>

          <div class="navbar-end">
            <p class="navbar-item">⠰⠠⠃⠠⠑⠠⠎⠀⠤⠢⠥⠃⠙⠀⠘⠭⠒⠁⠒</p>
          </div>
        </div>
      </nav>
    </header>

    <div class="container is-fluid">
        <main aria-live="polite" class="section">
          <Braille v-bind:braille="bes" :checkYomi="isYomiChecked"></Braille>
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

<script>
import Braille from './components/Braille'

import bes2unicode from './module/bes2unicode'

import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export default {
  name: 'app',
  data: function () {
    return {
      navIsActive: false,
      file: null,
      str: '',
      openFile: false,
      isYomiChecked: false,
      url: new URL(window.location)
    }
  },
  computed: {
    bes: function () {
      return this.str
    },
    isFileClosed: function () {
      return !this.openFile
    },
    isNavOpen: function () {
      return this.navIsActive
    }
  },
  created: function () {
    const targetUrl = this.url.searchParams.get('url')
    if (targetUrl.length > 5 && targetUrl.slice(-4).toLowerCase() === '.bes') {
      this.onGetBesUrl(targetUrl)
    }
  },
  methods: {
    toggleMenu: function () {
      this.navIsActive = !this.navIsActive
    },
    onFileChange: function (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      console.log(files[0])

      const reader = new FileReader()
      reader.onloadend = (theFile) => {
        if (theFile.target.readyState === FileReader.DONE) {
          this.openFile = true
          this.navIsActive = false

          const arr = new Uint8Array(theFile.target.result)
          const braille = bes2unicode(arr)
          this.str = braille
        }
      }

      this.file = files[0]
      reader.readAsArrayBuffer(files[0])
    },
    onFileClose: function () {
      const fileInput = document.getElementById('file')
      fileInput.value = ''
      this.file = null
      this.str = ''
      this.openFile = false
    },
    getApi: function (path, params, headers) {
      if (!params) {
        params = {}
      }
      if (!headers) {
        headers = {}
      }
      return axios({
        method: 'GET',
        url: path,
        params: params,
        headers: headers
      })
    },
    onGetBesUrl: function (url) {
      fetch(url, {
        method: 'GET'
      })
        .then(response => response.arrayBuffer())
        .then(buf => {
          const data = new Uint8Array(buf)
          const braille = bes2unicode(data)
          this.str = braille
          this.openFile = true
          this.navIsActive = false
        })
    }
  },
  components: {
    Braille
  }
}
</script>

<style>
</style>
