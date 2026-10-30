# Zt UI 文档站重建实施计划

**目标：** 删除旧站实现与站点专属开发记录，从当前组件源码重建全部文档与示例。
**架构：** 独立文档外壳消费内容清单、独立 Vue 示例与自动 API 契约；全局 ConfigProvider 统一控制 size、borderRadius 和 theme。
**技术：** Vue 3、TypeScript、Vite、Vue Router、SCSS、Vitest、TypeScript Compiler API。
**设计：** `docs/superpowers/specs/2026-10-30-site-documentation-redesign.md`

## 约束

- 组件库源码与公开契约不改动；从零编写站点内容和示例，不复制旧站页面、示例、元数据和生成器。
- 中文文档，组件英文名称；浅色/暗色文档壳、五档尺寸、0–24px 圆角，默认 default/11px/系统主题。
- 单列文档，左侧分类、右侧目录、64px 页头；960px 移动导航与1200px 目录断点。
- 旧记录清理只针对站点；保留独立组件资料和 Git 历史。
- 不添加对话、执行流水或 AI 指令到产品代码、注释和技术资料。

## 重点边界

- 外观变化不能重建示例或丢失 VTableGrid 草稿；覆盖跨页、刷新和 Teleport。
- 复制完整示例必须包含当前 Provider 配置并通过 SFC 编译；不可依赖站点状态。
- 公共子组件和 Canvas 子入口必须具有明确文档归属，不得遗漏公开契约。
- 删除旧 site 后，库测试和契约审计不能依赖旧路径或放弃校验。
- 搜索、导航、设置与示例浮层各自处理焦点、Escape 和清理。

## 1. 清理与脚手架

文件：旧 `site/`，站点专属 `docs/superpowers/` 与 `docs/qa/`，新的 site/package.json、Vite/Vitest/TS 配置。

- [x] 对照 Git 基线和现有契约，检查旧站引用。
- [x] 删除旧站源码、脚本、测试、生成数据和站点专属历史记录。
- [x] 建立全新 Vue/Vite 站点与类型 `DocPage`、`DocExample`、`ApiComponent`。

## 2. 新组件内容与示例

文件：`site/src/content/components.ts`、`site/src/content/pages-a.ts`、`pages-b.ts`、`site/src/examples/`。
接口：每组导出 `DocPage[]`；示例元数据 `id,title,description,file`，运行组件与源码由统一容器加载，文件由 import.meta.glob 加载。

- [x] 按当前导出和类型清单重新编写所有组件说明。
- [x] 按基础/布局/媒体/导航与表单/数据/浮层分组编写独立 SFC 示例。
- [x] 为复杂组件覆盖关键能力，源码包含数据、事件、样式和模拟请求。
- [x] 验证 SFC 编译、示例挂载及主要交互。

## 3. API 与覆盖检查

文件：`site/scripts/extract-api.mjs`、`site/src/generated/api.json`、`site/tests/api.spec.ts`、库审计脚本及相关测试。
接口：JSON `Record<pageId,{components:ApiComponent[]}>`；ApiComponent 包含 name、props、events、slots、exposes、types。

- [x] 先用临时源码验证组合/导入类型、泛型、默认值、事件/插槽/方法及导出覆盖的失败场景。
- [x] 从库源码与类型生成契约，人工说明独立维护，不复制旧元数据。
- [x] 更新库审计与测试的路径和接口，保留所有现有检查意图。
- [x] 验证未知导出/缺少属性/错误类型会失败，正确清单通过。

## 4. 外壳、全局设置和文档交互

文件：`site/src/app/`、`layouts/`、`components/`、`styles/`、`content/guides.ts`。
接口：全局 settings `{size,borderRadius,theme,themePreference}`，Provider 使用 light/dark；每个示例通过稳定 key 隔离重置。

- [x] 先测试配置合法性/存储失败/系统主题、复制源码编译和旧链接解析。
- [x] 实现首页、指南、总览、组件页、API 表格、目录、搜索、移动导航。
- [x] 实现全局设置面板和持久化、代码高亮/复制/重置、局部显式覆盖说明。
- [x] 验证 Escape/焦点恢复、状态不丢失、目录锚点及空搜索。

## 5. 集成与验收

文件：Pages 工作流、README 双语入口、新站/库测试与验收记录。

- [x] 完成所有导出的文档归属、全部示例编译/挂载及失效引用检查。
- [x] 库全量测试、类型检查、四格式构建、契约审计。
- [x] 新站测试、类型检查和生产构建；Pages base/hash 深链验证。
- [x] 实际浏览器逐路由检查、关键业务交互、搜索/设置/复制，明暗/五档尺寸/代表圆角/移动端。
- [x] 独立消费复制示例验证；独立最终审阅并修复重要问题。
- [x] 切换4185到新版，清理已合并旧站副本和专属本地草稿，交付可审阅的本地工作区。
