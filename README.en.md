# Zt UI

[简体中文（主文档）](./README.md) · **English**

A Vue 3 UI library for business applications, built with TypeScript and glass-inspired visuals. Use it for admin panels, dashboards, business forms, and reporting systems.

[Documentation](https://stevqin.github.io/zt-ui/) · [Getting started](https://stevqin.github.io/zt-ui/#/guide/quick-start) · [Component demos](https://stevqin.github.io/zt-ui/#/components) · [Changelog](./CHANGELOG.md)

## Features

- **Consistent design**: Soft highlights, translucent surfaces, and spring motion across components.
- **Theme customization**: Light/dark themes, five density sizes, global corners, and CSS variables for different business layouts.
- **Business workflows**: Layout, forms, data display, navigation, feedback, overlays, and media, including complex selection, validation, and high-performance tables.
- **TypeScript**: Component props, events, slots, and instance types with editor hints.
- **Interaction**: Responsive layouts, keyboard controls, focus management, and reduced-motion support.
- **Runnable examples**: Interactive demos, copyable source, scenario guides, and complete API references.

## Business scenarios

| Scenario | Component | Capabilities |
| --- | --- | --- |
| Product details and ordering | [SkuSelect](https://stevqin.github.io/zt-ui/#/components/sku-select) | Select one SKU through the SPU → SKC → SKU hierarchy, with color images, disabled variants, controlled values, and an adaptive main image that can be hidden. Supports desktop and mobile layouts. |
| Desktop order entry and allocation | [SkuInput](https://stevqin.github.io/zt-ui/#/components/sku-input) | Enter quantities in a color-by-size matrix with automatic size columns, object or array values, keyboard navigation, Excel rectangle paste, and totals. Columns adapt to available space; product information can be hidden. |
| Notes and quotations | [Blockquote](https://stevqin.github.io/zt-ui/#/components/blockquote) | Present instructions, quotations, and business notes with semantic colors, an accent rule, titles, attribution, and nested content. |
| Reports and batch maintenance | [VTableGrid](https://stevqin.github.io/zt-ui/#/components/vtable-grid) | A Canvas table combining query forms, pagination, draft editing, import/export, and task states, with cell, header, action, and toolbar extensions. |
| Lists and statistics | [Table](https://stevqin.github.io/zt-ui/#/components/table) | Column filters, row numbers, summaries, merged cells, current-row highlighting, overflow tooltips, and row/cell styling. |
| Complex data entry | [Form](https://stevqin.github.io/zt-ui/#/components/form) | Field layouts and groups, dynamic nested data, synchronous or asynchronous validation, targeted validation and reset, and server-side errors. |

See each component page for data structures, usage code, and API details.

## Installation

Install in a Vue 3.5+ project:

```bash
npm install @ztechjs/zt-ui
```

The package also declares VisActor table packages as peer dependencies. See [Getting started](https://stevqin.github.io/zt-ui/#/guide/quick-start) for dependency versions and installation details.

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

Use `ZtConfigProvider` to configure size, theme, and radius. Explicit component settings override defaults. Extra focus rings are off by default: set `focus-ring="keyboard"` for keyboard input, `focus-ring="all"` for every focus, or `focus-ring="none"` to hide them. Teleported layers inherit their provider; focus and keyboard interactions remain available. See [Global configuration](https://stevqin.github.io/zt-ui/#/components/config-provider) for more options.

## Documentation and examples

Full usage guides, interactive demos, and APIs are available on the [GitHub Pages documentation site](https://stevqin.github.io/zt-ui/). The site's interface and built-in component labels are primarily Chinese.

- [Component demos](https://stevqin.github.io/zt-ui/#/components): Browse components, try interactions, and copy examples.
- [Theme and styling](https://stevqin.github.io/zt-ui/#/guide/theme): Light and dark themes and component appearance.
- [Global configuration](https://stevqin.github.io/zt-ui/#/guide/configuration): Shared size, corner radius, and theme.
- [Imperative feedback](https://stevqin.github.io/zt-ui/#/extensions): Integrate the separate `@ztechjs/zt-alert` library.

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
