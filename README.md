# Zt UI

基于 **Vue 3 + TypeScript** 的轻量级企业级组件库，采用玻璃拟态（Glass-inspired）视觉风格，提供约 80 个开箱即用的业务组件。

- **包名**：`@ztechjs/zt-ui`
- **技术栈**：Vue 3 Composition API · TypeScript · SCSS · Vite
- **文档站**：[https://stevqin.github.io/zt-ui/](https://stevqin.github.io/zt-ui/)
- **仓库**：[https://github.com/stevqin/zt-ui](https://github.com/stevqin/zt-ui)

---

## 特性

| 能力 | 说明 |
| --- | --- |
| 完整 TypeScript | 导出 Props / Emits / Slots / Expose 类型定义，编辑器可直接补全 |
| 双格式构建 | 同时提供 ESM 与 UMD 产物，支持打包器与 CDN 引入 |
| 统一设计令牌 | 尺寸、主题、圆角、语义色由 CSS 变量统一管理，可全局覆盖 |
| 无障碍与动效 | 键盘导航、焦点管理、ARIA 标注，并遵循系统「减少动画」偏好 |
| 表单联动 | Form 统一调度尺寸、禁用、下划线外观与校验触发 |
| 浮层体系 | Modal / Drawer / Popover / Tooltip 等共享层叠、焦点陷阱与滚动锁定 |
| 虚拟渲染 | Select、Tree 支持虚拟列表；VTableGrid 适合大数据量表格 |
| 可运行文档 | 文档站提供可复制的 Vue + TypeScript 示例与完整 API |

---

## 快速开始

### 安装

```bash
npm install @ztechjs/zt-ui
```

如需使用高性能表格 `ZtVTableGrid`，请额外安装 VisActor 同行依赖：

```bash
npm install @visactor/vtable @visactor/vue-vtable @visactor/vtable-editors
```

### 引入样式与组件

在应用入口引入一次样式：

```ts
import '@ztechjs/zt-ui/style.css'
```

按需导入组件：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtButton, ZtModal } from '@ztechjs/zt-ui'

const visible = ref(false)
</script>

<template>
  <ZtButton status="primary" @click="visible = true">
    打开弹窗
  </ZtButton>

  <ZtModal v-model="visible" title="工作台">
    弹窗内容
  </ZtModal>
</template>
```

### 全局配置（推荐）

用 `ZtConfigProvider` 统一下发尺寸、主题和圆角：

```vue
<script setup lang="ts">
import { ZtConfigProvider } from '@ztechjs/zt-ui'
import '@ztechjs/zt-ui/style.css'
</script>

<template>
  <ZtConfigProvider size="default" theme="light" :border-radius="11">
    <RouterView />
  </ZtConfigProvider>
</template>
```

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `mini \| small \| default \| medium \| large` | `default` | 后代组件默认密度 |
| `theme` | `light \| dark` | `light` | 配色方案 |
| `borderRadius` | `number` | `11` | 基础圆角（px），`0` 为直角 |

优先级：组件显式 `size` → Form / 组合配置 → 最近的 ConfigProvider。嵌套 Provider 只覆盖已设置的字段；浮层会继承配色与圆角。

---

## 设计体系

### 尺寸（Size）

所有密度感知组件共享类型 `ZtComponentSize`：

```ts
type ZtComponentSize = 'mini' | 'small' | 'default' | 'medium' | 'large'
```

适用组件：Button、Tag、Radio、Checkbox、Switch、Input、Password、InputNumber、Select、SelectBox、Form、Badge、Steps、Pagination、Modal、Drawer、VTableGrid 等。

- `RadioGroup` / `CheckboxGroup` 会把选中的尺寸传给子项
- `Form` 会把尺寸传给已注册的输入控件
- `Drawer` 的 `size` 控制密度，`width` / `height` 控制几何尺寸（默认 420px）
- `Icon` 使用独立的 `number | string` 尺寸（默认 `1em`），不读取全局 size

### 状态色（Status）

通用视觉主题共六种：

```ts
type ZtButtonStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
```

注意区分：

- **`danger`** 是视觉主题色
- **`error`** 是表单校验失败状态

同一表面上，FormItem 校验错误优先于装饰颜色。

### 下划线表单（Underline）

`<ZtForm underline>` 可将表单控件切换为底边框风格。以下控件支持 `underline?: boolean`：

> ZtInput、ZtPassword、ZtInputNumber、ZtInputTag、ZtInputOtp、ZtSelect、ZtSelectBox、ZtAutocomplete、ZtCascader、ZtTreeSelect、ZtDatePicker、ZtDateTimePicker、ZtTimePicker、ZtTimeSelect、ZtMention

规则：

1. 显式 `:underline="true"` 强制开启
2. 显式 `:underline="false"` 强制普通边框
3. 省略时继承最近 Form 的 `underline`
4. 嵌套 Form 建立独立边界
5. 弹出面板内的辅助控件保持普通边框

Button、Upload、Rate、Switch、Slider、Segmented、Radio、Checkbox、Transfer、ColorPicker **不**使用此表单外观。

### 主题变量

样式令牌定义在 `src/styles/tokens.scss`，可通过 CSS 变量覆盖：

```css
:root {
  --zt-accent: #245edb;
  --zt-radius: 11px;
  --zt-font: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
```

语义色对应 `--zt-accent`（primary）、`--zt-success-*`、`--zt-warning-*`、`--zt-danger-*`、`--zt-info-*`。

### 外观与文档约定

以下 15 个控件公开 `underline?: boolean`：`ZtInput`、`ZtPassword`、`ZtInputNumber`、`ZtInputTag`、`ZtInputOtp`、`ZtSelect`、`ZtSelectBox`、`ZtAutocomplete`、`ZtCascader`、`ZtTreeSelect`、`ZtDatePicker`、`ZtDateTimePicker`、`ZtTimePicker`、`ZtTimeSelect`、`ZtMention`。**显式** `:underline="true"` 启用下边框，`:underline="false"` 强制普通边框，**省略**时继承**最近 Form**。**嵌套 Form** 建立独立边界；控件内部及弹出面板中的**辅助控件**保持普通边框。Button、Upload、Rate、Switch、Slider、Segmented、Radio、Checkbox、Transfer、**ColorPicker** 不使用此表单外观。

视觉主题 `danger` 与校验状态 `error` 含义不同；FormItem 校验错误优先于同一表面的装饰颜色。Select / SelectBox / InputTag 在 disabled 或 readonly 时隐藏标签移除与清空图标（与 InputTag 的 editable 规则一致）。

Button 的深度由 ConfigProvider 圆角基准决定：**小于 5px** 使用纯色与边框，无深度渐变或外阴影；**5–8px**（含两个端点）使用轻微内高光和低透明度的一像素阴影；**大于 8px** 使用克制的渐变与更明显的按压层次。适用于全部五档尺寸与六种视觉主题；**禁用**和加载减少强调，键盘焦点仍清晰，减少动画偏好会关闭位移。

Tooltip 的 `width` / `height` 接受数字（**px**）和字符串（**CSS** 长度）。省略时按内容大小展示，宽度为 **max-content** 并受**视口**最大宽度约束，短文本紧凑、长文本换行。显式 **width** / **height** 固定外框尺寸，超过**视口**时受边界约束；指定高度后只有**内容区**滚动，箭头保持固定。Popover 提供相同的长度换算和 height 能力。

SelectBox 默认向下展开，下方不足且上方空间更多时**向上翻转**；滚动、窗口尺寸、分页与远程结果变化都会重新测量。搜索、摘要、分页和确认区域固定，**选项列表是唯一**纵向滚动区域，面板本身不滚动。**加载**、**空**列表、请求**失败**、批量**粘贴**和仅看**已选**模式遵循同一约束。若**视口**高度小于**固定区域**所需高度，则约束并**裁剪**面板。

文档站为主组件支持**六种视觉主题**的页面显示统一状态控制器。**Button** 和 **Tag** 保留完整颜色矩阵；**Steps** 和 **Result** 使用业务状态，不显示该控制器。桌面右侧面板显示**三列两行**色块与文字；小屏显示**右下角**胶囊，点击打开底部面板。选择**跨页**保存；复制源码使用普通 **status** 绑定，可**复制**到业务项目直接运行。

---

## 组件总览

文档站收录 **79 个组件页、339 个可执行示例**，并附完整 API 与类型定义。

### 基础 · Foundation

ConfigProvider、Icon、Text、Link、Button、Typography

### 布局 · Layout

Layout、Row、Col、Space、Divider、Splitter、Scrollbar、Affix

### 表单 · Form

Form、Input、Password、InputNumber、InputOtp、Radio、Checkbox、Switch、Select、SelectBox、Segmented、Slider、DatePicker、DateTimePicker、DatePickerPanel、TimePicker、TimeSelect、ColorPicker、ColorPickerPanel、Upload、Autocomplete、InputTag、Mention、Rate、Cascader、TreeSelect、Transfer

### 数据展示 · Data Display

Table、VTableGrid、Tree、Pagination、Card、Empty、Statistic、Timeline、Calendar、Descriptions、Collapse、InfiniteScroll

### 导航 · Navigation

Menu、Tabs、Breadcrumb、Steps、Dropdown、Anchor、Backtop、PageHeader

### 反馈 · Feedback

Tag、Badge、Progress、Result、Skeleton、Alert、Loading

### 浮层 · Overlay

Modal、Drawer、Popover、Popconfirm、Tooltip、Tour

### 媒体 · Media

Image、Avatar、Carousel、Watermark、QRCode

---

## 核心组件速览

### Button

```vue
<script setup lang="ts">
import { ZtButton } from '@ztechjs/zt-ui'
</script>

<template>
  <ZtButton status="primary">主要</ZtButton>
  <ZtButton status="success" plain>成功</ZtButton>
  <ZtButton status="danger" dashed>危险</ZtButton>
  <ZtButton text>文字按钮</ZtButton>
  <ZtButton loading>加载中</ZtButton>
</template>
```

支持 `status`（六色）、`size`（五档）、`plain` / `dashed` / `text` 变体、`circle`、`loading`、`disabled`、自定义 `color`。

按钮深度由 ConfigProvider 圆角决定：`< 5px` 纯色扁平，`5–8px` 轻微内高光，`> 8px` 克制渐变与按压层次。

### Form 表单校验

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { ZtFormInstance, ZtFormRules } from '@ztechjs/zt-ui'
import { ZtButton, ZtForm, ZtFormItem, ZtInput } from '@ztechjs/zt-ui'

const formRef = ref<ZtFormInstance>()
const account = ref({ email: '' })
const rules: ZtFormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
}
</script>

<template>
  <ZtForm ref="formRef" :model="account" :rules="rules" label-width="88px">
    <ZtFormItem label="邮箱" prop="email">
      <ZtInput v-model="account.email" clearable />
    </ZtFormItem>
    <ZtFormItem>
      <ZtButton status="primary" @click="formRef?.validate()">提交</ZtButton>
    </ZtFormItem>
  </ZtForm>
</template>
```

规则类型支持 `required`、`min` / `max` / `len`、`pattern`、`type`（`string` / `number` / `email` / `url`）、`whitespace` 以及异步 `validator`。实例方法：`validate`、`validateField`、`resetFields`、`clearValidate`、`scrollToField`。

### Input 系列

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtInput, ZtInputNumber, ZtPassword } from '@ztechjs/zt-ui'

const keyword = ref('')
const password = ref('')
const quantity = ref<number | null>(1)
</script>

<template>
  <ZtInput v-model="keyword" clearable placeholder="搜索" />
  <ZtPassword v-model="password" autocomplete="current-password" />
  <ZtInputNumber v-model="quantity" :min="1" :max="99" />
</template>
```

### Select 选择器

支持单选 / 多选、本地过滤、远程搜索、自定义插槽与虚拟列表：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtSelect, type ZtSelectOption } from '@ztechjs/zt-ui'

const city = ref<string | null>(null)
const cityOptions: ZtSelectOption[] = [
  { label: '杭州', value: 'hangzhou' },
  { label: '上海', value: 'shanghai' },
]
</script>

<template>
  <ZtSelect
    v-model="city"
    :options="cityOptions"
    clearable
    placeholder="选择城市"
  />
</template>
```

远程搜索：

```ts
import type { ZtSelectOption } from '@ztechjs/zt-ui'

const searchUsers = async (keyword: string): Promise<ZtSelectOption[]> => {
  const response = await fetch(`/api/users?keyword=${encodeURIComponent(keyword)}`)
  return response.json()
}
```

筛选关键词在选中、关闭或失焦后仍会保留；清空控件会同时重置值与关键词。

### SelectBox 多选筛选框

`ZtSelectBox` 是带「草稿确认」的多选筛选组件：面板内改动不会立即提交，点击确定才写入 `modelValue`。支持本地过滤分页、远程搜索、批量粘贴匹配、一键清空。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  ZtSelectBox,
  type ZtSelectBoxRemoteRequest,
  type ZtSelectBoxRemoteResult,
} from '@ztechjs/zt-ui'

