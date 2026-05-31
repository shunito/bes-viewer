# bes-viewer

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build

# lint and fix files
npm run lint
```

## Editor setup (Vue 2 + TypeScript)

This project uses Vue 2 with `vue-class-component`/`vue-property-decorator`. The Vue 3 language tools (Volar / `vue-tsc`) can produce false-positive template diagnostics for this codebase.

Recommended local editor configuration:

- Install and enable the `Vetur` extension (`octref.vetur`).
- Disable or uninstall the `Volar` extension (`johnsoncodehk.volar`) for this workspace to avoid Vue3-specific template typechecking.
- Use the workspace VSCode settings in `.vscode/` (already provided) which recommend the appropriate extension and point the editor to the project's TypeScript.

If you intentionally want strict Vue template typechecking, consider migrating components to the Composition API / Vue 3 and enabling `vue-tsc`.
