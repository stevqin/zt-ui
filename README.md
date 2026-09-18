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

The [documentation site](https://stevqin.github.io/zt-ui/) contains **79 component pages, one external feedback guide, and 339 executable examples**, including their complete Vue source and API references.

- Foundation and layout: ConfigProvider, Icon, Text, Link, Button, Typography, Layout, Row, Col, Space, Divider, Splitter, Scrollbar, Affix.
- Forms: Form, Input, Password, InputNumber, InputOtp, Radio, Checkbox, Switch, Select, SelectBox, Segmented, Slider, DatePicker, DateTimePicker, DatePickerPanel, TimePicker, TimeSelect, ColorPicker, ColorPickerPanel, Upload, Autocomplete, InputTag, Mention, Rate, Cascader, TreeSelect, Transfer.
- Data: Table, VTableGrid, Tree, Pagination, Card, Empty, Statistic, Timeline, Calendar, Descriptions, Collapse, InfiniteScroll.
- Navigation: Menu, Tabs, Breadcrumb, Steps, Dropdown, Anchor, Backtop, PageHeader.
- Feedback and overlays: Tag, Badge, Progress, Result, Skeleton, Alert, Loading, Modal, Drawer, Popover, Popconfirm, Tooltip, Tour.
- Media: Image, Avatar, Carousel, Watermark, QRCode.

Select and Tree support virtual rendering. SelectBox provides a standalone multi-select filter with draft confirmation, local and remote paging, batch matching, and immediate clear.

Imperative Message, Notification, MessageBox and fullscreen Loading belong to [@ztechjs/zt-alert](https://www.npmjs.com/package/@ztechjs/zt-alert). Install and import that package directly; zt-ui does not re-export its APIs. Declarative `ZtLoading`, `ZtAlert`, `ZtModal`, and `ZtDrawer` remain in zt-ui.

## Sizes

Density-aware components share the exported `ZtComponentSize` type and support `mini`, `small`, `default`, `medium`, and `large`. This applies to Button, Tag, Radio, Checkbox, Switch, Input, Password, InputNumber, Select, SelectBox, Form, Badge, Steps, Pagination, Modal, Drawer, and VTableGrid. RadioGroup and CheckboxGroup pass the selected size to their children; Form passes it to registered input controls.

Drawer uses `width` for left/right panels and `height` for top/bottom panels (both default to 420px). Its `size` controls density and scopes descendant controls, like Modal. Icon uses an independent number or CSS length (default `1em`); Alert has one fixed density.

## Appearance and demo contracts

以下 15 个控件公开 `underline?: boolean`：`ZtInput`、`ZtPassword`、`ZtInputNumber`、`ZtInputTag`、`ZtInputOtp`、`ZtSelect`、`ZtSelectBox`、`ZtAutocomplete`、`ZtCascader`、`ZtTreeSelect`、`ZtDatePicker`、`ZtDateTimePicker`、`ZtTimePicker`、`ZtTimeSelect`、`ZtMention`。显式 `:underline="true"` 启用下边框，`:underline="false"` 强制普通边框；省略时继承最近 Form 的 underline。嵌套 Form 建立独立边界；控件内部及弹出面板中的辅助控件保持普通边框。Button、Upload、Rate、Switch、Slider、Segmented、Radio、Checkbox、Transfer、ColorPicker 不使用此表单外观。

RadioGroup 使用 `segmented` 切换分段样式，Pagination 使用 `size` 控制密度，Badge 使用 `status` 设置颜色。视觉主题 `danger` 与校验状态 `error` 含义不同；FormItem 校验错误优先于同一表面的装饰颜色。

Button 的深度由 ConfigProvider 圆角基准决定：小于 4px 使用纯色与边框，无深度渐变或外阴影；4–8px（含两个端点）使用轻微内高光和低透明度的一像素阴影；大于 8px 使用克制的渐变与更明显的按压层次。适用于全部五档尺寸与六种视觉主题；禁用和加载减少强调，键盘焦点仍清晰，减少动画偏好会关闭位移。

Tooltip 的 `width` / `height` 接受数字（px）和字符串（CSS 长度）。省略时按内容大小展示，宽度为 `max-content` 并受视口最大宽度约束，短文本紧凑、长文本换行。显式 width / height 固定外框尺寸，超过视口时受边界约束；指定高度后只有内容区滚动，箭头保持固定。Popover 提供相同的长度换算和 height 能力；尺寸或内容变化会重新定位，空间不足时自动调整方位。

文档站仅为主组件支持六种视觉主题的页面显示统一状态控制器。Button 和 Tag 保留完整颜色矩阵；Steps 和 Result 使用业务状态，不显示该控制器；仅提供校验状态（如 Input、Password）的页面也不使用它。桌面右侧面板显示三列两行色块与文字，选中项同时有背景、轮廓和勾选标记。小屏显示右下角“状态 · primary”胶囊，点击打开底部面板；方向键切换，Escape 关闭并恢复焦点。选择跨页保存，不支持所选状态的页面使用声明的默认值。控制器同步本页适用示例；复制源码使用普通 `status` 绑定，不依赖文档站 Provider。

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

## SelectBox

`ZtSelectBox` stages changes until confirmation. Local options are filtered before paging; a remote method handles both paged searches and full-dataset batch matching:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtConfigProvider, ZtSelectBox, type ZtSelectBoxRemoteRequest, type ZtSelectBoxRemoteResult } from '@ztechjs/zt-ui'

const selected = ref<string[]>([])
const pageSize = ref(20)
async function loadOptions(request: ZtSelectBoxRemoteRequest): Promise<ZtSelectBoxRemoteResult> {
  // Your API returns { mode: 'search', options, total } or { mode: 'batch', matches }.
  // Batch matches contain { keyword, option } for every exact match across all pages.
  const response = await fetch('/api/regions/select-options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!response.ok) throw new Error('Unable to load regions')
  return response.json()
}
</script>

<template>
  <ZtConfigProvider size="small" theme="light" :border-radius="16">
    <ZtSelectBox v-model="selected" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]"
      width="100%" remote :remote-method="loadOptions" clearable aria-label="Operating regions">
      <template #option="{ option }"><strong>{{ option.label }}</strong></template>
    </ZtSelectBox>
  </ZtConfigProvider>
</template>
```

Search requests carry `{ mode: 'search', keyword, page, pageSize }`; pages start at 1 and the server returns only the current page plus the total match count. Batch requests carry `{ mode: 'batch', keywords }` and return all exact matches, including records outside the current page. Partial matches commit the valid selection and report counts through zt-alert. Disabled matches are excluded; failed batch requests preserve the text and draft for retry.

The clear button and the exposed `clear()` method only work when `clearable=true`. They immediately reset the model, draft and search, emit `change` and `clear`, and retain focus. An open panel stays open. `width` accepts pixels or a CSS length, and the selected summary stays on one line. All five sizes, themes and corner radii inherit from ConfigProvider. See the [SelectBox examples](https://stevqin.github.io/zt-ui/#/select-box) for a fully local mock API and all states.

SelectBox 默认向下展开，下方不足且上方空间更多时向上翻转；滚动、窗口尺寸、分页与远程结果变化都会重新测量。搜索、摘要、分页和确认区域固定，选项列表是唯一纵向滚动区域，面板本身不滚动，也不增加页面溢出。加载、空列表、请求失败、批量粘贴和仅看已选模式遵循同一约束。若视口高度小于固定区域所需高度，则约束并裁剪面板；不启用整面板滚动，也不覆盖触发器，因此极小高度下部分操作暂不可见。

## Imperative feedback

```bash
npm install @ztechjs/zt-alert
```

```ts
import { ZtMessage, ZtLoading as ZtFullscreenLoading } from '@ztechjs/zt-alert'
import '@ztechjs/zt-alert/style.css'

ZtMessage.success('Filters applied')
const loading = ZtFullscreenLoading.open({ text: 'Loading…' })
await loading.close()
```

The zt-ui stylesheet includes the styles needed by SelectBox batch feedback. Applications using zt-alert directly should also import its stylesheet as above. The [feedback guide](https://stevqin.github.io/zt-ui/#/feedback) documents this boundary; `ZtLoading` imported from zt-ui remains a local declarative Vue component.

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
  :width="420"
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


### 日期与日期时间选择器

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtDatePicker, ZtDateTimePicker, ZtPagination } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue } from '@ztechjs/zt-ui'
import '@ztechjs/zt-ui/style.css'
const date = ref<ZtDatePickerValue>(null)
const dateRange = ref<ZtDatePickerValue>(null)
const datetime = ref<ZtDatePickerValue>(null)
const datetimeRange = ref<ZtDatePickerValue>(null)
</script>
<template>
  <ZtDatePicker v-model="date" clearable />
  <ZtDatePicker v-model="dateRange" range clearable />
  <ZtDateTimePicker v-model="datetime" clearable />
  <ZtDateTimePicker v-model="datetimeRange" range clearable />
  <ZtPagination status="success" :total="100" />
</template>
```

日期值为本地 `YYYY-MM-DD`，日期时间为本地 `YYYY-MM-DD HH:mm:ss`，不做时区转换。
范围值为 `[开始值, 结束值]`，清空返回 `null`，`''` 和 `null` 显示 placeholder。
日期选择完成即提交；日期时间在点击“确定”后提交，Esc / 取消 / 点击外部会丢弃草稿。
支持 `range`、`placeholder`、`clearable`、`disabled`、`readonly`、`disabledDate(date)`、五档 `size` 和颜色主题 `status`（default / primary / success / warning / danger / info，默认 primary；error 表示校验错误）。
`disabledDate` 限制起止端点，区间内部允许包含禁用日期。时间精确到秒，年份 1–9999。
事件：`update:modelValue`、`change`、`clear`、`visible-change`、`focus`、`blur`；实例方法：`focus`、`blur`、`open`、`close`、`clear`。

分页 `status` 支持 `default / primary / success / warning / danger / info`，默认 `primary`，使用蓝色高亮。


日期组件的节假日标识由业务传入，不内置年度节假日或调休表：

```vue
<ZtDatePicker
  v-model="date"
  status="success"
  :holidays="[
    { key: '2026-01-01', value: '元旦' },
    { key: '2026-01-15', value: '公司纪念日（示例）' },
  ]"
  :show-holidays="true"
/>
```

`DateTimePicker` 和 `range` 模式使用相同参数。`holidays` 默认为 `[]`，
`showHolidays` 默认为 `true`；`key` 为本地 `YYYY-MM-DD`，`value` 为节日名。
名称在日期格内显示，过长时截断，悬停显示全名。重复日期取最后一项，无效日期和空名称忽略。
标识不会禁用日期；是否可选仍由 `disabledDate` 控制。
主题覆盖输入框焦点、日历选中日期、范围高亮和确认按钮；表单错误状态独立保留。

日期面板使用自定义年月选择器：点击年份打开十年网格，选年后进入十二个月网格；
点击月份可直接切月。全部按钮、主题色和焦点样式由组件绘制，不使用浏览器原生年份输入或月份下拉菜单。
支持方向键、Home / End、PageUp / PageDown；浏览年月不会提交值，完成日期选择才提交。

日期与日期时间组件的 `range` 模式使用双日历面板展示连续两个月，左右年月联动，支持跨面板选择和区间高亮；小屏下自动上下排列。单日期模式保持单面板。

### 文档站维护

`site/` 按“设计基础 → 组件全景 → 场景方案 → 组件文档”组织阅读路径。组件体系分为基础、布局、表单、数据展示、导航、反馈、浮层与媒体八类；已稳定组件在同一页面连续呈现介绍、示例、API 和类型定义，规划组件只出现在路线图中，避免把尚未交付的能力误当成公开接口。

`site/src/docs/catalog.ts` 是组件分组、状态、路线图与场景关联的单一数据源。组件详情使用 `/:component`，API 锚点为 `/:component#api`，类型定义为 `/:component#types`；`/api` 只提供完整索引。旧的 `/api/:component` 路由已移除。场景示例位于 `site/src/views/scenarios/`，并通过 `?raw` 提供可复制的完整源码。

在 `site/` 中运行 `npm run dev`、`npm test` 或 `npm run build` 会先执行 API 同步。生成器从 Props、Emits、Slots、Expose 及 TypeScript 定义生成 `site/src/docs/api.generated.json`；中文语义、默认值和继承关系维护在 `site/scripts/api/metadata/`，无法自动推断的实例方法签名维护在 `site/scripts/api-overrides.mjs`。运行 `npm run docs:api` 可手动刷新。生成阶段会拒绝缺失说明、含糊类型、无效元数据键和未明确的默认值。

新增或修改组件时，应同步补充完整示例和元数据，并确认 Attributes、Events、Slots、Exposes、Types 只展示实际存在的内容。桌面端 API 使用可扫描表格，移动端自动切换为带字段标签的卡片；两种布局都必须在 light、dark 主题下检查。


### ConfigProvider 全局配置

```vue
<script setup lang="ts">
import { ZtConfigProvider } from '@ztechjs/zt-ui'
import '@ztechjs/zt-ui/style.css'
</script>

<template>
  <ZtConfigProvider size="large" theme="dark" :border-radius="6">
    <RouterView />
  </ZtConfigProvider>
</template>
```

`size` 支持五档尺寸；`theme` 支持 `light` / `dark`；`borderRadius` 为非负像素数，默认 11，0 为直角。组件显式尺寸优先，其次为表单/组合配置，再使用最近的 Provider。嵌套 Provider 仅覆盖已设置的参数，支持动态更新；浮层继承配色和圆角。圆形与胶囊控件保留形状，Drawer 的 size 控制密度，width / height 控制几何尺寸，Icon 的尺寸与 Alert 的固定密度不绑定全局 size。Provider 渲染 div 容器，可通过 class / style 配置布局。示例与完整 API 位于文档站 `/config-provider`。

### Slider / Progress

`ZtSlider` 支持单值和 `[起点, 终点]` 范围选择、小数步长、禁用、六种状态颜色、五档尺寸和数值提示。拖动时触发 `update:modelValue` / `input`，松开后触发 `change`；支持方向键、Home / End 和 PageUp / PageDown。接入 FormItem 时继承尺寸与禁用，并触发 change 校验。

`ZtProgress` 通过 `percentage` 展示 0–100 的完成率，支持 `status`、`size`、`format` 和默认插槽。无法确定进度时使用 `indeterminate`，不会报告虚假的百分比，并遵循系统减少动画偏好。两者都继承 ConfigProvider，示例与 API 位于 `/slider`、`/progress`。

### Menu

`ZtMenu` 为纵向导航菜单，使用 `items` 配置叶子项、分组和多级子菜单，`v-model` 管理当前选择，`v-model:expanded-keys` 管理展开状态。支持 `accordion`、禁用、图标、辅助说明、链接及完整键盘导航，并继承 ConfigProvider 的尺寸、主题和圆角。设置 `router` 可接入应用已安装的 Vue Router：默认用 key 作为路径，也支持 item.route 字符串或命名路由对象；高亮跟随实际路由，导航失败不会误切换。未开启时不需要路由依赖。文档站侧栏已使用该组件，示例与完整 API 位于 `/menu`。

Menu 还支持 `v-model:collapsed` 整栏折叠、`collapsible` 底部按钮、`v-model:width` 动态宽度以及 `resizable` 边缘拖动（含键盘调整，受 minWidth / maxWidth 限制）。`mode="double"` 提供左侧业务模块与右侧分组导航两栏布局，使用 `v-model:active-key` 管理当前模块，叶子选择仍由 modelValue 管理。折叠后点击模块浮出子菜单，选中叶子项、点击外部或按 Escape 后关闭，主栏保持折叠；collapsedWidth 和 railWidth 分别控制折叠宽度与模块栏宽度。

`mode="horizontal"` 提供横向菜单与多级浮层，`menu-trigger="hover | click"` 控制触发方式，默认 hover；支持方向键、Escape、外部点击关闭和窄屏横向滚动。横向模式忽略 collapsed、collapsible、width 和 resizable。完整示例位于 `/menu` 的“横向导航”和“路由模式”。

### InputOtp

`ZtInputOtp` 提供验证码分格输入，支持字符串 `v-model`、自定义 `length`、整段粘贴、`integerOnly`、`mask`、`separator`、六种主题颜色及五档尺寸。默认 `autocomplete="one-time-code"`，输入填满时触发 `complete`。提供 focus(index)、blur()、clear() 方法，继承 ConfigProvider 和 Form；示例与 API 位于 `/input-otp`。

### Upload

`ZtUpload` 支持 `v-model:file-list`、文件选择/拖拽、多选、图片预览、类型/大小/数量限制、异步校验和删除钩子。配置 `action` 后通过 multipart/form-data 上传；也可将已封装并返回 Promise 的 Axios 接口方法直接传给 `request`，继续复用项目的认证和统一拦截器；需要完全接管底层上传时使用 `httpRequest`。提供 submit、abort、retry、remove、clearFiles、open；支持进度、取消、失败重试及 Form / ConfigProvider。`/upload` 的交互示例使用本地模拟，不发送文件。

### Icon

`ZtIcon` 提供常用内置 SVG 图标，并支持自定义 Vue 组件和默认插槽。`size` 为独立的 `number | string`：正数按 px 处理，字符串使用 CSS 长度（如 `24px`、`1.5em`、`50%`），默认 `1em`；不读取 ConfigProvider 的全局 size，也不提供预设密度值。支持六种状态色、旋转、加载旋转和无障碍标签；具名图标组件可按需导入。完整图标列表与 API 位于 `/icon`。

### Link / Text

`ZtLink` 提供安全的原生链接和可选 Vue Router 导航，支持前后图标、下划线策略、禁用、五档尺寸和六种状态色。`ZtText` 提供安全语义标签、字号、字重、状态色、单行截断和多行 `lineClamp`。示例与 API 位于 `/link`、`/text`。

### Scrollbar

`ZtScrollbar` 使用真实原生滚动容器，并绘制统一的横向和纵向滑块。支持固定/最大高度、常显轨道、系统滚动条模式、ResizeObserver 自动更新，以及 scrollTo、setScrollTop、setScrollLeft、update 方法。完整示例位于 `/scrollbar`。

### Popover / Popconfirm

`ZtPopover` 支持 click、hover、focus、manual 触发，自动翻转和限制在视口内，并正确处理外部点击、Escape 与父级弹层焦点。`ZtPopconfirm` 在其上提供状态图标、说明、确认/取消及异步 beforeConfirm。示例位于 `/popover`、`/popconfirm`。

### 导航、展示与媒体组件

`ZtTabs`、`ZtBreadcrumb` 和 `ZtSegmented` 提供标签切换、层级导航与分段选择，均支持键盘操作和全局尺寸。`ZtDescriptions`、`ZtCollapse`、`ZtResult` 用于详情、分组内容和任务结果。`ZtImage` 内置加载与错误后备及全屏预览，`ZtAvatar` 支持图片、插槽、图标和文字首字后备。完整示例与 API 已收录在文档站对应页面。

### 示例维护与一致性校验

全部组件的可运行示例均拆为独立 Vue 文件。文档页同时导入该文件作为演示组件，并通过 `?raw` 导入同一文件展示源码；修改示例时只修改这份文件，不另写展示代码。示例包含实际使用的状态、事件、数据和局部样式，并继承站点顶部的全局外观配置。复制到业务项目时，需安装组件库并按快速开始引入样式。

在 `site/` 执行 `npm run docs:examples` 可检查演示与源码是否同源、编译是否有效、是否依赖站点私有路径，并更新[完整组件示例盘点](docs/component-examples-audit.md)。该检查已接入测试与构建。需要业务 Axios 实例的接入代码明确标为不可在本站执行，不伪装成可运行示例；Menu 路由示例在源码中注明路由配置要求。


## Underline forms

Enable `<ZtForm underline>` to use a bottom border for Input, Password, InputNumber, InputTag, InputOtp, Select, SelectBox, Autocomplete, Cascader, TreeSelect, DatePicker, DateTimePicker, TimePicker, TimeSelect and Mention. Focus, validation colors, disabled states, density and theme remain available. Select and InputTag use compact borderless tags with a soft theme background; SelectBox keeps its single-line comma summary. Popup search and pagination controls retain their own surfaces.

Button, Upload, Rate, Switch, Slider, Segmented, Radio, Checkbox, Transfer and ColorPicker retain their original appearance. A nested Form starts its own appearance boundary. See the [live Form examples](https://stevqin.github.io/zt-ui/#/form).