const selected = ref<string[]>([])
const pageSize = ref(20)

async function loadOptions(
  request: ZtSelectBoxRemoteRequest,
): Promise<ZtSelectBoxRemoteResult> {
  const response = await fetch('/api/regions/select-options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!response.ok) throw new Error('加载失败')
  return response.json()
}
</script>

<template>
  <ZtSelectBox
    v-model="selected"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50]"
    width="100%"
    remote
    :remote-method="loadOptions"
    clearable
  />
</template>
```

远程协议：

| 请求 | 载荷 | 响应 |
| --- | --- | --- |
| 分页搜索 | `{ mode: 'search', keyword, page, pageSize }` | `{ mode: 'search', options, total }` |
| 批量匹配 | `{ mode: 'batch', keywords }` | `{ mode: 'batch', matches }` |

批量匹配返回全量精确命中（含当前页以外记录）；部分命中会提交有效选择并通过 zt-alert 汇报数量。

### DatePicker / DateTimePicker

日期值为本地 `YYYY-MM-DD`，日期时间为 `YYYY-MM-DD HH:mm:ss`，不做时区转换。范围值为 `[开始, 结束]`，清空返回 `null`。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtDatePicker, ZtDateTimePicker } from '@ztechjs/zt-ui'
import type { ZtDatePickerValue } from '@ztechjs/zt-ui'

const date = ref<ZtDatePickerValue>(null)
const dateRange = ref<ZtDatePickerValue>(null)
const datetime = ref<ZtDatePickerValue>(null)
</script>

<template>
  <ZtDatePicker v-model="date" clearable />
  <ZtDatePicker v-model="dateRange" range clearable />
  <ZtDateTimePicker v-model="datetime" clearable />
</template>
```

