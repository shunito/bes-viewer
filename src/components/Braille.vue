<template>
  <p v-if="isFileClose" class="is-size-2 is-size-4-mobile">⠢⠥⠃⠙⠊⠀⠻⠴⠕⠩⠳⠟⠀⠩⠐⠕⠱⠃<br/>{{ t('placeholder') }}</p>
  <div v-else class="besbody is-size-3 is-size-5-mobile" role="document" id="docTop">
    <h1 v-if="bes.docTitle">{{ bes.docTitle }}</h1>
    <p v-if="checkYomi">{{ tenji2yomi(bes.docTitle) }}</p>
    <nav v-if="bes.title" :aria-label="t('toc')" class="toc content" id="toc">
      <ol>
        <li v-for="(title,pno) in bes.title" :key="pno">
          <a :href="'#page'+(pno+1)">{{title}}</a>
          <p v-if="checkYomi" class="toc-yomi">{{ tenji2yomi(title) }}</p>
        </li>
      </ol>
    </nav>
    <article>
      <section v-for="(page,pno) in bes.body" :key="pno" class="columns page" :id="'page'+(pno+1)">
        <div class="column">
        <template v-for="(line,lno) in page" :key="lno">
          <hr v-if="line === '@HR@'">
          <h1 v-else-if="line.slice(0,4) ==='@H1@'">{{line.slice(4)}}</h1>
          <h2 v-else-if="line.slice(0,4) ==='@H2@'">{{line.slice(4)}}</h2>
          <p v-else-if="line.length === 0"><br /></p>
          <p v-else>{{line}}</p>
        </template>
        <p class="is-size-6 has-text-right">
          <a href="#docTop" aria-labelledby="toc"><o-icon icon="arrow-up" size="small" aria-hidden="true" />⠾⠩⠐⠳⠯⠀⠾⠐⠞⠙</a>
        </p>
        </div>
        <div v-if="checkYomi" class="column is-one-third yomi">
          <template v-for="(line,lno) in page" :key="lno">
            <hr v-if="line === '@HR@'">
            <h1 v-else-if="line.slice(0,4) ==='@H1@'">{{ tenji2yomi(line.slice(4)) }}</h1>
            <h2 v-else-if="line.slice(0,4) ==='@H2@'">{{ tenji2yomi(line.slice(4)) }}</h2>
            <p v-else-if="line.length === 0"><br /></p>
            <p v-else>{{ tenji2yomi(line) }}</p>
          </template>
          <p class="is-size-6 has-text-right">
            <a href="#docTop"><o-icon icon="arrow-up" size="small" aria-hidden="true" />{{ t('backToToc') }}</a>
          </p>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as tenji from 'tenji'
import { OIcon } from '@oruga-ui/oruga-next'
import { splitbraille, type ParsedBraille } from '@/modules/brailleParser'
import { unicode2brf } from '../modules/brf2unicode'
import { useI18n } from '../modules/i18n'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  braille?: string;
  checkYomi?: boolean;
  isBrf?: boolean;
}>(), {
  braille: '',
  checkYomi: false,
  isBrf: false
})

const isFileClose = computed(() => props.braille.length === 0)
const bes = computed((): ParsedBraille => splitbraille(props.braille))

function tenji2yomi(str: string | false): string {
  if (str === false) return ''
  let line = str
  if (line.slice(0, 4) === '@H1@') line = line.slice(4)
  if (line.slice(0, 4) === '@H2@') line = line.slice(4)
  if (line.slice(0, 4) === '@HR@') return '<hr />'
  if (line.length === 0) return '<br />'
  if (props.isBrf) {
    return unicode2brf(line)
  }
  return tenji.fromTenji(line)
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
