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
- 将全局命令式反馈统一交给 `@ztechjs/zt-alert`，zt-ui 不再维护重复实现。

## 非目标

- 不兼容历史 UI 组件库或业务项目中的旧 API、旧类名、旧 DOM 结构和私有行为。
- 不为当前试验性循环架构提供兼容层、弃用周期或双实现开关。
- 不把 SelectBox 的分页、批量粘贴、确认草稿等能力下沉到普通 Select。
- 不在本次重构中扩展单选模式、树形选项或虚拟列表。
- 不用 `@ztechjs/zt-alert` 的全屏 Loading 代替 SelectBox 面板内部的局部加载状态。

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

远程选项模块由 Select 和 SelectBox 共用，负责防抖、加载、错误、结果和请求竞态。它是可传入请求参数与响应映射的通用请求协调器：普通 Select 适配现有的关键词请求，SelectBox 适配带分页参数的请求。每次请求使用递增编号，只有最新请求可以更新状态。卸载时清理定时器，已失效请求的返回值不会覆盖新结果。

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

SelectBox 远程搜索同时支持分页查询与批量精确匹配，两类请求使用可判别联合类型：

```ts
export type ZtSelectBoxRemoteRequest =
  | {
      mode: 'search'
      keyword: string
      /** 从 1 开始的页码。 */
      page: number
      pageSize: number
    }
  | {
      mode: 'batch'
      /** 已去除空白并去重的粘贴文本。 */
      keywords: string[]
    }

export interface ZtSelectBoxBatchMatch {
  /** 必须是本次请求中的原始 keyword。 */
  keyword: string
  option: ZtSelectOption
}

export type ZtSelectBoxRemoteResult =
  | {
      mode: 'search'
      /** 当前页选项。 */
      options: ZtSelectOption[]
      /** 当前关键词下的全部匹配数量。 */
      total: number
    }
  | {
      mode: 'batch'
      /** 全部精确匹配结果，不分页。 */
      matches: ZtSelectBoxBatchMatch[]
    }

export type ZtSelectBoxRemoteMethod = (
  request: ZtSelectBoxRemoteRequest,
) => Promise<ZtSelectBoxRemoteResult>
```

远程模式下 `remoteMethod` 必须使用该契约，不接受只返回数组的旧签名。普通查询收到 `mode: 'search'`：页码为从 1 开始的整数，`pageSize` 来自面板分页器，返回的 `options` 仅代表当前页，分页器使用 `total` 计算总页数。批量粘贴收到 `mode: 'batch'`：服务端必须一次返回全部精确匹配记录，不能只返回当前分页中的数据。

分页配置属于 SelectBox 公共 props：

| API | 类型 | 默认值 | 行为 |
|---|---|---|---|
| `pageSize` | `number` | `10` | 每页条数的初始值与外部值入口，本地和远程模式共用 |
| `pageSizes` | `number[]` | `[10, 20, 50, 100, 200, 500]` | 分页器可选的每页条数 |

组件在用户修改每页条数时输出 `update:pageSize`，因此推荐按需要使用以下两种方式：

```vue
<!-- 固定初始值；用户仍可在组件内部临时切换。 -->
<ZtSelectBox :page-size="20" />

<!-- 需要保存或观察用户选择时使用。 -->
<ZtSelectBox v-model:page-size="pageSize" />
```

不增加含义重复的 `defaultPageSize`。未传 `pageSize` 时使用 `10`；非有限数、零或负数按 `10` 处理，有限小数向下取整并至少为 `1`。`pageSizes` 会过滤非正整数并去重；当前有效 `pageSize` 不在列表中时，组件把它加入可选项，保证分页器能够正确显示当前值。

当前页由组件内部管理。关键词变化、外部 `pageSize` 变化或用户选择新的每页条数时回到第 1 页；点击页码时保留关键词和 `pageSize`。无需额外的页码事件，因为每次远程调用都能收到完整分页参数。

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

