# Zt UI

[简体中文（主文档）](./README.md) · **English**

A Vue 3 UI library for business applications, built with TypeScript and glass-inspired visuals. Use it for admin panels, dashboards, business forms, and reporting systems.

[Documentation](https://stevqin.github.io/zt-ui/) · [Getting started](https://stevqin.github.io/zt-ui/#/getting-started) · [Component demos](https://stevqin.github.io/zt-ui/#/components) · [Changelog](./CHANGELOG.md)

## Features

- **Consistent design**: Soft highlights, translucent surfaces, and spring motion across components.
- **Theme customization**: Light/dark themes, five density sizes, global corners, and CSS variables for different business layouts.
- **Business workflows**: Layout, forms, data display, navigation, feedback, overlays, and media, including complex selection, validation, and high-performance tables.
- **TypeScript**: Component props, events, slots, and instance types with editor hints.
- **Interaction**: Responsive layouts, keyboard controls, focus management, and reduced-motion support.
- **Runnable examples**: Interactive demos, copyable source, scenario guides, and complete API references.

## Installation

Install in a Vue 3.5+ project:

```bash
npm install @ztechjs/zt-ui
```

The package also declares VisActor table packages as peer dependencies. See [Getting started](https://stevqin.github.io/zt-ui/#/getting-started) for dependency versions and installation details.

## Quick start

Import the stylesheet once at your application entry point:

```ts
import '@ztechjs/zt-ui/style.css'
```

Import and use components in a Vue single-file component:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtButton, ZtConfigProvider } from '@ztechjs/zt-ui'

const count = ref(0)
</script>

<template>
  <ZtConfigProvider size="default" theme="light" :border-radius="11">
    <ZtButton status="primary" @click="count++">
      Clicked {{ count }} times
    </ZtButton>
  </ZtConfigProvider>
</template>
```

Use `ZtConfigProvider` to configure size, theme, and radius. Explicit component settings override defaults. See [Global configuration](https://stevqin.github.io/zt-ui/#/config-provider) for more options.

## Documentation and examples

Full usage guides, interactive demos, and APIs are available on the [GitHub Pages documentation site](https://stevqin.github.io/zt-ui/). The site's interface and built-in component labels are primarily Chinese.

- [Component demos](https://stevqin.github.io/zt-ui/#/components): Browse components, try interactions, and copy examples.
- [Scenarios](https://stevqin.github.io/zt-ui/#/scenarios): Forms, query filters, data lists, and overlay editing.
- [Design foundations](https://stevqin.github.io/zt-ui/#/foundations): Themes, density, corners, and status colors.
- [Conventions](https://stevqin.github.io/zt-ui/#/conventions): Props, events, and interaction patterns.
- [API reference](https://stevqin.github.io/zt-ui/#/api): Props, events, slots, and types.
- [Imperative feedback](https://stevqin.github.io/zt-ui/#/feedback): Integrate the separate `@ztechjs/zt-alert` library.

## Local development

```bash
npm install
npm test
npm run build
```

Start the documentation site locally:

```bash
cd site
npm install
npm run dev
```

## License

[MIT](./LICENSE) © ztech
