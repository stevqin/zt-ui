# Form 下边框外观与尺寸语义设计

日期：2026-09-18

## 背景

zt-ui 当前有三类尺寸语义混在同一个 `size` 名称中：

- ConfigProvider 的五档组件密度；
- Drawer 面板的物理宽度或高度；
- Icon 的图形尺寸。

Drawer 的 `size` 目前表示面板宽高，无法像 Modal 一样继承全局密度；Icon 和 ZtAlert 又把全局五档尺寸用于本应独立的视觉尺寸。与此同时，Form 只有完整边框控件，缺少适合查询区、紧凑资料页和表格式录入的下边框外观。

本次调整重新划分这些语义，并为 Form 增加可控、可隔离的下边框模式。zt-ui 仍是一套全新组件库，不保留旧 API 或旧 CSS 类兼容层。

## 目标

1. Drawer 的物理尺寸使用 `width` / `height`，`size` 回归五档组件密度。
2. Drawer 和 Modal 的密度同时控制自身结构和未显式指定尺寸的后代控件。
3. Icon 使用独立 CSS 尺寸，不读取 ConfigProvider。
4. ZtAlert 使用固定默认尺寸，不读取 ConfigProvider，也不公开 `size`。
5. Form 通过易记的 `underline` 布尔属性提供下边框外观。
6. 下边框外观只影响明确支持的表单主控件，不泄漏到弹层、搜索框、分页器或复合组件的内部控件。
7. Select 与 SelectBox 多选在下边框模式下使用经过确认的轻柔底色标签。
8. zt-ui 的 Drawer 与 Modal 完全由自身 overlay 实现；不再为 `@ztechjs/zt-alert` 的 Drawer/Dialog 提供专用适配或文档入口。

## 非目标

- 不为所有组件增加通用 `underline` prop。
- 不改变弹出面板、日历面板、下拉搜索框、分页控件或批量粘贴面板的外观。
- 不让 Button、Upload、Rate、Switch、Slider、Segmented 等非文本录入控件显示下边框。
- 不保留 Drawer 原有“`size` 表示宽高”、Icon 五档尺寸或 Alert 五档尺寸的兼容行为。
- 不代理或重新导出 `@ztechjs/zt-alert` 的 Drawer、Dialog、Modal API。

## 公共 API

### ZtDrawer

```ts
export interface ZtDrawerProps extends ZtOverlayCommonProps {
  modelValue?: boolean
  placement?: 'left' | 'right' | 'top' | 'bottom'
  width?: number | string
  height?: number | string
  size?: ZtComponentSize
  // 其余现有属性保持不变
}
```

- `width` 只用于 `left` / `right`，默认 `420`。
- `height` 只用于 `top` / `bottom`，默认 `420`。
- 数字按 px 转换；字符串作为 CSS 长度使用。
- `size` 只表示 `mini | small | default | medium | large` 密度，并通过 ConfigProvider 继承。
- 同时传入 `width` 与 `height` 时，根据 placement 只读取对应轴属性。
- 删除物理尺寸回退到旧 `size` 的逻辑。

### ZtIcon

```ts
export interface ZtIconProps {
  size?: number | string
  // 其余现有属性保持不变
}
```

- 正有限数字转换为 px。
- 非空字符串直接作为 CSS 尺寸，例如 `18px`、`1.2em`、`50%`。
- 未传时使用 `1em`。
- 不读取 ConfigProvider，不生成五档尺寸类。
- 无效数字或空字符串回退到 `1em`。

### ZtAlert

- 删除 `size` prop 和 `ZtComponentSize` 类型依赖。
- 删除 `useZtSize` 与五档尺寸类。
- 使用一套固定的默认字号、内边距和图标尺寸。
- theme、radius、status、closable、showIcon 等现有能力保持不变。

### ZtForm

```ts
export interface ZtFormProps {
  underline?: boolean
  // 其余现有属性保持不变
}
```

- 默认 `false`。
- 最近一层 Form 的值生效，嵌套 Form 可重新开启或关闭。
- 该属性只通过 Form context 传递，不为各子组件增加公共 `underline` prop。

## Form 下边框模式

### 支持组件

- ZtInput
- ZtPassword
- ZtInputNumber
- ZtInputTag
- ZtInputOtp
- ZtSelect
- ZtSelectBox
- ZtAutocomplete
- ZtCascader
- ZtTreeSelect
- ZtDatePicker
- ZtDateTimePicker
- ZtTimePicker
- ZtTimeSelect
- ZtMention

### 明确不支持

- ZtButton
- ZtUpload
- ZtRate
- ZtSwitch
- ZtSlider
- ZtSegmented
- ZtRadio / ZtRadioGroup
- ZtCheckbox / ZtCheckboxGroup
- ZtTransfer
- ZtColorPicker
- 其他纯展示、布局或操作组件

不支持的组件忽略 Form 的 `underline`，不添加空类名或数据属性，也不改变当前样式。

### 外观规则

- 主控件移除上、左、右边框、外围圆角和实体背景，只保留底边。
- 默认底边为 1px；聚焦或打开时显示 2px 主题色。实现必须预留空间，不能引起控件高度跳动。
- error、success 使用现有 FormItem 语义色；disabled 降低对比度并使用虚线底边。
- mini、small、default、medium、large 保持现有高度、字号与纵向间距规律。
- 多选和标签类控件可随内容增高，底边位于完整控件底部。
- Mention 保留多行与 resize 能力。
- InputOtp 的每个输入格分别使用下边框，不绘制完整方框。
- hover、focus-visible、clear、删除动画和可访问状态继续工作。