要点：

- 日期选择完成即提交；日期时间需点「确定」后提交，Esc / 取消 / 点击外部丢弃草稿
- `range` 模式使用双日历面板，支持跨面板选择与区间高亮
- 节假日由业务传入，不内置年度节假日表：

```vue
<ZtDatePicker
  v-model="date"
  :holidays="[
    { key: '2026-01-01', value: '元旦' },
    { key: '2026-01-15', value: '公司纪念日', type: 'workday' },
  ]"
  :show-holidays="true"
/>
```

- `disabledDate` 限制起止端点，区间内部允许包含禁用日期
- 实例方法：`focus` / `blur` / `open` / `close` / `clear`

### Modal / Drawer

共享滚动锁定、Escape 关闭、焦点陷阱与恢复、异步关闭守卫、加载态、插槽与嵌套堆叠。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtDrawer, ZtModal } from '@ztechjs/zt-ui'

const modalVisible = ref(false)
const drawerVisible = ref(false)
const fullscreen = ref(false)
</script>

<template>
  <ZtModal
    v-model="modalVisible"
    v-model:fullscreen="fullscreen"
    title="工作台"
    show-fullscreen-button
    draggable
  >
    内容
  </ZtModal>

  <ZtDrawer v-model="drawerVisible" title="筛选" placement="right" :width="420">
    内容
  </ZtDrawer>
