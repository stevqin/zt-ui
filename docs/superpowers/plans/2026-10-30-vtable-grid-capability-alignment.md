# VTableGrid 功能对齐实施计划

**目标：** 补齐 BIP 的可复用 Grid 能力，保留 zt-ui 现有 API、默认行为和辅助函数契约。
**架构：** 数据状态、列适配、配置式表单和交互面板各自封装；主体连接 Vue 生命周期、VTable 和插槽。Canvas 图元使用独立子入口。
**技术栈：** Vue 3、TypeScript、SCSS、VisActor VTable、Vitest、Vite。
**设计：** `docs/superpowers/specs/2026-10-30-vtable-grid-capability-alignment-design.md`

## 约束与重点

- 本地分页、480px 高度、默认无操作列和刷新工具栏保持不变。
- editable 控制编辑能力，batchEdit 只控制草稿；save 仍在成功后触发，失败 Promise 仍拒绝。
- 不依赖 BIP API、Portal、VXE 或 Element Plus。
- 过期请求、卸载、保存并发与输入快照更新不能清空有效草稿。
- 后端全量汇总缺失字段留空；冻结区域、过滤行及内部记录不能混淆。
- 表格隐藏、缓存、主题更新和图片预览后不得破坏 Canvas 生命周期。

## 1. 公共契约与 Grid 状态

**文件：** `src/components/vtable-grid/types.ts`、`ZtVTableGrid.vue`、`data.ts`、`selection.ts`，`tests/vtable-grid.spec.ts`。
**接口：** 扩展原 Props/Emits/Expose；新增 localPagination、filterMethod、formConfig、optionLoader、toolbarConfig、summaryConfig、batchEdit、originalRecords、saveConfirm、beforeSave、exportMode 和样式配置。

- [x] 添加本地全量/过滤先分页、禁选行、保存确认取消/失败/重复保存、batchEdit=false 和旧 save 事件顺序测试，先观察失败。
- [x] 数据、选择、保存和原始行事件使用同一记录映射；保留旧接口并连接新辅助模块。
- [x] 验证所有 Grid 现有测试和新增行为通过。

## 2. 草稿、汇总和列设置算法

**文件：** `record-changes.ts`、`summary-layout.ts`、`column-settings.ts`，新增对应测试。
**接口：** `getRecordChanges(records, originalRecords, getKey)`；`buildEnhancedSummary(columns, rows, context)` 返回 values/source/scope/label；`resolveSummaryMerge(columns, labelFields)`；列设置 moveTo/get/reset/安全持久化。

- [x] 先测试整表新增/删除/删除全部、后端字段缺失和映射、空值、标题跨冻结区/不连续、损坏存储及排序边界。
- [x] 使用独立快照、稳定键和可见列计算；不改变 `buildSummaryValues()` 原契约。
- [x] 验证算法测试与原 state 测试通过。

## 3. 列、编辑器与 Canvas 内容

**文件：** `columns.ts`、`editors.ts`、`presentation.ts`、`canvas.ts`、`canvas-tag.ts`、`image.ts`，新增对应测试。
**接口：** 列适配保留原 `buildVTableColumns()`；增强 align/resizable/ellipsis/image/checkbox；`resolveGridPresentation(props,size,theme)`；Canvas 子入口导出 Group/Text/Image/CheckBox/Radio/Tag 包装组件。

- [x] 先测试对齐合并对象/函数样式、列宽规则、编辑类型归一化、布尔列和复制；为 Canvas 渲染和标签增加单独测试。
- [x] 暴露可复用列扩展及呈现算法，主 Grid 动态加载 Canvas 内容模块；明确主入口不加载 vue-vtable。
- [x] 验证列/编辑器/公共入口回归及新增测试通过。

## 4. 配置式表单、字典与导入面板

**文件：** `form-types.ts`、`search-form.ts`、`option-loader.ts`、`ZtVTableGridImportDialog.vue`，新增对应测试。
**接口：** `ZtVTableGridFormConfig/FormItem`、`ZtVTableGridOptionLoader`；SearchForm 接收 config/model/size/disabled/optionLoader，发 submit/reset，暴露 Form 实例；导入弹窗 v-model、v-model:file、v-model:loading 和 confirm/template。

- [x] 先测试校验提交/重置、折叠、字段插槽、加载取消/缓存隔离/失败重试和文件类型/拖拽/忙碌关闭保护。
- [x] 使用库内控件，renderer/值转换支持特殊业务格式；不加载 BIP 字典。
- [x] 验证专属测试及表单相关回归通过。

## 5. Grid UI 与底层事件集成

**文件：** `ZtVTableGrid.vue`、`vtable-grid.scss`、`context-menu.ts`、`filter.ts`。
**接口：** 行操作/右键与事件、冻结汇总、列设置拖动、工具栏配置/外部导出/导入面板、字典编辑器；表头筛选仅限已加载记录。

- [x] 先覆盖分页/排序后的记录映射、禁用及保存保护、右键菜单键盘/边界、增强插槽作用域、拖动排序和筛选字段白名单。
- [x] Canvas 事件、记录与选中状态统一映射；图标使用 zt-ui 令牌和图标。
- [x] ResizeObserver 与 onActivated 仅在有效尺寸下 resize，卸载清理监听器和异步更新。
- [x] 验证 Grid 全部专项测试、类型检查及完整组件库测试。

## 6. 子入口与演示、文档

**文件：** `package.json`、`vite.config.ts`、`src/components/vtable-grid/index.ts`、`site/vite.config.ts`、`site/src/views/vtable-grid/`、API 元数据与组件示例清单。

- [x] 为主入口保持延迟加载及新子入口消费建立导入/类型测试。
- [x] 构建 `@ztechjs/zt-ui/vtable` 的 ESM、UMD 和声明入口；组件库公开导入弹窗与新类型。
- [x] 示例覆盖整表草稿、配置式表单/字典、Canvas 插槽、冻结汇总、右键/列设置和样式选项。
- [x] 同步 API、示例清单；README 继续保持精简。

## 7. 完整验证

- [x] 组件库：`npm test -- --maxWorkers=2`、`npm run typecheck`、`npm run build`、`npm run audit:components`。
- [x] 文档站：`npm test -- --maxWorkers=2`、`npm run build`，检查示例与 API 生成结果。
- [x] 真实浏览器：明暗 × 五档尺寸、窄屏、Canvas 选择/编辑/粘贴、图片预览、汇总、右键、冻结列及 KeepAlive。
- [x] 打包并在独立消费者中验证主入口和子入口、CSS、类型及依赖，不使用跨项目链接。
- [x] 独立代码审阅，修复影响功能及兼容性的发现；最终差异表逐项核验。
