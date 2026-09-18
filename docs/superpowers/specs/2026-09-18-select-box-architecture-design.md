# ZtSelectBox 单向依赖架构设计

## 背景

`ZtSelectBox` 已具备多选、搜索、远程搜索、分页、批量粘贴、确认与取消、选项插槽，以及 `size`、`radius`、`theme` 继承等能力。但当前实现由 `ZtSelectBox` 包装 `ZtSelect`，再由 `ZtSelect` 条件渲染 SelectBox 专用面板；面板内部又使用 `ZtSelect` 选择批量粘贴分隔符。这形成了 `ZtSelect -> SelectFilterPanel -> ZtSelect` 的循环组件依赖，也让普通 Select 混入了大量 SelectBox 专用判断。

zt-ui 是一套全新的 UI 组件库。本次设计不保留当前试验实现或任何历史组件的内部结构、私有注入协议及非正式 API；只保留本次明确列出的 `ZtSelectBox` 公共能力。若现有实现与本规格冲突，以本规格为准。

## 目标

- 将 `ZtSelectBox` 重构为独立组件，不再包装或驱动 `ZtSelect` 的内部模式。
- 建立清晰的单向依赖：`ZtSelect` 和 `ZtSelectBox` 共同依赖无 UI 业务偏向的选择与浮层基础能力。
- 删除 `ZtSelect` 中全部 SelectBox 专用分支，使普通 Select 可以独立理解、测试和演进。
- 保留已经确认的 SelectBox 产品能力与视觉行为，并增加与其他输入组件一致的一键清空能力。
- 保持面板内部优先复用 zt-ui 已有的 Checkbox、Button、Input、Pagination、Select、Icon、Loading、Scrollbar 和 Text 组件。

## 非目标

- 不兼容历史 UI 组件库或业务项目中的旧 API、旧类名、旧 DOM 结构和私有行为。
- 不为当前试验性循环架构提供兼容层、弃用周期或双实现开关。
- 不把 SelectBox 的分页、批量粘贴、确认草稿等能力下沉到普通 Select。
- 不在本次重构中扩展单选模式、树形选项或虚拟列表。

## 方案

采用独立 SelectBox 与共享基础能力的方案。

```text
components/
├── selection/
│   ├── types.ts
│   ├── useRemoteOptions.ts
│   └── useAnchoredDropdown.ts
├── select/
│   ├── ZtSelect.vue
│   └── select.scss
└── select-box/
    ├── ZtSelectBox.vue
    ├── SelectBoxPanel.vue
    ├── useSelectBoxDraft.ts
    ├── select-box.scss
    ├── types.ts
    └── index.ts
```

依赖方向如下：

```text
selection primitives
   ↑              ↑
ZtSelect      ZtSelectBox ──→ SelectBoxPanel
   ↑                              │
   └──────────────────────────────┘
          仅用于分隔符选择器
```

`selection` 只包含类型、远程请求状态和锚点浮层行为，不渲染 Select 或 SelectBox，也不导入两者。`SelectBoxPanel` 可以把 `ZtSelect` 作为普通子控件使用；`ZtSelect` 不能导入、注入或识别 SelectBox。这样依赖图保持单向且没有循环。

## 组件职责

### `ZtSelectBox.vue`

SelectBox 容器负责公共 API、触发器、浮层开关、外部值同步、汇总文本、清空行为、表单集成和面板数据编排。它直接渲染自己的触发区域，不通过 `ZtSelect` 模拟 SelectBox 模式。

容器从 ConfigProvider 和 FormItem 解析 `size`、`radius`、`theme`、`disabled` 与校验状态，并把解析后的状态传给面板。触发器负责显示占位文本或已选项摘要，摘要保持单行并以省略号收起。

### `SelectBoxPanel.vue`

面板负责搜索区、列表全选、固定在左侧的复选框、选项内容、分页、批量粘贴入口、确认和取消。列表及长内容使用 `ZtScrollbar`，文本截断使用 `ZtText`，远程加载使用 `ZtLoading`。

选项插槽只替换复选框右侧的内容，不能替换、移动或隐藏左侧复选框。点击选项文字、插槽内容或该行空白区域等同于点击复选框，只切换选择状态，不关闭面板。点击面板内非操作性空白区域不会关闭面板。

批量粘贴视图继续使用 zt-ui 的 Input、Select、Button 和 Icon。分隔符选择器可直接使用公开的 `ZtSelect`，该依赖不会反向进入 Select。

### `useSelectBoxDraft.ts`

