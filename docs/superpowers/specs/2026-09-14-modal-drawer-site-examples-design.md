# Zt UI Modal、Drawer 与演示代码设计

## 背景

zt-ui 当前包含 Button、Tag、Radio、Checkbox、Switch、Badge 六类基础组件。Checkbox 的选中标记存在视觉偏移；演示站只有 Button 页面使用 `DemoBlock` 展示少量模板代码，其余页面没有可查看、可复制的 Vue/TypeScript 示例。

本次增加 `ZtModal` 和 `ZtDrawer` 两个 Vue 组件，并建立供二者共用的弹层基础能力。同时统一演示站所有组件页的代码示例体验。

## 目标

1. Checkbox 在 mini、small、default、medium、large 各尺寸中保持方框和对勾居中。
2. 每个演示区都可展开查看完整 Vue SFC 示例，并可一键复制。
3. 提供可直接使用、类型完整、无业务依赖的 `ZtModal` 和 `ZtDrawer`。
4. 弹层支持键盘、焦点、滚动锁定、层级和异步关闭拦截等基础交互。
5. 组件库与演示站的类型检查和生产构建通过。

## 非目标

- 不提供 `Modal.open()` 或 `Drawer.open()` 等命令式服务。
- 不依赖 bip_frontend 的 PortalIcon、PortalModal、PortalDrawer 或业务样式。
- 不引入拖拽、可调整尺寸、路由驱动弹层等业务功能。

## Checkbox 修复

`.zt-checkbox__inner` 当前使用 `width: 100%`、`height: 100%` 和 2px 边框，但没有设置 `box-sizing: border-box`。其最终外部尺寸比父容器宽高各多 4px，硬编码的对勾坐标也随尺寸产生偏差。

修复方案：

- 为 Checkbox 内部元素统一使用 border-box。
- 对勾伪元素使用 `top: 50%`、`left: 50%` 和中心变换定位。
- 各尺寸只调整对勾宽高，不再维护不同的绝对坐标。
- 半选横线继续使用同一中心定位规则。

## 共享弹层核心

新增内部 overlay 模块，供 Modal 和 Drawer 复用，不作为公共组件导出。

职责包括：

- 通过 `Teleport` 挂载到 `body`。
- 维护打开弹层栈，并从用户传入的 `zIndex` 开始为嵌套弹层递增层级。
- 使用引用计数锁定 `body` 滚动，最后一个弹层关闭时恢复原样。
- 只允许最上层弹层响应 Escape 和遮罩点击。
- 遮罩关闭要求按下和抬起都发生在遮罩自身，避免从内容区域拖出后误关闭。
- 打开时记录当前焦点，关闭后将焦点恢复到原元素。
- 默认将焦点移入弹层；开启 `focusTrap` 时约束 Tab/Shift+Tab 循环。
- 支持同步或异步 `beforeClose(reason)`。返回 `false` 时取消关闭；Promise pending 期间阻止重复关闭。
- 组件卸载时移除全局监听、弹层栈和滚动锁定。

关闭原因统一定义为：

```ts
type ZtOverlayCloseReason = 'close' | 'cancel' | 'confirm' | 'mask' | 'escape' | 'api'
```

## ZtModal

### Props

```ts
interface ZtModalProps {
  modelValue?: boolean
  title?: string
  width?: number | string
  top?: number | string
  fullscreen?: boolean
  showHeader?: boolean
  showClose?: boolean
  showFooter?: boolean
  showCancelButton?: boolean
  confirmText?: string
  cancelText?: string
  confirmLoading?: boolean
  confirmDisabled?: boolean
  maskClosable?: boolean
  escClosable?: boolean
  lockScroll?: boolean
  destroyOnClose?: boolean
  autoFocus?: boolean
  focusTrap?: boolean
  zIndex?: number
  beforeClose?: (reason: ZtOverlayCloseReason) => boolean | void | Promise<boolean | void>
}
```

默认值遵循稳妥交互：遮罩不可关闭、Escape 可关闭、锁定滚动、自动聚焦；footer 默认隐藏，避免组件替使用者推断操作。

### Slots

- `default`：正文，暴露 `{ close }`。
- `title`：自定义标题，暴露 `{ close }`。
- `footer`：自定义底部，暴露 `{ close, confirm, cancel }`。

