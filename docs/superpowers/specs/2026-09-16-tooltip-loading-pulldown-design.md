# Tooltip、Loading 与 Pulldown 组件设计

## 目标与范围

为 zt-ui 增加 `ZtTooltip`、`ZtLoading` 和 `ZtPulldown`。Tooltip 与 Pulldown 共用内部浮层定位能力；Loading 是独立 Vue 组件，不提供指令、服务或全屏 API。三个组件不得依赖 Element Plus、VXE、Floating UI 或其他 UI 组件库。

全部组件支持 zt-ui 的 `mini`、`small`、`default`、`medium`、`large` 五档尺寸，导出完整 TypeScript 类型，并在演示站提供可复制的 Vue + TypeScript SFC 示例。

## 内部浮层核心

新增内部 `useFloatingLayer` 组合函数，供 Tooltip 与 Pulldown 使用。它负责：

- 将浮层按配置 Teleport 到 `body`，或留在当前 DOM 层级。
- 使用 `position: fixed` 根据触发器矩形计算位置。
- 支持 `top`、`top-start`、`top-end`、`bottom`、`bottom-start`、`bottom-end`、`left`、`left-start`、`left-end`、`right`、`right-start`、`right-end` 十二种方向。
- 首选方向空间不足时自动翻转；两侧都不足时限制浮层高度，保留至少 8px 视口边距。
- 使用 `ResizeObserver` 观察触发器和浮层尺寸，在窗口 resize、捕获阶段 scroll 和尺寸变化时重新定位。
- 计算箭头偏移，并将最终方向、位置、最大高度和 z-index 暴露给消费组件。
- 注册和注销全局监听器、观察器；关闭或卸载后不保留计时器和事件监听。
- 位于 Modal 或 Drawer 内时，以现有 overlay 分支形式参与层级、Escape、焦点和 Tab 管理。

浮层核心只处理几何与生命周期，不包含 Tooltip 延迟、Pulldown 菜单或具体视觉样式。

## Tooltip

### Props

```ts
type ZtTooltipTrigger = 'hover' | 'focus' | 'click' | 'manual'

interface ZtTooltipProps {
  modelValue?: boolean
  content?: string
  trigger?: ZtTooltipTrigger | ZtTooltipTrigger[]
  placement?: ZtFloatingPlacement
  showAfter?: number
  hideAfter?: number
  offset?: number
  disabled?: boolean
  maxWidth?: number | string
  size?: ZtComponentSize
  teleported?: boolean
}
```

默认值：`modelValue=undefined`、`trigger=['hover', 'focus']`、`placement='top'`、`showAfter=200`、`hideAfter=100`、`offset=8`、`disabled=false`、`teleported=true`、`size='default'`。未传 `modelValue` 时组件内部维护显示状态；传入时作为受控状态，并通过 `update:modelValue` 请求变更。

### Slots、事件与方法

- `default`：唯一触发器内容。
- `content`：覆盖 `content` 属性的提示内容。
- `update:modelValue(boolean)`：显示状态双向绑定。
- `visible-change(boolean)`：实际显示状态改变。
- 暴露 `open()`、`close()` 和 `updatePosition()`。

### 行为

非 manual 模式根据 trigger 组合响应鼠标、焦点或点击。重复的显示或隐藏请求会取消旧计时器；显示延迟未结束前关闭，不产生短暂闪现。鼠标从触发器移动到 Tooltip 浮层不延长交互区域，提示内容本身不可操作。

`disabled=true` 时立即关闭并取消计时器。组件卸载时清理所有计时器、观察器和监听器。

Tooltip 使用 `role="tooltip"`。`default` 插槽要求一个根节点；组件克隆该 VNode，合并事件和 `aria-describedby`，而不是覆盖消费方已有处理。若插槽是纯文本或不可克隆内容，组件使用可聚焦的 inline wrapper，但不附加错误的按钮语义。显示时触发器通过 `aria-describedby` 指向浮层；原有 `aria-describedby` 内容必须保留并合并。

## Pulldown

### 数据与 Props

```ts
type ZtPulldownTrigger = 'click' | 'hover' | 'manual'
type ZtPulldownCommand = string | number | boolean

interface ZtPulldownItem {
  label: string
  command: ZtPulldownCommand
  disabled?: boolean
  divided?: boolean
  danger?: boolean
}

interface ZtPulldownProps {
  modelValue?: boolean
  trigger?: ZtPulldownTrigger
  items?: ZtPulldownItem[]
  placement?: ZtFloatingPlacement
  offset?: number
  disabled?: boolean
  size?: ZtComponentSize
  teleported?: boolean
  closeOnCommand?: boolean
  closeOnClickOutside?: boolean
  closeOnEscape?: boolean
}
```

默认值：`modelValue=undefined`、`trigger='click'`、`items=[]`、`placement='bottom-start'`、`offset=6`、`disabled=false`、`teleported=true`、三个 close 开关均为 `true`、`size='default'`。未传 `modelValue` 时组件内部维护显示状态；传入时作为受控状态。

### Slots、事件与方法

