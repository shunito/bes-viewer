<template>
  <p v-if="isFileClose" class="is-size-2 is-size-4-mobile">⠢⠥⠃⠙⠊⠀⠻⠴⠕⠩⠳⠟⠀⠩⠐⠕⠱⠃<br/>ファイルを選択してください</p>
  <div v-else class="besbody is-size-3 is-size-5-mobile" role="document" id="docTop">
    <h1 v-if="bes.docTitle">{{ bes.docTitle }}</h1>
    <p v-if="checkYomi">{{ tenji2yomi(bes.docTitle) }}</p>
    <nav v-if="bes.title" aria-label="目次" class="toc content" id="toc">
      <ol>
        <li v-for="(title,pno) in bes.title" v-bind:key="pno">
          <a :href="'#page'+(pno+1)">{{title}}</a>
          <p v-if="checkYomi" class="toc-yomi">{{ tenji2yomi(title) }}</p>
        </li>
      </ol>
    </nav>
    <article>
      <section v-for="(page,pno) in bes.body" v-bind:key="pno" class="columns page" :id="'page'+(pno+1)">
        <div class="column">
        <template v-for="(line,lno) in page">
          <hr v-if="line === '@HR@'" v-bind:key="lno">
          <h1 v-else-if="line.substr(0,4) ==='@H1@'" v-bind:key="lno">{{line.slice(4)}}</h1>
          <h2 v-else-if="line.substr(0,4) ==='@H2@'" v-bind:key="lno">{{line.slice(4)}}</h2>
          <p v-else-if="line.length === 0" v-bind:key="lno"><br /></p>
          <p v-else v-bind:key="lno">{{line}}</p>
        </template>
        <p class="is-size-6 has-text-right">
          <a href="#docTop" aria-labelledby="toc"><b-icon icon="arrow-up" size="is-small" aria-hidden="true" />⠾⠩⠐⠳⠯⠀⠾⠐⠞⠙</a>
        </p>
        </div>
        <div v-if="checkYomi" class="column is-one-third yomi">
          <template v-for="(line,lno) in page">
            <hr v-if="line === '@HR@'" v-bind:key="lno">
            <h1 v-else-if="line.substr(0,4) ==='@H1@'" v-bind:key="lno">{{ tenji2yomi(line.slice(4)) }}</h1>
            <h2 v-else-if="line.substr(0,4) ==='@H2@'" v-bind:key="lno">{{ tenji2yomi(line.slice(4)) }}</h2>
            <p v-else-if="line.length === 0" v-bind:key="lno"><br /></p>
            <p v-else v-bind:key="lno">{{ tenji2yomi(line) }}</p>
          </template>
          <p class="is-size-6 has-text-right">
            <a href="#docTop"><b-icon icon="arrow-up" size="is-small" aria-hidden="true" />もくじへ もどる</a>
          </p>
        </div>
      </section>
    </article>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

const tenji = require('tenji')

function isHeader (line:string) :boolean {
  if (line.split('⠒').length > 5) {
    return false
  }

  if (line.length < 5) {
    return false
  }
  return true
}

function splitbraille (str:string):object {
  let pages:string[]  = str.split('@PB@')
  let bodys:any[] = []
  let titles:string[] = []
  let docTitle:boolean| string = false

  pages.forEach(page => {
    const lines:string[] = page.split('@LB@')
    let headding = false
    let p:string[] = []
    let trimLine:string = ''

    lines.forEach(line => {
      trimLine = line.replace(/^⠀+|⠀+$/g, '')
      if (headding === false) {
        if (isHeader(trimLine)) {
          titles.push(trimLine)
          if (docTitle === false) {
            docTitle = trimLine
            line = '@H1@' + line
          } else {
            line = '@H2@' + line
          }
          headding = true
        }
      }
      p.push(line as string)
    })

    // ページの見出しが見つからない場合は最初の行を見出しとする
    if (headding === false) {
      titles.push('⠀⠀')
    }
    bodys.push(p)
  })

  return {
    docTitle: docTitle,
    title: titles,
    body: bodys
  }
}

/*
export default {
  name: 'braille',
  props: ['braille', 'checkYomi'],
  computed: {
    isFileClose: function () {
      return this.braille.length === 0
    },
    bes: function () {
      return splitbraille(this.braille)
    }
  },
  methods: {
    tenji2yomi: function (str) {
      let line = str
      if (line.substr(0, 4) === '@H1@') { line = line.slice(4) }
      if (line.substr(0, 4) === '@H2@') { line = line.slice(4) }
      if (line.substr(0, 4) === '@HR@') { line = '<hr />' }
      if (line.length === 0) { line = '<br />' }
      return tenji.fromTenji(line)
    }
  }
}
*/

@Component
export default class Braille extends Vue {
  @Prop({ default: '' })
  braille!: string;

  @Prop({ default: false })
  checkYomi!:boolean;

  get isFileClose(){
      return this.braille.length === 0
  }

  get bes(){
      return splitbraille(this.braille)
  }

  tenji2yomi(str:string) :string {
      let line:string = str
      if (line.substr(0, 4) === '@H1@') { line = line.slice(4) }
      if (line.substr(0, 4) === '@H2@') { line = line.slice(4) }
      if (line.substr(0, 4) === '@HR@') { line = '<hr />' }
      if (line.length === 0) { line = '<br />' }
      return tenji.fromTenji(line)
    }
  
}

</script>

<style>
.besbody {
  font-family: "Apple Braille", "Segoe UI Symbol", Braille6, monospace;
}
.toc {
  padding-bottom: 2rem;
  border-bottom: 2px solid #CCC;
}
.page {
  position: relative;
  padding: 2rem 0 2rem 0;
  border-bottom: 2px solid #999;
}
.yomi {
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #CCC;
  white-space: pre-wrap;
  font-family: monospace;
}
.toc-yomi{
  font-size: 1rem;
  color: #333;
}
</style>