### 多选标签

Select 与 SelectBox 在 underline 模式中采用“轻柔底色”方案：

- 使用低饱和主题色背景；
- 不绘制标签边框；
- 使用紧凑圆角和当前尺寸对应的内边距；
- 深色主题使用透明主题色背景和清晰文字色；
- 保留删除按钮动画、单行省略、首标签收缩和 `+N` 折叠；
- 不改变普通 outlined 模式的标签样式。

## 外观边界与内部结构

每个支持 underline 的公共控件都是一个外观边界：

1. 控件读取最近 Form 的 underline 状态。
2. 控件只给自己的公共根节点添加内部 underline 状态。
3. 控件向 Vue 后代提供“已进入公共控件边界”的内部标记。
4. 后代中的辅助控件默认不再次读取 Form underline。
5. 复合组件由公共根节点负责定向修改其可见输入区域。

该边界确保以下内部控件保持 outlined：

- Select / SelectBox 下拉搜索框；
- SelectBox 的 page-size Select、分隔符 Select、批量粘贴 textarea；
- DatePicker / DateTimePicker 日历面板内的输入和按钮；
- Cascader / TreeSelect 弹层搜索框；
- Autocomplete、TimePicker 等弹层内容。

同一个 FormItem 中并列的多个公共控件彼此不是后代，均可独立获得 underline。

## Overlay 密度继承

Drawer 与 Modal 使用同一套解析规则：

1. 组件显式 `size` 优先；
2. 否则继承最近 ConfigProvider；
3. 解析值控制 overlay 自身的 header 高度、footer 高度、正文 padding、标题字号和操作区间距；
4. overlay 为插槽和内部操作控件提供一个局部 ConfigProvider 尺寸作用域；
5. 后代组件显式 size 仍覆盖 overlay 作用域。

Drawer 的 width / height 与密度完全独立。改变全局 size 不会改变面板宽高，改变 width / height 也不会改变内部控件密度。

## zt-alert 边界

`@ztechjs/zt-alert` 继续负责：

- Message
- Notification
- MessageBox
- 全屏 Loading

zt-ui 自身负责声明式：

- ZtAlert
- ZtModal
- ZtDrawer
- 局部 ZtLoading

文档与 README 不再推荐从 `@ztechjs/zt-alert` 使用 Drawer 或 Dialog/Modal。删除 zt-ui 内部针对外部 `.zt-drawer` 的层级发现、portal target、焦点陷阱适配和对应测试。通用 overlay 分支、Modal/Drawer 嵌套和 body teleport 逻辑继续保留。

ESM 仍将 `@ztechjs/zt-alert` 作为运行时外部依赖，以便 SelectBox 消息与应用直接调用共享实例；UMD 继续自包含反馈运行时。

## 文档

- Drawer API 明确区分 width、height、size。
- Icon API 只展示 number 与 CSS length 示例，并说明默认 `1em`。
- Alert 文档删除尺寸示例和 size API。
- Form 新增 underline 页面或完整示例，至少展示：
  - 五档尺寸；
  - 深浅主题；
  - Input、Select 多选、SelectBox、DatePicker、Mention、InputOtp；
  - error、success、disabled；
  - 不适用组件保持原样；
  - 弹层内部控件不被 underline 污染。
- Feedback 指南只列 Message、Notification、MessageBox、全屏 Loading。

## 测试策略

所有行为使用测试先行，保留 RED → GREEN 证据。

### API 与类型

- Drawer 的 width / height 轴向选择、数值 px 转换和 CSS 字符串。
- Drawer size 只接受 ZtComponentSize，并继承 ConfigProvider。
- Icon number、px、em、百分比、默认值和无效值。
- Alert 不再暴露 size。
- Form underline 默认值、嵌套覆盖与 context 类型。

### 视觉状态

- 每个支持组件出现 underline 状态并应用到底层可见控件。
- 每个排除组件保持原 DOM 类和外观。
- 五档尺寸、light/dark、radius、focus、hover、disabled、error、success。
- Select / SelectBox 多选轻柔底色标签、窄宽度、collapse tags、删除动画。
- InputOtp 分格底边、Mention 多行、标签类控件增高。

### 隔离与 overlay

- 下拉搜索、page-size、分隔符、日期面板等内部控件保持 outlined。
- Drawer / Modal 内部后代继承 overlay 密度，显式 size 优先。
- zt-ui Drawer / Modal 的焦点陷阱、嵌套 popup、z-index、resize、scroll 与 teleport 回归。
- 架构搜索确保不再存在外部 `.zt-drawer` 专用适配。

### 集成

- 组件库全量测试、typecheck、ESM / UMD 构建。
- 文档站 API 生成、示例审计、挂载测试、typecheck 和 build。
- 实际浏览器检查支持组件、排除组件、多选标签和 overlay 密度矩阵。
- `git diff --check` 与无陈旧 API/文档检索。

## 风险与控制

- **复合控件内部样式泄漏：**通过公共控件边界标记和弹层回归阻止。
- **Drawer size 语义破坏：**本项目明确不做兼容；文档、生成 API 和类型在同一提交链中更新。
- **底边模式状态不清晰：**聚焦、校验、禁用均有独立视觉规则和自动化检查。
- **overlay 后代尺寸未继承：**使用局部配置作用域，并验证显式后代尺寸优先。
- **删除外部 Drawer 适配影响旧测试：**用 zt-ui 自身 Drawer/Modal 的真实集成测试替代，不保留外部类名分支。
