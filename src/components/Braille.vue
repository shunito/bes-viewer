<template>
  <p v-if="isFileClose">ファイルを選択してください</p>
  <div v-else class="besbody">
    <section v-for="(page,pno) in bes" v-bind:key="pno" class="page">
      <template v-for="(line,lno) in page">
        <hr v-if="line === '@HR@'" v-bind:key="lno">
        <p v-else v-bind:key="lno">{{line}}</p>
      </template>
    </section>
  </div>
</template>

<script>

function splitbraille (str) {
  let pages = str.split('@PB@')
  let result = []

  pages.forEach(page => {
    result.push(page.split('@LB@'))
  })

  return result
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
</style>