草稿模块维护面板打开期间的待确认选择，提供切换单项、当前结果全选、取消回滚和确认提交。它只处理值与选项映射，不处理 DOM、浮层或远程请求。

打开面板时根据当前 `modelValue` 创建草稿；确认时一次性向外提交；取消时丢弃草稿。外部 `modelValue` 在面板打开期间发生变化时，以外部值为准重建草稿，避免表单重置后面板仍显示旧选择。

### `useRemoteOptions.ts`

远程选项模块由 Select 和 SelectBox 共用，负责防抖、加载、错误、结果和请求竞态。每次请求使用递增编号，只有最新请求可以更新状态。卸载时清理定时器，已失效请求的返回值不会覆盖新结果。

该模块不渲染加载状态；SelectBox 使用 `ZtLoading` 展示，Select 按自己的下拉结构展示。远程方法缺失时不发请求，并进入空结果状态。

### `useAnchoredDropdown.ts`

锚点浮层模块负责：

- 受控的打开与关闭状态；
- `Teleport` 后的固定定位和上下展开方向；
- 窗口滚动、尺寸变化及触发器尺寸变化后的重新定位；
- 外部点击关闭；
- 嵌套浮层分支注册，使面板中的 Select 等子浮层不被当作外部点击；
- 关闭后的焦点恢复和全局监听清理。

模块接收触发器和面板元素引用，不了解选项、草稿、分页或批量粘贴业务。Select 和 SelectBox 可以按各自的键盘规则调用它。

## 公共 API

SelectBox 保持多选组件定位，`modelValue` 使用 `ZtSelectValue[]`。公共选项类型从 `selection/types.ts` 定义，并由 `select` 与 `select-box` 入口按需重新导出。由于 zt-ui 当前不承担历史兼容，旧的私有类型路径不设兼容转发；仅组件公开入口属于支持范围。

已有公共能力包括：

- 本地 `options`；
- `filterable` 搜索；
- `remote`、`remoteMethod` 和 `debounce` 远程搜索；
- `width` 触发器宽度；
- 分页与每页条数；
- 批量粘贴；
- `option` 插槽；
- `size`、`radius`、`theme`、`disabled`；
- 确认与取消；
- 加载、空数据和错误状态。

本次新增：

| API | 类型 | 默认值 | 行为 |
|---|---|---|---|
| `clearable` | `boolean` | `false` | 有已选值且未禁用时，在触发器显示清空按钮 |
| `clear()` | `() => void` | — | 与点击清空按钮相同，立即清空选择 |

`clearable` 的命名、默认值、交互和事件语义与 zt-ui 的 Input、Select 一致。清空属于输入控件的即时操作，不参与面板的确认事务。

## 一键清空行为

用户点击清空按钮或调用公开的 `clear()` 时：

1. 立即输出 `update:modelValue`，值为 `[]`。
2. 输出 `change`，值为 `[]`。
3. 输出无参数的 `clear`。
4. 触发 FormItem 的 `change` 校验。
5. 清空搜索关键词及与关键词关联的本地或远程结果状态。
6. 将焦点保留或恢复到 SelectBox 触发器。

如果面板已经打开，面板保持打开，草稿同步为空，用户可以继续选择。该操作不需要再次点击“确定”，也不会因后续点击“取消”恢复被清空的值。若组件禁用或当前值已经为空，清空按钮不显示，`clear()` 不发出重复事件。

清空按钮使用 zt-ui 内置 Icon，并与其他输入组件采用相同的可聚焦性、悬停反馈和无障碍名称。点击按钮必须阻止触发器的开关行为，不能顺带打开或关闭面板。

## 数据流

### 本地模式

`options` 进入 SelectBox 容器，搜索关键词产生过滤结果，过滤结果再进入分页。当前页选项与草稿值共同决定每行复选框状态及“当前结果全选”状态。确认后容器提交草稿；取消后容器恢复外部值。

### 远程模式

关键词变化先输出 `search`，再由 `useRemoteOptions` 按 `debounce` 调用 `remoteMethod`。最新请求的结果进入分页。加载期间面板使用 `ZtLoading`；失败时显示错误状态并输出 `remote-error`。旧请求的完成、失败或加载结束均不能覆盖最新请求状态。

清空选择时清空关键词，并按远程搜索既定规则请求空关键词结果；模型值和草稿的清空不等待该请求完成。

### 提交模型

选项点击只更新草稿。确认按钮提交草稿并关闭面板；取消按钮关闭面板并丢弃草稿。清空是唯一绕过确认步骤的选择变更，因为它需要与 zt-ui 其他输入组件的 `clearable` 语义一致。