</template>
```

- Modal 额外支持内置全屏按钮与视口边界内的标题拖拽
- Drawer 支持上下左右四边；`width` 控制左右面板，`height` 控制上下面板

### Menu 导航菜单

支持纵向树形、双栏模块导航、横向导航三种模式，可接入 Vue Router：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtMenu, type ZtMenuItem } from '@ztechjs/zt-ui'

const current = ref('overview')
const items: ZtMenuItem[] = [
  {
    key: 'dashboard',
    label: '工作台',
    children: [
      { key: 'overview', label: '总览' },
      { key: 'reports', label: '报表' },
    ],
  },
]
</script>

<template>
  <ZtMenu v-model="current" :items="items" mode="vertical" />
</template>
```

其他能力：`accordion` 手风琴、`v-model:collapsed` 折叠、`v-model:width` + `resizable` 拖拽调宽、`mode="double"` 双栏、`mode="horizontal"` 横向浮层、`router` 路由联动。

### Pagination / Steps

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtPagination, ZtStep, ZtSteps } from '@ztechjs/zt-ui'

const currentPage = ref(1)
const pageSize = ref(20)
</script>

<template>
  <ZtSteps :active="1" finish-status="success" align-center>
    <ZtStep title="创建订单" description="填写订单信息" />
    <ZtStep title="审核" description="确认库存" />
    <ZtStep title="完成" description="安排发货" />
  </ZtSteps>

  <ZtPagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="400"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next, jumper"
    status="primary"
  />
