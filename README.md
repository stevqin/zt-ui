# Zt UI

**简体中文（主文档）** · [English](./README.en.md)

面向 Vue 3 中后台应用的 UI 组件库，以 TypeScript 和玻璃拟态视觉为基础，适用于管理后台、数据工作台、业务表单与报表系统。

[在线文档](https://stevqin.github.io/zt-ui/) · [快速开始](https://stevqin.github.io/zt-ui/#/guide/quick-start) · [组件演示](https://stevqin.github.io/zt-ui/#/components) · [更新日志](./CHANGELOG.md)

## 特性

- **统一设计**：柔和高光、半透明表面与弹性动效，保持一致的视觉和操作体验。
- **主题定制**：支持明暗主题、五档尺寸、全局圆角与 CSS 变量，适配不同业务密度。
- **业务场景**：覆盖布局、表单、数据展示、导航、反馈、浮层与媒体，支持复杂选择、表单校验和高性能表格。
- **TypeScript**：提供组件属性、事件、插槽与实例类型，支持编辑器提示。
- **交互体验**：支持响应式布局、键盘操作、焦点管理及减少动态效果偏好。
- **可运行示例**：文档站提供交互演示、可复制源码、场景方案和完整 API。

## 业务场景

| 场景 | 组件 | 主要能力 |
| --- | --- | --- |
| 商品详情与下单 | [SkuSelect](https://stevqin.github.io/zt-ui/#/components/sku-select) | 按 SPU → SKC → SKU 选择规格，颜色图片联动、禁用颜色或尺码、受控回显；主图自适应并支持隐藏，适配 PC 与移动端。 |
| PC 订货与配货 | [SkuInput](https://stevqin.github.io/zt-ui/#/components/sku-input) | 颜色 × 尺码数量矩阵，自动合并尺码列、对象或数组绑定、键盘录入、Excel 矩形粘贴及行列汇总；列宽与尺寸自适应，可隐藏商品信息。 |
| 业务说明与引用 | [Blockquote](https://stevqin.github.io/zt-ui/#/components/blockquote) | 通过语义色和强调边线展示操作说明、引用与备注，支持标题、正文、来源说明和嵌套内容。 |
| 查询报表与批量维护 | [VTableGrid](https://stevqin.github.io/zt-ui/#/components/vtable-grid) | Canvas 表格整合查询表单、分页、草稿编辑、导入导出和任务状态，支持单元格、表头、操作列及工具栏扩展。 |
| 常规列表与统计 | [Table](https://stevqin.github.io/zt-ui/#/components/table) | 列筛选、序号、汇总、合并单元格、当前行高亮、溢出提示及自定义行列样式。 |
| 复杂业务录入 | [Form](https://stevqin.github.io/zt-ui/#/components/form) | 字段布局与分组、动态嵌套数据、同步或异步校验、局部校验与重置、服务端错误反馈。 |

具体数据结构、使用代码和 API 请查看对应组件页面。

## 安装

在 Vue 3.5+ 项目中安装：

```bash
npm install @ztechjs/zt-ui
```

当前包同时声明 VisActor 表格包为同行依赖，依赖版本与安装说明见[快速开始](https://stevqin.github.io/zt-ui/#/guide/quick-start)。

## 快速开始

在应用入口引入一次样式：

```ts
import '@ztechjs/zt-ui/style.css'
```

在 Vue 单文件组件中导入并使用：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZtButton, ZtConfigProvider } from '@ztechjs/zt-ui'

const count = ref(0)
</script>

<template>
  <ZtConfigProvider size="default" theme="light" :border-radius="11">
    <ZtButton status="primary" @click="count++">
      点击 {{ count }} 次
    </ZtButton>
  </ZtConfigProvider>
</template>
```

通过 `ZtConfigProvider` 统一设置尺寸、主题和圆角，组件显式配置可覆盖默认值。额外焦点环默认关闭；设置 `focus-ring="keyboard"` 仅在键盘操作时显示，`focus-ring="all"` 在所有聚焦时显示，`focus-ring="none"` 关闭。浮层继承所属配置，焦点与键盘交互始终可用。更多配置见[全局配置](https://stevqin.github.io/zt-ui/#/components/config-provider)。

## 文档与示例

完整使用方法、交互效果和 API 均在 [GitHub Pages 文档站](https://stevqin.github.io/zt-ui/)中提供：

- [组件演示](https://stevqin.github.io/zt-ui/#/components)：浏览组件、体验交互并复制示例。
- [主题与样式](https://stevqin.github.io/zt-ui/#/guide/theme)：明暗主题和组件外观。
- [全局配置](https://stevqin.github.io/zt-ui/#/guide/configuration)：统一设置尺寸、圆角和主题。
- [命令式反馈](https://stevqin.github.io/zt-ui/#/extensions)：独立反馈库 `@ztechjs/zt-alert` 的接入方式。

## 本地开发

```bash
npm install
npm test
npm run build
```

启动本地文档站：

```bash
cd site
npm install
npm run dev
```

## License

[MIT](./LICENSE) © ztech