关键词变化先输出 `search`，将页码重置为 1，再由 `useRemoteOptions` 按 `debounce` 调用 `remoteMethod({ mode: 'search', keyword, page: 1, pageSize })`。用户点击页码时立即使用新页码请求，不额外等待搜索防抖；改变每页条数时先输出 `update:pageSize`，再重置到第 1 页并立即请求。服务端返回的 `options` 直接作为当前页内容，不能再次执行客户端切片；`total` 直接传给分页器。

SelectBox 按选项值维护已见选项的标签缓存，使用户翻页或改变关键词后，已选摘要仍能显示原标签。新响应中相同值的标签覆盖缓存中的旧标签，但响应不能移除其他页已选项的标签。

加载期间面板使用 `ZtLoading`；失败时保留当前草稿和上一次成功结果，显示错误状态并输出 `remote-error`。旧请求的完成、失败或加载结束均不能覆盖最新请求状态。若服务端返回负数或非有限的 `total`，组件按 `0` 处理；当前页因总数缩小而超界时，回到最后一个有效页并重新请求一次。

清空选择时清空关键词、将页码重置为 1，并按当前 `pageSize` 请求空关键词结果；模型值和草稿的清空不等待该请求完成。

### 批量粘贴匹配

批量粘贴按用户选定的分隔符解析。组件记录非空原始条目数，再对去除首尾空白后的文本去重。提示中的“粘贴数量”使用原始非空条目数；存在重复项时同时显示去重后的数量，避免用户误解统计结果。

本地模式使用完整的 `options` 匹配，不能只使用当前筛选结果或当前页。远程模式点击“确定”时调用：

```ts
remoteMethod({ mode: 'batch', keywords })
```

服务端按选项名称或值的字符串形式进行精确匹配，并返回每个命中关键词对应的完整选项。`keyword` 必须来自本次请求，组件忽略请求之外的记录；禁用选项不计入成功匹配，也不自动选择。多个关键词指向同一选项时按选项值去重，一个关键词返回多个可用选项时全部选中。

批量请求期间，复用 `ZtButton` 的 `loading` 状态禁用“确定”按钮并防止重复提交。请求成功后，组件把所有匹配选项加入标签缓存，将其值与现有草稿合并去重，然后按正常确认流程提交并关闭面板。即使只匹配到部分或完全没有匹配，也不阻断提交；已有草稿仍正常提交。

批量确认后直接使用 `@ztechjs/zt-alert` 的 `ZtMessage` 显示非阻断反馈：

- 全部匹配：成功消息，例如“批量粘贴 8 项，匹配 8 项，已自动勾选 8 项”。
- 部分匹配：警告消息，例如“批量粘贴 8 项，匹配 5 项，已自动勾选 5 项”。
- 存在重复：消息补充“去重后 6 项”，匹配数量按命中的唯一关键词数计算，自动勾选数量按新增的唯一选项值计算。
- 无有效文本：信息消息“没有可匹配的粘贴内容”，不发起远程请求，仍按当前草稿完成确认。

远程批量请求失败时输出 `remote-error`，使用 `@ztechjs/zt-alert` 的 `ZtMessage.error` 提示“批量匹配失败，请重试”，保留粘贴文本、草稿和打开的面板，不提交模型。批量请求使用独立的请求编号；过期响应不能修改草稿、关闭面板或显示统计消息，也不能与普通分页搜索的加载状态互相覆盖。

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

## 命令式反馈依赖边界

`@ztechjs/zt-alert` 是 Message、Notification、MessageBox、Dialog、Drawer 和全屏 Loading 等全局命令式反馈的唯一实现。zt-ui 将其声明为正式运行时依赖，并在需要命令式反馈的组件内部直接从该包导入。SelectBox 的批量匹配反馈使用：

```ts
import { ZtMessage } from '@ztechjs/zt-alert'

ZtMessage.success('批量粘贴 8 项，匹配 8 项，已自动勾选 8 项')
```

zt-ui 不重新导出 `@ztechjs/zt-alert` 的 API，使用方需要命令式反馈时直接从独立包导入。这能保持 API 归属明确，并避免 zt-ui 与 zt-alert 出现不同的参数、返回值或生命周期语义。