</template>
```

### VTableGrid 高性能表格

基于 VisActor VTable 封装，支持本地 / 远程数据、分页、排序、按 key 选择、行操作、单元格编辑、汇总、列设置与 CSV 导出：

```vue
<script setup lang="ts">
import { ZtVTableGrid, type ZtVTableGridColumn } from '@ztechjs/zt-ui'

type Product = { id: number; name: string; price: number; stock: number }

const columns: ZtVTableGridColumn<Product>[] = [
  { field: 'name', title: '商品', width: 180, sort: true },
  { field: 'price', title: '单价', editable: 'number', summary: 'avg' },
  { field: 'stock', title: '库存', editable: 'number', summary: 'sum' },
]

const records: Product[] = [
  { id: 1, name: '云感针织衫', price: 399, stock: 42 },
]
</script>

<template>
  <ZtVTableGrid
    :columns="columns"
    :records="records"
    editable
    checkbox
    :summary="{ label: '合计' }"
    :toolbar="['export', 'columnsetting', 'reload']"
  />
</template>
```

中等数据量场景也可使用原生 DOM 的 `ZtTable`（列定义、排序、选择、展开行、固定表头 / 列）。

### Icon

`ZtIcon` 提供常用内置 SVG 图标，并支持自定义 Vue 组件和默认插槽。`size` 为独立的 **number | string**：正数按 **px** 处理，字符串使用 **CSS** 长度（如 `24px`、`1.5em`、`50%`），默认 **1em**；**不读取 ConfigProvider** 的全局 size，也不提供预设密度值。支持六种状态色、旋转、加载旋转和无障碍标签。

### 其他常用组件

| 组件 | 说明 |
| --- | --- |
| `ZtInputOtp` | 验证码分格输入，支持整段粘贴、`mask`、`separator`、`complete` 事件 |
| `ZtUpload` | 文件选择 / 拖拽上传，支持 `action`、自定义 `request` / `httpRequest`、进度与重试 |
| `ZtIcon` | 内置 SVG 图标 + 自定义组件 / 插槽，`size` 为独立 CSS 长度 |
| `ZtSlider` / `ZtProgress` | 单值 / 范围滑块与进度条，支持六色与五档尺寸 |
| `ZtTree` / `ZtTreeSelect` | 树形选择，父子联动、懒加载、过滤、虚拟列表 |
| `ZtCascader` | 多级级联选择，支持多选、搜索、懒加载 |
| `ZtTransfer` | 穿梭框，搜索、全选 / 半选、自定义标签 |
| `ZtColorPicker` | 自定义色盘，HEX / RGB / HSL、透明度、预设色 |
| `ZtScrollbar` | 真实原生滚动 + 统一滑块绘制 |
| `ZtTooltip` / `ZtPopover` | 浮层提示与气泡卡片，自动翻转、视口约束 |
| `ZtImage` / `ZtAvatar` | 图片加载 / 错误后备与全屏预览；头像多形态后备 |
| `ZtQRCode` / `ZtWatermark` | 二维码生成与水印铺底 |

完整 API 与示例请见 [文档站](https://stevqin.github.io/zt-ui/)。

---

## 命令式反馈（@ztechjs/zt-alert）

命令式 `Message`、`Notification`、`MessageBox` 与全屏 `Loading` 位于独立包 [`@ztechjs/zt-alert`](https://www.npmjs.com/package/@ztechjs/zt-alert)，**zt-ui 不再二次导出**：

```bash
npm install @ztechjs/zt-alert
```

```ts
import { ZtMessage, ZtLoading as ZtFullscreenLoading } from '@ztechjs/zt-alert'
import '@ztechjs/zt-alert/style.css'

