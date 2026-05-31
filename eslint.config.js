import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default [
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  }
]