## 浮层、焦点与关闭规则

- 点击触发器打开或关闭面板。
- 点击面板内部，包括选项内容、分页、搜索、批量粘贴区域和空白处，均不触发外部关闭。
- 点击嵌套子浮层不关闭 SelectBox 面板。
- 点击 SelectBox 与其已登记子浮层之外的区域关闭面板，并按取消语义丢弃未确认草稿。
- `Escape` 关闭面板并恢复焦点；`Tab` 使用浏览器正常焦点顺序，并在焦点真正离开整个组件及其浮层分支后关闭。
- 打开后焦点进入搜索输入；不可搜索时进入第一个可交互元素。

触发器使用 `role="combobox"` 和 `aria-expanded`、`aria-controls`、`aria-haspopup="dialog"`。完整面板使用 `role="dialog"` 并提供可访问名称；列表区域使用 `role="listbox"` 和 `aria-multiselectable="true"`，选项使用 `role="option"`、`aria-selected` 和 `aria-disabled`。

## 视觉与尺寸

触发器和面板使用实色语义背景，避免透明叠加造成雾蒙蒙的观感。颜色、边框、阴影和文字全部使用主题 token。`size` 同时影响触发器高度、左右内边距、图标尺寸、复选框与选项内容间距、面板控件密度；`radius` 同时影响触发器和面板；`theme` 作用于全部子组件。

复选框与选项内容使用紧凑的尺寸 token 间距，不能由插槽内容自行推远。底部按钮使用统一的主次层级：取消为次按钮，确定为主按钮；批量粘贴入口保持工具操作层级，不与确定按钮竞争视觉重点。

## 删除旧结构

实现完成后删除：

- `src/components/select/filter-context.ts`；
- `ZtSelect` 中对 SelectBox 模式的注入和全部条件分支；
- `src/components/select/SelectFilterPanel.vue`；
- `src/components/select/filter-panel.scss`。

面板代码迁移并整理到 `select-box` 目录。迁移不是兼容复制，旧文件和旧内部路径不会保留转发层。

## 错误处理

- 远程请求失败只影响当前结果区域，不自动关闭面板或清空已选草稿。
- 当前请求失败时输出 `remote-error` 并显示可辨识的错误状态；过期请求失败不输出用户可见错误。
- 外部传入不存在于当前选项集合的值仍保留在模型中；若缺少可显示标签，摘要使用该值的字符串形式，避免静默丢值。
- 批量粘贴无法匹配的文本保持未选中，并在批量粘贴视图展示明确的匹配结果，不让无效文本进入模型。

## 测试策略

按行为边界拆分测试，避免依赖内部组件层级或具体 DOM 嵌套：

- 清空：按钮显隐、事件顺序和值、表单校验、焦点、打开面板时保持打开、草稿同步、禁用与空值幂等。
- 草稿：选择、全选、确认、取消、外部值更新和清空后的事务边界。
- 点击：标签、插槽内容、选项行空白、面板空白、外部区域和嵌套 Select 浮层。
- 远程：防抖、加载组件、成功、失败、空关键词、请求竞态和卸载清理。
- 视觉配置：ConfigProvider 的 `size`、`radius`、`theme`，以及显式 props 的覆盖优先级。
- 公共组件复用：Checkbox、Button、Input、Pagination、Select、Icon、Loading、Scrollbar 和 Text 的关键集成行为。
- Select 回归：普通单选、多选、搜索、远程搜索、浮层定位和键盘操作，确保移除 SelectBox 分支后行为不变。
- 构建与类型：组件入口、类型导出、站点示例和库构建。

测试先为新边界编写失败用例，再逐步迁移实现。架构测试应静态确认 `select` 目录不导入 `select-box`，并确认不存在 `filter-context` 或 SelectBox 模式标记。

## 文档与验收

SelectBox 文档需要完整展示：基础选择、本地搜索、远程搜索及 Loading、分页、批量粘贴、自定义选项、尺寸与主题继承、一键清空。示例只使用最终公开 API，不引用内部面板或组合函数。

完成标准：

- `ZtSelect` 与 `ZtSelectBox` 不存在循环依赖；
- `ZtSelect` 源码中不存在 SelectBox 专用分支；
- SelectBox 的已确认功能、视觉状态和交互测试通过；
- 一键清空与其他输入组件的事件、校验和焦点行为一致；
- 库测试、站点测试、库构建、站点构建和差异检查通过。