ZtMessage.success('筛选已应用')
const loading = ZtFullscreenLoading.open({ text: '加载中…' })
await loading.close()
```

声明式组件仍保留在 zt-ui 内：

| 来源 | 组件 |
| --- | --- |
| `@ztechjs/zt-ui` | `ZtLoading`、`ZtAlert`、`ZtModal`、`ZtDrawer` |
| `@ztechjs/zt-alert` | `ZtMessage`、`ZtNotification`、`ZtMessageBox`、全屏 `ZtLoading` |

使用 zt-alert 的应用需额外引入其样式；zt-ui 样式已包含 SelectBox 批量反馈所需样式。边界说明见文档站 [Feedback 指南](https://stevqin.github.io/zt-ui/#/feedback)。

---

## 包结构

```
@ztechjs/zt-ui
├── dist/
│   ├── zt-ui.js          # ESM
│   ├── zt-ui.umd.cjs     # UMD（全局名 ZtUI）
│   ├── zt-ui.css         # 样式（也可 import '@ztechjs/zt-ui/style.css'）
│   └── index.d.ts        # 类型声明
└── README.md
```

| 入口 | 说明 |
| --- | --- |
| `@ztechjs/zt-ui` | 组件与类型 |
| `@ztechjs/zt-ui/style.css` | 全部组件样式 |

`vue` 与 VisActor 系列为 **peerDependencies**，由业务项目自行安装。

---

## 开发

```bash
# 安装依赖
npm install

# 单元测试（Vitest + happy-dom）
npm test

# 类型检查
npm run typecheck

# 构建 ESM + UMD + d.ts
npm run build

# 组件契约审计
npm run audit:components
```

### 本地调试文档站

```bash
cd site
npm install
npm run dev
```

文档站脚本：

| 命令 | 作用 |
| --- | --- |
| `npm run docs:api` | 从源码生成 `site/src/docs/api.generated.json` |
| `npm run docs:examples` | 校验示例与源码同源，并更新示例盘点 |
| `npm test` / `npm run build` | 会先执行 API 同步与示例审计 |

`site/src/docs/catalog.ts` 是组件分组、状态、路线图与场景关联的单一数据源。组件详情路由为 `/:component`，API 锚点 `/:component#api`，类型定义 `/:component#types`。

新增或修改组件时，请同步补充：

1. 可运行示例（独立 Vue 文件，文档页通过 `?raw` 同源展示源码）
2. API 元数据（`site/scripts/api/metadata/`）
3. 测试覆盖
4. 确认 Attributes / Events / Slots / Exposes / Types 只展示实际存在的内容

---

## 浏览器支持

现代浏览器（支持 ES2020+ 与 CSS 自定义属性）。推荐 Chrome / Edge / Safari / Firefox 最近两个大版本。

---

## 许可证

[MIT](./LICENSE) © ztech
