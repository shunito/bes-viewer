<template>
  <div id="app">
    <header>
      <nav class="navbar is-dark">
        <div class="navbar-brand">
          <h1 class="navbar-item">BES Viewer α</h1>
          <div class="navbar-burger burger" data-target="navbarMenu" @click="toggleMenu" :class="{'is-active': isNavOpen}">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navbarMenu" class="navbar-menu" :class="{'is-active': isNavOpen}">
          <div class="navbar-start">
            <div class="navbar-item">
              <label>ファイル <input type="file" id="file" name="file" accept=".bes" @change="onFileChange" /></label>
            </div>
            <div class="navbar-item">
              <button class="button is-small is-light" id="closeFile" v-bind:disabled="isFileClosed" @click="onFileClose">ファイルを閉じる</button>
            </div>
          </div>

          <div class="navbar-end">
            <a class="navbar-item" href="https://twitter.com/shunito">
              shunsuke ito
            </a>
          </div>
        </div>
      </nav>
    </header>

    <div class="container is-fluid">
        <main aria-live="polite">
          <Braille v-bind:braille="bes"></Braille>
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
import Hello from './components/Hello'
import Braille from './components/Braille'

import bes2unicode from './module/bes2unicode'

export default {
  name: 'app',
  data: function () {
    return {
      navIsActive: false,
      file: null,
      str: '',
      openFile: false
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
  methods: {
    toggleMenu: function () {
      this.navIsActive = !this.navIsActive
    },
    onFileChange: function (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }

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
    }
  },
  components: {
    Hello,
    Braille
  }
}
</script>

<style>
main {
  padding:2em;
  font-size: 20pt;
}
</style>
