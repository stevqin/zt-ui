# VTableGrid 功能对齐设计

## 目标与基线

在保留 `@ztechjs/zt-ui` 现有 VTableGrid API、默认行为和公共辅助函数的前提下，补齐 BIP VTableGrid 的可复用功能及配套交互。UI 使用 zt-ui 的组件、主题、尺寸、圆角和焦点管理。

对照源码：

- zt-ui：`src/components/vtable-grid/`，基线提交 `4fdd1ea92eb434e66880ad8b0ea58e8e47c613fe`。
- BIP：`bip_frontend/src/components/vtable-grid/`，基线提交 `7b0b2db2e8645eebf15bb02c866b6f23b7e5bbe4`。
- BIP 的组件类型、实际实现、使用示例和专项测试共同定义对照范围；README 中的默认值与源码有差异时以源码为准。

## 实现方式

采用增量扩展：保留组件入口、现有 Props / Emits / Slots / Expose，增加缺失的类型、配置和行为。公共功能拆分为职责单一的辅助模块，主体负责 Vue 生命周期与 VTable 连接。

整份替换 BIP 实现会引入默认值变化、业务接口、Portal 组件和 VXE 类型依赖；创建第二套平行 Grid 会增加维护成本。增量扩展可复用现有数据、选择、编辑、汇总和列设置模块，并沿用既有回归测试。

## 功能差异与交付范围

| 能力 | zt-ui 基线 | BIP 能力与对齐目标 |
| --- | --- | --- |
| 查询与分页 | 本地分页、远程代理、最后请求生效 | 保留本地分页默认值，增加本地全量展示模式；查询、重置和远程分页统一管理 |
| 本地筛选 | 无内置 filterMethod | 增加 `(row, form) => boolean` 本地过滤；先过滤再排序与分页，按过滤后的相应数据范围汇总 |
| 搜索区域 | 仅 form 插槽和 formData | 增加配置式搜索表单、校验、重置、折叠、字段插槽；保留原 form 插槽 |
| 字典选项 | 无共享选项加载 | 通过可注入加载器提供搜索字段与编辑器的选项加载、缓存、失败重试和过期请求隔离 |
| 列配置 | 基础字段、宽度、排序、编辑 | 补齐 align、resizable、ellipsis、溢出提示、图片配置及原生列高级能力 |
| 固定列 | 列顺序分组 | 显式计算左右冻结列数；固定宽度较小时保持右冻结列贴边；内部列不能被业务选项覆盖 |
| 单元格定制 | 原生 VTable 高级配置 | 增加 slot、headerSlot、render、actions 插槽和 Canvas 图元入口，支持标签及文本渲染 |
| 行高与滚动 | 按尺寸预设固定行高 | 增加自动行高、独立表头行高、换行和滚动条预留；支持隐藏容器与 KeepAlive 恢复 |
| 样式 | 基础明暗主题、行悬停 | 增加 stripe、borderMode、hoverMode、cellSelection、全局及列级样式；保留主题继承 |
| 选择 | 稳定 key、跨页保留、页内全选 | 增加 checkboxCheckMethod、禁选行、勾选行高亮，保证排序、过滤与汇总不破坏记录映射 |
| 编辑器 | 文本、多行、日期、数字、邮箱、URL、下拉 | 增加图片和布尔编辑、类型归一化，以及按需加载选项；保留现有带 label/value 的下拉选项 |
| 编辑交互 | 单元格变化及草稿 | 补齐区域粘贴、copyFormatter、可编辑与已修改标记、完成当前编辑后保存 |
| 整表草稿 | 仅已修改字段 | 增加 originalRecords 和 update:records，跟踪新增、删除、导入及整表撤销 |
| 保存生命周期 | batchSave、save、save-error | 增加 isSaving、hasChanges、保存前校验/确认、saved、cancel-edit；保存失败或取消确认保留草稿 |
| 汇总 | 普通附加记录、基础算法 | 冻结底部汇总，支持 backend/frontend 与 all/page 范围、字段映射、标题合并、对齐和样式 |
| 汇总数据边界 | 后端缺失字段回退当前页算法 | 新的 summaryConfig 模式下后端缺失字段留空，不能混入本页结果；保留旧辅助函数契约 |
| 行操作 | 单个 Canvas 按钮打开 DOM 菜单 | 增加直接图标/文字操作、按行配置、动态列宽、Tooltip、颜色及禁用状态；保留已有 action 事件 |
| 右键菜单 | 无 | 增加按行生成、分隔线、禁用项、边界约束、键盘及关闭焦点处理 |
| 工具栏 | toolbar 与固定内置按钮 | 新增 toolbarConfig、toolbar-action、reload 通知、exportLoading，以及图标和文字组合 |
| 导入与导出 | 导入事件、当前显示数据 CSV | 保留 CSV API，增加外部导出入口；提供通用文件选择/拖拽/模板链接导入弹窗 |
| 列设置 | 显隐、上下移动、存储 | 增加拖动排序、冻结区域内排序约束、查询/重置方法和动态 storageKey；处理存储异常 |
| 公共状态与插槽 | 部分实例方法和区域插槽 | 补齐 pager-right、size/checkbox/saving 等作用域、tableInstance、formRef、refreshRecords 等方法 |
| Canvas 生命周期 | 异步加载与卸载请求失效 | 保持动态加载；补齐 ResizeObserver、激活恢复、零尺寸保护、编辑/预览后刷新及事件清理 |