本次实现从 zt-ui 删除以下自建命令式 API、源码、文档和专项测试：

- `ZtMessage`、`useZtMessage`；
- `ZtNotification`、`useZtNotification`；
- `ZtMessageBox`、`useZtMessageBox` 及相关异常类型；
- `ZtLoadingService`、`useZtLoading`。

不提供转发、别名或弃用兼容层。zt-ui 站点不再把 Message、Notification、MessageBox 和全屏 Loading 展示为自身 API，而是链接到 `@ztechjs/zt-alert` 的文档。

以下声明式 Vue 组件继续保留在 zt-ui：

- `ZtLoading`：覆盖某个组件内容区域的局部加载状态；
- `ZtAlert`：嵌入页面布局的静态反馈；
- `ZtModal`、`ZtDrawer`：由 Vue 模板和响应式状态控制的结构化浮层。

两类 Loading 的边界必须明确：SelectBox 远程分页搜索使用 zt-ui 的声明式 `ZtLoading`，因为加载只覆盖选项列表；跨页面、锁定焦点和滚动的全屏任务使用 `@ztechjs/zt-alert` 的 `ZtLoading.open()`。组件库文档通过不同的导入来源和示例名称避免混淆。

`@ztechjs/zt-alert/style.css` 必须随使用命令式反馈的应用加载。zt-ui 的构建与发布验证需要确认 SelectBox 的 Message 在仅安装 zt-ui 及其正式依赖的消费项目中具有完整样式，不能依赖开发站点偶然引入的 CSS。

## 删除旧结构

实现完成后删除：

- `src/components/select/filter-context.ts`；
- `ZtSelect` 中对 SelectBox 模式的注入和全部条件分支；
- `src/components/select/SelectFilterPanel.vue`；
- `src/components/select/filter-panel.scss`。

面板代码迁移并整理到 `select-box` 目录。迁移不是兼容复制，旧文件和旧内部路径不会保留转发层。

## 错误处理

- 远程分页请求失败只影响当前结果区域，不自动关闭面板或清空已选草稿；远程批量请求失败保留批量粘贴视图以便重试。
- 当前请求失败时输出 `remote-error` 并显示可辨识的错误状态；过期请求失败不输出用户可见错误。
- 外部传入不存在于当前选项集合的值仍保留在模型中；若缺少可显示标签，摘要使用该值的字符串形式，避免静默丢值。
- 批量粘贴无法匹配的文本保持未选中；部分匹配不阻断提交，统计结果通过 zt-ui Message 反馈，无效文本不会进入模型。

## 测试策略

按行为边界拆分测试，避免依赖内部组件层级或具体 DOM 嵌套：

- 清空：按钮显隐、事件顺序和值、表单校验、焦点、打开面板时保持打开、草稿同步、禁用与空值幂等。
- 草稿：选择、全选、确认、取消、外部值更新和清空后的事务边界。
- 点击：标签、插槽内容、选项行空白、面板空白、外部区域和嵌套 Select 浮层。
- 远程：关键词、页码和每页条数参数，`pageSize` 默认值、外部更新与 `update:pageSize`，`pageSizes` 归一化，搜索与修改每页条数重置页码，翻页即时请求，服务端 `total`，标签缓存、防抖、加载组件、成功、失败、空关键词、越界页修正、请求竞态和卸载清理。
- 批量粘贴：本地完整选项匹配、远程 `batch` 请求、原始与去重数量、部分匹配继续提交、全部匹配、零匹配、禁用项、重复选项值、一个关键词多结果、按钮 Loading、Message 类型与文本、请求失败重试和竞态响应。
- 命令式反馈边界：SelectBox 从 `@ztechjs/zt-alert` 调用 Message；zt-ui 不再导出自建 Message、Notification、MessageBox 与全屏 Loading 服务；声明式 `ZtLoading` 仍能独立工作；消费构建包含 zt-alert 运行时与样式。
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
