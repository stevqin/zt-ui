# 更新日志

## 0.11.1 — 2026-10-21

### 优化

- 升级命令式反馈依赖 `@ztechjs/zt-alert` 至 `^0.1.3`，同步新版果冻弹性入场、图标描边、两段式退场和消息堆叠补位效果。
- 演示站补齐 Message、Notification、MessageBox、Dialog、Drawer 和全屏 Loading 的独立可复制示例，覆盖常驻、同 ID 更新、异步保存、关闭拦截、内容定制与实例控制。
- 新增动效对比区：窄屏也可观察普通弹窗回弹，并与全屏淡入、无回弹效果对照；展示抽屉侧向动画、消息与通知堆叠补位。

### 验证

- 补充真实交互回归，覆盖消息清理、全屏加载、表单返回值、抽屉放弃修改、输入取消与窄屏动效模式。

## 0.11.0 — 2026-10-21

### 新增

- Modal 支持 height、max-height、subtitle、close-label、loading、loading-text、body-scroll、底部 placement 和 fullscreen-below。
- Modal 补齐 header-actions、content 插槽、show / hide 事件、show-zoom 别名及 toggleFullscreen 方法，保留现有默认值和用法。
- Modal / Drawer 支持 class-names 扩展样式钩子；setOverlayZIndexAllocator 可接入宿主应用的统一层级计数器。

### 优化与修复

- Modal / Drawer 默认使用与 Portal 面板一致的液态玻璃渐变、边缘高光和轻度模糊，兼容深色主题。
- 统一处理 KeepAlive 停用、父浮层隐藏、关闭中重开与过期异步关闭校验，释放滚动锁并正确恢复焦点。
- focus-trap=false 时将外部确认窗口的键盘事件交还给所属窗口；异步关闭校验结束后再次检查保存状态。
- 补充固定高度、自管滚动、加载遮罩、底部弹出与缓存页面生命周期示例。

## [0.10.0](https://github.com/stevqin/zt-ui/compare/v0.9.0...v0.10.0) — 2026-10-21

### 新增

- Dropdown 支持通过 `ZtDropdownItem` 在 template 中声明菜单项，保留 `items` 配置方式，并提供自定义内容插槽示例。
- Table 支持通过 `ZtTableColumn` 在 template 中声明普通列、复选列（`type="selection"`）、单选列（`type="radio"`）和展开列（`type="expand"`），保留原有 `columns`、`selection`、`expandable` 用法。
- Table 新增 `resizable` 列宽拖拽、列级 `resizable` / `minWidth` 配置及 `column-resize` 事件；选择列支持 `selectionType="radio"`。
- Timeline 支持通过 `ZtTimelineItem` 在 template 中声明节点，保留原有 `items` 用法。
- Tree 新增 `autoItemHeight` 自适应行高、节点级 `checkable` 及字段映射、展开图标插槽；自定义节点内的交互控件可独立处理键盘操作。
- Modal 新增 `body-padding`，与 Drawer 统一支持数字、CSS 简写及 `0`；省略时沿用原有默认内边距。
- Popconfirm 新增五档 `size`，支持继承 ConfigProvider，统一控制面板、文字、图标和按钮尺寸；可通过 `button-size` 单独覆盖按钮尺寸。

### 优化

- 重绘 Dropdown、Cascader、TreeSelect 弹出面板与 Tabs 样式；Dropdown 默认显示随展开状态旋转的箭头。
- Popover、Popconfirm、Tooltip 改进液态玻璃背景、边缘和阴影，在保留半透明质感的同时提高亮色、暗色及复杂背景下的文字可读性。
- Popover、Popconfirm、Tooltip 使用轻微缩放淡入和快速淡出，并根据弹出方向设置动画原点。
- Modal 使用带重量感的果冻弹跳入场；关闭时立即响应，先缩小 150ms，再下落消失。Drawer 使用幅度更轻的果冻弹性，保持滑入滑出顺滑。
- Modal 全屏切换平滑调整窗口尺寸，避免内容缩放变形，支持恢复拖动后的窗口位置；全屏按钮改为四箭头朝外 / 朝内图标。
- Table 拖拽手柄与边框融合，排序图标改为随 `size` 缩放的紧凑上下箭头，复选和单选控件统一使用组件库组件。
- 补齐 Table 排序、选择、展开、固定列、拖拽调宽、远程数据、状态、自定义插槽及模板列等场景示例；补齐 Dropdown、Timeline 两种声明方式和 Tree 新能力示例。
- 文档演示中的原生操作控件统一替换为已有 zt-ui 组件，同步更新 API 文档和组件审计记录。
- 补齐新增示例的页面目录，将浮层可读性演示整理为可独立复制运行的示例。

### 修复

- 修复 Dropdown 悬停触发器与面板之间经过空隙时菜单意外关闭的问题。
- 修复 Timeline 自定义节点图标被拉伸变形的问题。
- 修复 Tour 聚焦区域未跟随目标圆角的问题，并稳定异步定位相关测试。
- 修复弹出面板动画期间定位测量偏移，以及嵌套 Tooltip / Popover 的文字色继承问题。
- 修复 Popconfirm 尺寸未传递到面板和操作按钮的问题；未指定 `button-size` 时，按钮改为跟随解析后的 `size`。

### 兼容性与验证

- 原有数组配置方式继续可用；新增模板声明和可选属性无需迁移现有代码。Tree 虚拟列表继续使用固定行高。
- 补充行为、样式、动效、尺寸继承和模板声明回归测试；组件库 1,615 项、文档站 687 项测试通过，组件契约审计零违规。
- npm 产物附带第三方图标许可声明 `THIRD_PARTY_NOTICES`。