## API 与默认行为

### 现有契约

以下行为保持：

- `ZtVTableGrid` 及 `ZtVTableGrid*` 类型继续从组件库入口导出。
- `formData`、`toolbar`、`summary`、`editable`、`currentPage`、`pageSize` 继续可用。
- 本地数据默认分页，默认 `height=480`、`showActionsColumn=false`、工具栏包含刷新。
- `selection-change`、`error`、`create`、`import`、`export`、`action`、行单击/双击事件继续使用原参数。
- `query`、`reload`、`resize`、`setRecords`、`getTableInstance`、选择方法、`getChanges`、`saveChanges`、`cancelChanges`、`exportCsv` 继续可用。
- `createVTableGridCsv` 和 `buildVTableGridSummary` 保留原签名及结果。
- 现有下拉编辑器继续保留原始选项值类型和展示标签。

### 新配置

- `localPagination` 默认 `true`；设为 `false` 时本地全量展示并隐藏分页。远程分页仍由 `pagination` 决定。
- `formConfig` 使用组件库自有轻量类型，提供数据、字段、布局、校验、控件配置和插槽；明确传入的 `formData` 优先于 `formConfig.data`。`showForm` 控制搜索区域展示。
- 字段及编辑器的 `optionSource` 为普通字符串，通过 `optionLoader(source, context)` 加载。请求缓存归属当前组件或显式提供的缓存对象，避免跨账号和加载器混用。
- `toolbarConfig` 为新工具栏入口，显式传入时优先于 `toolbar`；原工具栏导出继续生成 CSV。新入口可通过明确的导出模式交给外部处理，不能同时触发两次导出。
- `summaryConfig` 为增强汇总入口，显式设置时优先于 `summary`。通过该入口启用范围标签、后端字段映射及标题合并；原 summary 配置继续工作。
- `editable` 始终控制能否编辑，`batchEdit` 只控制修改后的草稿跟踪和统一保存区域；省略 `batchEdit` 时保留现有编辑草稿行为。`batchEdit=true` 不能自行开启只读表格或只读列，`batchEdit=false` 不关闭已显式开启的单元格编辑。
- `saveConfirm` 默认 `false`，可开启与 BIP 同等的保存确认；使用 zt-alert MessageBox 或调用方回调。`beforeSave(payload)` 可同步/异步校验，返回 `false` 阻止保存，不绑定 BIP 的 confirmBtn。
- 保留 `save` 在保存成功后触发的既有语义，新增 `save-start` 表示请求开始、`saved` 表示成功，不将 `save` 改为保存前事件。保留 `saveChanges()` 失败时拒绝 Promise 的契约，UI 点击处理捕获异常并通过 `save-error` 提示。
- `originalRecords` 必须为独立快照，保存成功后由调用方更新；确认、保存和撤销过程防止并发写入覆盖草稿，取消或失败不清空草稿。
- 新增记录、保存、工具栏、过滤、右键和选择事件采用组件库命名。必要的 BIP 同等能力通过新入口提供，不要求应用改写既有监听器。
- 新增 `getEditChanges`、`getColumnSettings`、`resetColumnSettings`、`refreshRecords`，以及只读 `isSaving`、`hasChanges`、`tableInstance`、`formRef`。原方法为同一内部状态提供访问。

### 配置式表单与渲染边界

