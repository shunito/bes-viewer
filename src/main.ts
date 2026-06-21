import { createApp } from 'vue'
import Oruga from '@oruga-ui/oruga-next'
import { bulmaConfig } from '@oruga-ui/theme-bulma'
import '@oruga-ui/theme-bulma/style.css'
import App from './App.vue'

createApp(App).use(Oruga, bulmaConfig).mount('#app')