- `default`：触发器内容。
- `dropdown`：完全自定义浮层内容。存在该插槽时替代 items 默认菜单。
- `item`：作用域为 `{ item, index }`，定制默认菜单项内容。
- `empty`：items 为空时的内容。
- `update:modelValue(boolean)`、`visible-change(boolean)`。
- `command(command, item)`：启用的默认菜单项被执行。
- 暴露 `open()`、`close()`、`toggle()`、`focus()` 和 `updatePosition()`。

### 行为

click 模式点击触发器开关浮层；hover 模式在触发器和浮层之间移动时保持打开，并使用短暂关闭延迟避免闪烁；manual 模式只响应 `v-model` 和公开方法。`disabled=true` 时关闭且拒绝重新打开。

`default` 触发器插槽同样要求一个根节点。组件克隆并合并事件、`aria-haspopup="menu"` 和 `aria-expanded`；纯文本内容回退为可聚焦 inline wrapper。`focus()` 优先聚焦触发器自身，其次聚焦内部第一个可聚焦元素。

默认 items 菜单使用 `role="menu"` 和 `role="menuitem"`。打开时聚焦第一个启用项；方向键循环移动，Home/End 跳到首尾启用项，Enter/Space 执行，Escape 关闭并把焦点还给触发器。禁用项不进入键盘导航，也不触发 command。执行后根据 `closeOnCommand` 决定是否关闭。

点击外部和 Escape 分别受对应 close 开关控制。自定义 dropdown 内容保留自身原生键盘行为，Pulldown 只处理 Escape、外部点击和焦点范围。位于 Modal/Drawer 中时注册为 overlay 分支，使 Teleport 内容仍属于父弹层焦点范围；Escape 先关闭 Pulldown，再关闭父层。

## Loading

### Props

```ts
interface ZtLoadingProps {
  loading?: boolean
  text?: string
  size?: ZtComponentSize
  delay?: number
  lock?: boolean
  background?: string
}
```

默认值：`loading=true`、`text=''`、`size='default'`、`delay=0`、`lock=true`。

### Slots 与模式

- `default`：可选的被遮罩内容。
- `spinner`：替换默认加载图形，作用域为 `{ size }`。

没有 default 插槽时为独立模式：`loading=true` 显示 spinner 和 text，`loading=false` 不渲染加载内容。

存在 default 插槽时为遮罩模式：始终渲染内容，`loading=true` 时在同一容器内覆盖半透明遮罩。遮罩保持容器原有尺寸，不改变页面布局；`background` 只控制遮罩背景。`lock=true` 时遮罩拦截指针操作，`lock=false` 时允许与下方内容交互。

`delay` 大于零时延迟显示。延迟结束前切回 false 必须取消显示，避免快速请求闪烁；卸载时清理计时器。

独立模式使用 `role="status"` 和 `aria-live="polite"`。遮罩模式在容器上设置 `aria-busy`，加载文本作为可访问状态；自定义 spinner 不改变状态语义。

## 视觉与尺寸

三个组件沿用 glass tokens。Tooltip 使用深色高对比提示层；Pulldown 使用与 Select 下拉层一致的玻璃卡片、边框和阴影；Loading 使用当前强调色 spinner 和可配置半透明遮罩。

五档尺寸控制字号、内边距、菜单项高度、Tooltip 圆角及 spinner 尺寸。箭头、菜单项和 spinner 动画在 `prefers-reduced-motion: reduce` 下关闭。

## 演示站与文档

增加 `/tooltip`、`/loading`、`/pulldown` 页面和侧边导航，并更新 README 组件列表和基础示例。每个可视示例使用 `DemoBlock :code` 提供完整可复制的 Vue + TypeScript SFC 源码。

Tooltip 页面覆盖基础内容、内容插槽、四类触发方式、十二方向中的代表方向、延迟、禁用和五档尺寸。Loading 页面覆盖独立模式、遮罩模式、延迟防闪烁、自定义 spinner、lock/background 和五档尺寸。Pulldown 页面覆盖 items 菜单、command、禁用/分割线/危险项、自定义 dropdown、三类触发方式、手动控制、键盘操作和五档尺寸。

## 测试与验收

单元和组件测试覆盖：

- 浮层十二方向、自动翻转、视口高度限制、滚动/缩放重定位和清理。
- Tooltip hover/focus/click/manual、延迟竞态、disabled、ARIA 合并和插槽。
- Pulldown items 与自定义 dropdown、command、禁用项、close 开关、键盘导航、外部点击、焦点恢复及 Modal/Drawer 嵌套。
- Loading 独立和遮罩模式、loading 切换、delay 竞态、lock、background、自定义 spinner、ARIA 和计时器清理。
- 三个组件的五档尺寸、公开导出、类型声明和 reduced-motion 样式。
- 演示站路由、导航、能力审计和所有示例的完整可复制源码。

最终验收执行组件库和站点的完整测试、typecheck、生产构建及 `git diff --check`，并在浏览器检查定位、动画、键盘、焦点、响应式布局和空控制台。

本轮只开发并验证组件，不自动发布 npm 或推送 GitHub；发布由用户另行明确指示。
