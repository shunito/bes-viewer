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
              <button class="button is-small is-light" id="closeFile" v-bind:disabled="isFileClosed" @click="onFileClose">ファイルを閉じる</button>
            </div>
            <div class="navbar-item">
              読み
                <b-switch size="is-small" v-model="isYomiChecked">
                  {{ isYomiChecked ? '表示' : '非表示' }}
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
        <main class="section">
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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Braille from './components/Braille.vue'
import bes2unicode from './modules/bes2unicode'

import axios from 'axios'
import { UrlObject } from 'url';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const location = window.location
const url = new URL(location.origin)

interface HTMLElementEvent<T extends HTMLElement> extends Event {
    target: T;
}

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component({
  components: {
    Braille
  }
})
export default class App extends Vue {

    // Data
    file: any = null;
    navIsActive:boolean = false;
    isYomiChecked:boolean = false;
    openFile:boolean = false;
    url: URL = url;
    str: string = "";

    // computed
    get bes(): string {
      return this.str
    }
    get isFileClosed(): boolean {
      return !this.openFile
    }
    get isNavOpen(): boolean {
      return this.navIsActive
    }

    created() {
        const targetUrl = this.url.searchParams.get('url')
        if (targetUrl && targetUrl.length > 5 && targetUrl.slice(-4).toLowerCase() === '.bes') {
        this.onGetBesUrl(targetUrl)
        }
    }

    toggleMenu() {
      this.navIsActive = !this.navIsActive
    }

    onFileChange(event?: HTMLInputEvent) {
        let files: any = [];
        if(event) {
            const evTarget = event.target;
            files = evTarget.files
            if (!files.length) {
                return
            }
        }
        else{
            return;
        }

        const reader = new FileReader()
        reader.onloadend = (theFile) => {
            const target: any = theFile.target;

            if ( target && target.readyState === FileReader.DONE) {
            this.openFile = true
            this.navIsActive = false

            const result:string | ArrayBuffer = target.result as ArrayBuffer;
            const arr =  new Uint8Array(result)

            //console.log( typeof result )

            const braille = bes2unicode( arr )
            this.str = braille
            }
        }

        this.file = files[0];
        reader.readAsArrayBuffer(files[0])
    }

    onFileClose() {
      const fileInput = document.getElementById('file')
      //fileInput.value = ''
      this.file = null
      this.str = ''
      this.openFile = false
    }

    onGetBesUrl(url:string) {
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

}

</script>

<style lang="scss">
</style>
