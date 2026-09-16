# Zt UI

A lightweight Vue 3 component library with TypeScript support and a glass-inspired visual style.

## Features

- Vue 3 Composition API and complete TypeScript declarations
- ESM and UMD builds
- Accessible keyboard and focus behavior
- Reduced-motion support
- Interactive documentation with copyable Vue + TypeScript examples
- Optional VisActor peer dependencies for the high-performance VTableGrid

## Components

- Button
- Tag
- Radio and RadioGroup
- Checkbox and CheckboxGroup
- Switch
- Input
- Password
- InputNumber
- Select
- Form, FormItem, and FormGroup
- Badge
- Steps and Step
- Pagination
- VTableGrid
- Modal
- Drawer

## Sizes

Density-aware components share the exported `ZtComponentSize` type and support `mini`, `small`, `default`, `medium`, and `large`. This applies to Button, Tag, Radio, Checkbox, Switch, Input, Password, InputNumber, Select, Form, Badge, Steps, Pagination, Modal, and VTableGrid. RadioGroup and CheckboxGroup pass the selected size to their children; Form passes it to registered input controls.

Drawer keeps its established `size` API for panel width or height, so values such as `420`, `"36rem"`, and `"60%"` remain compatible.

## Installation

```bash
npm install @ztechjs/zt-ui
```

To use `ZtVTableGrid`, install its VisActor peers as well:

```bash
npm install @visactor/vtable @visactor/vue-vtable @visactor/vtable-editors
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

## Input controls

`ZtInput`, `ZtPassword`, and `ZtInputNumber` provide text, password, and numeric input with the shared five-level size contract:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtInput, ZtInputNumber, ZtPassword } from '@ztechjs/zt-ui'

const keyword = ref('')
const password = ref('')
const quantity = ref<number | null>(1)
</script>

<template>
  <ZtInput v-model="keyword" clearable placeholder="Search" />
  <ZtPassword v-model="password" autocomplete="current-password" />
  <ZtInputNumber v-model="quantity" :min="1" :max="99" />
</template>
```

`ZtForm` coordinates field layout and validation, while `ZtFormGroup` optionally organizes related sections:

```vue
<ZtForm ref="formRef" :model="account" :rules="rules" label-width="88px">
  <ZtFormItem label="Email" prop="email">
    <ZtInput v-model="account.email" />
  </ZtFormItem>
  <ZtFormItem>
    <ZtButton status="primary" @click="formRef?.validate()">Submit</ZtButton>
  </ZtFormItem>
</ZtForm>
```

## Select

`ZtSelect` supports single and multiple selection, local filtering, remote search, custom slots, and the shared size contract. Filter keywords remain after selection, closing, or blur; clearing the control resets both the value and keyword:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtSelect, type ZtSelectOption } from '@ztechjs/zt-ui'

const city = ref<string | null>(null)
const cityOptions: ZtSelectOption[] = [
  { label: 'Hangzhou', value: 'hangzhou' },
  { label: 'Shanghai', value: 'shanghai' },
]
</script>

<template>
  <ZtSelect v-model="city" :options="cityOptions" clearable aria-label="Operating city" placeholder="Select a city" />
</template>
```

Provide an asynchronous method when `remote` is enabled:

```ts
import type { ZtSelectOption } from '@ztechjs/zt-ui'

const searchUsers = async (keyword: string): Promise<ZtSelectOption[]> => {
  const response = await fetch(`/api/users?keyword=${encodeURIComponent(keyword)}`)
  return response.json()
}
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

## VTableGrid

`ZtVTableGrid` combines VisActor VTable with zt-ui controls for local or remote data, paging, sorting, keyed selection, row actions, cell editing, summaries, column settings, and CSV export.

```vue
<script setup lang="ts">
import { ZtVTableGrid, type ZtVTableGridColumn } from '@ztechjs/zt-ui'

type Product = { id: number; name: string; price: number; stock: number }

const columns: ZtVTableGridColumn<Product>[] = [
  { field: 'name', title: 'Product', width: 180, sort: true },
  { field: 'price', title: 'Price', editable: 'number', summary: 'avg' },
  { field: 'stock', title: 'Stock', editable: 'number', summary: 'sum' },
]
const records: Product[] = [
  { id: 1, name: 'Cloud knit', price: 399, stock: 42 },
]
</script>

<template>
  <ZtVTableGrid
    :columns="columns"
    :records="records"
    editable
    checkbox
    :summary="{ label: 'Total' }"
    :toolbar="['export', 'columnsetting', 'reload']"
  />
</template>
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
