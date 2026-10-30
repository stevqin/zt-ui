# Zt UI Modal、Drawer 与 Checkbox 设计

## 背景





## 目标



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

## 测试与验证

新增 Vue 组件测试环境，覆盖高风险行为：



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
