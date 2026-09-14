# Zt UI

A lightweight Vue 3 component library with TypeScript support and a glass-inspired visual style.

## Features

- Vue 3 Composition API and complete TypeScript declarations
- ESM and UMD builds
- Accessible keyboard and focus behavior
- Reduced-motion support
- Interactive documentation with copyable Vue + TypeScript examples
- No runtime dependency other than Vue

## Components

- Button
- Tag
- Radio and RadioGroup
- Checkbox and CheckboxGroup
- Switch
- Badge
- Steps and Step
- Pagination
- Modal
- Drawer

## Installation

```bash
npm install @ztechjs/zt-ui
```

Import the stylesheet once in your application entry:

```ts
import '@ztechjs/zt-ui/style.css'
```

Then import the components you need:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtButton, ZtModal } from '@ztechjs/zt-ui'

const visible = ref(false)
const fullscreen = ref(false)
</script>

<template>
  <ZtButton status="primary" @click="visible = true">
    Open modal
  </ZtButton>

  <ZtModal
    v-model="visible"
    v-model:fullscreen="fullscreen"
    title="Workspace"
    show-fullscreen-button
    draggable
  >
    Modal content
  </ZtModal>
</template>
```

## Modal and Drawer

`ZtModal` and `ZtDrawer` share overlay behavior including scroll locking, Escape handling, focus trapping, focus restoration, async close guards, loading states, slots, and nested overlay stacking.

Modal additionally supports an optional built-in fullscreen control and viewport-bounded header dragging:

```vue
<ZtModal
  v-model="visible"
  v-model:fullscreen="fullscreen"
  show-fullscreen-button
  draggable
  @fullscreen-change="handleFullscreenChange"
>
  Content
</ZtModal>
```

Drawer supports all four viewport edges:

```vue
<ZtDrawer
  v-model="visible"
  title="Filters"
  placement="right"
  :size="420"
>
  Content
</ZtDrawer>
```

## Steps

`ZtSteps` supports responsive horizontal, centered, simple, fixed-space, and vertical layouts. Step states can be derived from `active` or set explicitly.

```vue
<ZtSteps :active="1" finish-status="success" align-center>
  <ZtStep title="Create order" description="Enter order details" />
  <ZtStep title="Review" description="Confirm inventory" />
  <ZtStep title="Complete" description="Dispatch the order" />
</ZtSteps>
```

`ZtPagination` supports composable layouts, collapsed page ranges, page-size selection, jump input, alignment, and two-way bindings:

```vue
<ZtPagination
  v-model:current-page="currentPage"
  v-model:page-size="pageSize"
  :total="400"
  :page-sizes="[10, 20, 50, 100]"
  layout="total, sizes, prev, pager, next, jumper"
/>
```

## Development

```bash
npm install
npm test
npm run build
```

Run the documentation site:

```bash
cd site
npm install
npm run dev
```

## License

[MIT](./LICENSE)
