# ZtVTableGrid 设计

## 目标

在 zt-ui 中提供基于 VisActor VTable 的 Vue 3 数据表格组件。组件面向通用业务后台，保留 BIP 现有 VTableGrid 的高频能力，但不依赖 VXE Form、Element Plus、BIP API、BIP 状态管理或业务确认函数。

组件名称为 `ZtVTableGrid`，公开导出路径沿用 zt-ui 统一入口。首版不提升 npm 版本，也不发布 npm 或 GitHub。

## 依赖边界

- `vue`、`@visactor/vtable` 和 `@visactor/vue-vtable` 作为 peer dependencies。
- `@visactor/vtable-editors` 用于文本、数字、日期和下拉编辑器，同样作为 peer dependency。
- 组件内部复用 `ZtButton`、`ZtCheckbox` 和 `ZtPagination`。
- 图标使用组件内 SVG。
- 不引入 `vxe-pc-ui`、`element-plus`、`@element-plus/icons-vue`、`xe-utils` 或 BIP 路径别名。

## 组件结构

实现拆成职责单一的文件：

- `ZtVTableGrid.vue`：组合工具栏、表格、分页、加载态和事件。
- `types.ts`：公共泛型类型、Props、Events、Slots 和 Expose。
- `data.ts`：远程查询结果、分页和排序的归一化。
- `selection.ts`：跨页选择状态。
- `editing.ts`：编辑草稿、差异和批量保存负载。
- `columns.ts`：选择列、业务列、操作列和固定列转换。
- `summary.ts`：前端汇总计算。
- `csv.ts`：CSV 导出。
- `vtable-grid.scss`：zt-ui 视觉样式和响应式布局。

这些纯函数先由单元测试覆盖，Vue 组件负责将它们连接到 VTable。

## 公开 API

### Props

- `columns`：业务列定义，支持 `field`、`title`、宽度、固定列、排序、格式化、编辑器和汇总规则。
- `records`：本地数据。没有 `proxyConfig` 时直接展示。
- `proxyConfig`：远程查询函数，接收 `{ page, pageSize, sort, form }`，返回 `{ data, total, summaryData? }`。
- `formData`：透传给远程查询的查询条件对象；搜索 UI 由 `form` 插槽提供。
- `pagination`：`boolean | { pageSize?, pageSizes?, layout?, background? }`，默认开启。
- `currentPage`、`pageSize`：支持 `v-model`，未绑定时使用内部状态。
- `rowKey`：字段名或取值函数，默认 `id`。
- `height`、`size`、`loading`、`autoLoad`、`disabled`。
- `checkbox`、`reserveCheckbox`：启用选择列和跨页保留选择。
- `actionButtons`、`showActionsColumn`：标准或自定义行操作。
- `editable`、`batchSave`：启用编辑和可选的批量保存函数。
- `summary`：汇总行标题、范围和展示设置。
- `columnSettings`：列显隐、排序及可选本地持久化。
- `toolbar`：默认工具栏按钮数组，支持 `create`、`import`、`export`、`columnsetting`、`reload`。
- `tableOptions`：安全透传给 `ListTable` 的其他配置，不允许覆盖 records、columns 和 pagination。

### Events

- `update:currentPage`、`update:pageSize`
- `loaded`、`error`、`page-change`、`sort-change`
- `selection-change`
- `action`、`create`、`import`、`export`
- `cell-change`、`save`、`save-error`
- `row-click`、`row-dblclick`
- `column-settings-change`

### Slots

- `form`：参数包含 `formData`、`query`、`reload`。
- `toolbar-left`、`toolbar-right`：参数包含查询方法和已选记录。
- `empty`、`loading`、`pager-left`。
- `edit-actions`：自定义保存/取消区域。

Canvas 单元格不接收普通 DOM 插槽；复杂单元格通过 VTable 原生 `customLayout` 或列 `formatter` 配置实现，避免创建不可靠的 Vue DOM 覆盖层。

### Expose

- `query(resetPage?)`、`reload()`
- `setRecords(records, total?)`
- `getTableInstance()`
- `getSelectedRows()`、`clearSelection()`
- `getChanges()`、`saveChanges()`、`cancelChanges()`
- `exportCsv(filename?)`

## 数据流

本地模式监听 `records` 并同步到 VTable。远程模式在首次挂载、分页、排序或 `query()` 时调用 `proxyConfig`；每次请求分配递增标识，只接受最后一次请求结果，避免慢请求覆盖新数据。失败保留现有数据，关闭加载态并触发 `error`。

分页使用 zt-ui 的 `ZtPagination`。组件维护内部页码和页大小，同时发出 v-model 事件。改变页大小时将页码收敛到有效范围。

选择状态以 `rowKey` 为键保存。关闭 `reserveCheckbox` 时翻页清空选择；删除或替换本地记录时清理已不存在的选择。

编辑开始时记录行快照。单元格提交后只保存实际变化字段；恢复为原值时删除对应差异。`saveChanges()` 调用 `batchSave`，成功后刷新快照并触发 `save`，失败保留草稿并触发 `save-error`。

## 工具栏与导入导出

默认工具栏使用 zt-ui 按钮和内置 SVG。`create` 与 `import` 只触发事件，由业务应用决定打开何种表单或解析何种文件。`export` 默认导出当前已加载数据为 UTF-8 CSV，并同时触发 `export` 事件；使用者可在事件中接管更复杂的 XLSX 或服务端导出。

列设置使用原生弹出面板与 `ZtCheckbox`，支持显隐、拖动排序和重置。配置 `storageKey` 后仅在浏览器本地存储字段顺序和可见性。

## 可访问性与样式

- 工具栏、列设置面板、加载态和分页具有中文 ARIA 标签。
- 所有 DOM 控件支持键盘操作和可见焦点。
- VTable Canvas 的键盘能力由 VTable 配置开启。
- 样式使用 zt-ui tokens，提供 `large/default/medium/small/mini` 五档密度。
- 窄屏允许工具栏换行，并保证分页区域横向滚动。
- 遵循 `prefers-reduced-motion`。

## 测试与演示

单元测试覆盖：

- 远程查询参数、竞态和错误。
- 本地与远程分页。
- 排序事件与刷新。
- 跨页选择。
- 编辑差异、保存成功和失败。
- 汇总算法。
- 列显隐、排序和持久化。
- CSV 转义和导出内容。
- 工具栏事件、空数据、加载态和公开方法。

演示站新增 `/vtable-grid` 页面，至少提供基础表格、远程分页与排序、选择与操作列、编辑与保存、汇总与列设置五组可复制的 Vue + TypeScript 示例，并提供 Props、Events、Slots 和 Expose 文档。

## 完成标准

- zt-ui 不包含 VXE、Element Plus 或 BIP 私有导入。
- 公共类型从包入口可用。
- 组件测试、全库测试、类型检查、库构建、文档站测试和文档站构建全部通过。
- 浏览器检查演示页的主要布局与交互。
- 工作区保留本地实现，不执行 npm publish、git push 或 GitHub 操作。
