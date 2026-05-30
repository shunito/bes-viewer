# bes-viewer

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Editor setup (Vue 2 + TypeScript)

This project uses Vue 2 with `vue-class-component`/`vue-property-decorator`. The Vue 3 language tools (Volar / `vue-tsc`) can produce false-positive template diagnostics for this codebase.

Recommended local editor configuration:

- Install and enable the `Vetur` extension (`octref.vetur`).
- Disable or uninstall the `Volar` extension (`johnsoncodehk.volar`) for this workspace to avoid Vue3-specific template typechecking.
- Use the workspace VSCode settings in `.vscode/` (already provided) which recommend the appropriate extension and point the editor to the project's TypeScript.

If you intentionally want strict Vue template typechecking, consider migrating components to the Composition API / Vue 3 and enabling `vue-tsc`.