- 搜索字段使用组件库已有输入、选择、日期、日期时间和时间控件；支持业务提供的自定义组件及字段插槽。
- 日期、月份、年份及范围使用现有日期组件能力；周、季度、多值及 valueFormat 等业务存储格式通过可注入的渲染器或值转换器表达，范围顺序由相应适配器归一化；不支持的模式必须明确反馈，不能静默降级或透传无效类型，也不能依赖 PortalDatePicker。
- 控件、工具栏与分页统一继承组件 size；Form 配置不得使表格内部密度出现两套规格。
- 原生 Canvas 图元与标签通过独立子入口 `@ztechjs/zt-ui/vtable` 提供；主入口仍动态加载 @visactor/vue-vtable。子入口有独立构建、导出及类型声明，保证主包导入不初始化 Canvas 引擎，并通过消费者导入测试验证。
- 行拖动时提供 row-reorder 的源/目标索引事件；底层排序、过滤、粘贴和行操作需要使用原始业务记录映射，不能直接将包含表头或汇总的 Canvas 行号当成数组下标。

### 内容与样式优先级

- 数据状态背景：已修改单元格 > 勾选行 > 显式列样式 > 可编辑/只读默认样式 > 全局兜底样式。
- 显式列 align 同时应用于表头和数据，不覆盖其他对象或函数样式。
- 显式 resizable 优先于宽度推导，ellipsis 与自动换行互斥。
- 固定列仅由列配置决定；工具栏和列设置不能改变冻结所属区域。
- 汇总行不参与复选、编辑、行操作、右键、业务记录返回及导出。
- 后端全量汇总与前端本页汇总必须明确标识，不能将两种统计口径混用。

## 独立性与依赖边界

- 不导入 BIP 的 API、路由、工具函数、业务图标和 Portal 组件，不建立项目间文件链接。
- 搜索表单使用 ZtForm 与组件库控件；不增加 VXE、Element Plus 或 BIP 字典数据依赖。
- 字典由 optionLoader 注入；权限判断、业务接口、导入处理与全量导出由应用执行。
- 导入弹窗只处理选择、类型校验、拖拽及提交事件，不解析业务 Excel 或自行上传。
- 可复用 BIP 的算法与交互规则，图标和颜色采用 zt-ui 设计令牌。
- 表头枚举过滤只筛选已加载记录。远程分页模式不能将当前页枚举当作服务端全量条件。
- 若启用 FilterPlugin，需将对应 VisActor 插件版本纳入包依赖与构建配置，并验证 ESM/UMD 和消费者安装。

## 验证与验收

1. 保持现有 VTableGrid 的 41 项回归通过，并为新增能力增加行为测试和类型消费测试。
2. 查询覆盖旧请求成功/失败晚到、卸载、代理切换和分页归一化；状态仅由有效请求更新。
3. 草稿覆盖改回原值、跨页重新查询、新增/删除/删除全部、保存取消、重复保存、保存失败和撤销。
4. 汇总覆盖字段映射、后端缺失字段、空数据、隐藏列、非连续/跨冻结区合并及过滤后的范围。
5. 列设置覆盖冻结区域边界、增删列、损坏存储、不可用存储、storageKey 切换及恢复默认值。
6. UI 覆盖明暗主题、五档尺寸、窄屏、横纵滚动、Popover 在浮层内的焦点与键盘关闭。
7. 真实浏览器验证 Canvas 插槽、编辑/粘贴、图片预览、冻结汇总、操作按钮、右键菜单及 KeepAlive 恢复，不能只依赖 MockListTable 测试。
8. 文档站增加 BIP 同等能力的可运行示例、准确 API 和作用域类型；README 保持精简，通过 Pages 链接访问详细用法。
9. 通过组件库测试、类型检查、ESM/UMD 构建、文档站测试与构建、组件契约和示例审计，并检查 npm 打包内容。

## 交付分组

1. 配置与状态基础：API 扩展、查询、选择、整表草稿和保存生命周期。
2. 表格呈现：列适配、尺寸与样式、冻结列/汇总、复制、编辑器和过滤。
3. UI 与集成：配置式表单、Canvas 内容、行操作、右键菜单、工具栏、列设置和导入弹窗。
4. 生命周期、真实浏览器验证、示例/API 文档及完整构建检查。

每组均需完成其公共类型、行为测试和演示；整体能力以差异表逐项验收。
