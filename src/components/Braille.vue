<template>
  <p v-if="isFileClose" class="is-size-2 is-size-4-mobile">⠢⠥⠃⠙⠊⠀⠻⠴⠕⠩⠳⠟⠀⠩⠐⠕⠱⠃<br/>ファイルを選択してください</p>
  <div v-else class="besbody is-size-3 is-size-5-mobile" role="document">
    <nav v-if="bes.title" aria-label="目次" class="toc">
      <ol>
        <li v-for="(title,pno) in bes.title" v-bind:key="pno"><a :href="'#page'+(pno+1)">{{title}}</a></li>
      </ol>
    </nav>
    <article>
      <section v-for="(page,pno) in bes.body" v-bind:key="pno" class="page" :id="'page'+(pno+1)">
        <template v-for="(line,lno) in page">
          <hr v-if="line === '@HR@'" v-bind:key="lno">
          <h1 v-else-if="line.substr(0,4) ==='@H1@'" v-bind:key="lno">{{line.slice(5)}}</h1>
          <h2 v-else-if="line.substr(0,4) ==='@H2@'" v-bind:key="lno">{{line.slice(5)}}</h2>
          <p v-else-if="line.length === 0" v-bind:key="lno"><br /></p>
          <p v-else v-bind:key="lno">{{line}}</p>
        </template>
      </section>
    </article>
  </div>
</template>

<script>

function isHeader (line) {
  if (line.split('⠒').length > 5) {
    return false
  }

  if (line.length < 5) {
    return false
  }
  return true
}

function splitbraille (str) {
  let pages = str.split('@PB@')
  let bodys = []
  let titles = []
  let docTitle = false

  pages.forEach(page => {
    const lines = page.split('@LB@')
    let headding = false
    let p = []
    let trimLine = ''

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
      p.push(line)
    })
    bodys.push(p)
  })

  return {
    docTitle: docTitle,
    title: titles,
    body: bodys
  }
}

export default {
  name: 'braille',
  props: ['braille'],
  computed: {
    isFileClose: function () {
      return this.braille.length === 0
    },
    bes: function () {
      return splitbraille(this.braille)
    }
  }
}
</script>

<style>
.besbody {
  font-family: "Apple Braille", "Segoe UI Symbol", Braille6, monospace; 
}
.toc {
  padding: 0 1rem 2rem 1rem;
  border-bottom: 2px solid #999;
}
.page {
  padding: 2rem 0 2rem 0;
  border-bottom: 2px solid #999;
}
</style>