### Events

- `update:modelValue(value)`
- `open`
- `opened`
- `close(reason)`
- `closed(reason)`
- `confirm`
- `cancel`

点击默认确认按钮先发出 `confirm`；组件不擅自关闭，以便业务完成校验或异步保存后更新 `v-model`。默认取消按钮走关闭拦截，并在成功关闭时发出 `cancel`。

### 暴露方法

`open()`、`close(reason?)`、`focus()`。

### 视觉与动画

- 采用现有 Zt UI 的玻璃质感、蓝色令牌、圆角和阴影。
- 普通 Modal 居中显示；设置 `top` 时从顶部偏移。
- `fullscreen` 使用整个视口并去除圆角。
- 进入动画为遮罩淡入、面板轻微上移缩放；退出时间稍短。
- 尊重 `prefers-reduced-motion`。

## ZtDrawer

Drawer 使用与 Modal 相同的交互核心和公共 props，并增加：

```ts
interface ZtDrawerProps extends ZtOverlayCommonProps {
  placement?: 'left' | 'right' | 'top' | 'bottom'
  size?: number | string
}
```

- 默认 `placement="right"`、`size="420px"`。
- 左右 Drawer 的 size 控制宽度；上下 Drawer 的 size 控制高度。
- 面板贴边显示，对应边保留圆角。
- 进入和退出方向跟随 placement。
- 窄屏下左右 Drawer 最大宽度为 `100vw`，上下 Drawer 最大高度为 `100vh`。

Slots、Events 和暴露方法与 Modal 保持一致。

## 可访问性

- 面板使用 `role="dialog"` 和 `aria-modal="true"`。
- 有标题时使用 `aria-labelledby`，隐藏标题区时提供可用的 `aria-label`。
- 关闭按钮带有中文 aria-label。
- 最上层之外的弹层设置 `aria-hidden` 和 `inert`。
- 加载中的确认按钮保持 disabled 语义。
- Escape 不在输入法组合阶段触发关闭。

## 演示站代码示例

扩展 `DemoBlock`：

- 保留预览、说明和展开/收起交互。
- 代码区显示 `Vue + TypeScript` 标签。
- 增加“复制代码”按钮，优先使用 Clipboard API；不可用时使用受控降级方式。
- 复制成功显示“已复制”，短暂延时后恢复；失败显示“复制失败”。
- 按钮具备明确的 aria-label，复制反馈使用 `aria-live="polite"`。

Button、Tag、Radio、Checkbox、Switch、Badge、Modal、Drawer 页面全部使用 `DemoBlock`。每个示例提供可独立理解的完整代码，结构如下：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtComponent } from '@ztechjs/zt-ui'
// 当前示例所需状态和事件
</script>

<template>
  <!-- 当前示例 -->
</template>
```

静态示例也保留组件 import，使复制内容能明确说明组件来源。演示页新增 Modal 和 Drawer 导航与路由。

## 测试与验证

新增 Vue 组件测试环境，覆盖高风险行为：

- Checkbox 各尺寸的方框使用 border-box，选中与半选标记采用中心定位。
- Modal 和 Drawer 的 v-model 打开/关闭。
- Escape、遮罩、关闭按钮和取消按钮的关闭原因。
- `beforeClose` 同步拒绝与异步处理。
- 多弹层时只有顶部弹层响应键盘。
- 滚动锁引用计数和卸载清理。
- 打开后的焦点移动、Tab 循环及关闭后的焦点恢复。
- Drawer 四个 placement 的类名与 size 样式。
- DemoBlock 展开、复制成功和复制失败反馈。

最终执行：

1. 组件测试。
2. zt-ui 类型检查与生产构建。
3. site 类型检查与生产构建。
4. 在浏览器中检查 Checkbox 各尺寸、Modal、Drawer，以及所有演示页的查看/复制代码交互。

## 验收标准

- Checkbox 对勾与半选横线在所有展示尺寸中视觉居中。
- 所有演示块均存在可展开的 Vue + TypeScript 代码和复制按钮。
- Modal、Drawer 可从包入口按名称导入，声明文件包含完整公共类型。
- 两个弹层组件完成键盘、焦点、滚动、层级、关闭拦截和动画处理。
- 所有新增测试、类型检查和构建通过。
