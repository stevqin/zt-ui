# Zt UI

**简体中文（主文档）** · [English](./README.en.md)

面向 Vue 3 中后台应用的 UI 组件库，以 TypeScript 和玻璃拟态视觉为基础，适用于管理后台、数据工作台、业务表单与报表系统。

[在线文档](https://stevqin.github.io/zt-ui/) · [快速开始](https://stevqin.github.io/zt-ui/#/getting-started) · [组件演示](https://stevqin.github.io/zt-ui/#/components) · [更新日志](./CHANGELOG.md)

## 特性

- **统一设计**：柔和高光、半透明表面与弹性动效，保持一致的视觉和操作体验。
- **主题定制**：支持明暗主题、五档尺寸、全局圆角与 CSS 变量，适配不同业务密度。
- **业务场景**：覆盖布局、表单、数据展示、导航、反馈、浮层与媒体，支持复杂选择、表单校验和高性能表格。
- **TypeScript**：提供组件属性、事件、插槽与实例类型，支持编辑器提示。
- **交互体验**：支持响应式布局、键盘操作、焦点管理及减少动态效果偏好。
- **可运行示例**：文档站提供交互演示、可复制源码、场景方案和完整 API。

## 安装

在 Vue 3.5+ 项目中安装：

```bash
npm install @ztechjs/zt-ui
```

当前包同时声明 VisActor 表格包为同行依赖，依赖版本与安装说明见[快速开始](https://stevqin.github.io/zt-ui/#/getting-started)。

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

通过 `ZtConfigProvider` 统一设置尺寸、主题和圆角，组件显式配置可覆盖默认值。更多配置见[全局配置](https://stevqin.github.io/zt-ui/#/config-provider)。

## 文档与示例

完整使用方法、交互效果和 API 均在 [GitHub Pages 文档站](https://stevqin.github.io/zt-ui/)中提供：

- [组件演示](https://stevqin.github.io/zt-ui/#/components)：浏览组件、体验交互并复制示例。
- [场景方案](https://stevqin.github.io/zt-ui/#/scenarios)：表单录入、查询筛选、数据列表和浮层编辑。
- [设计基础](https://stevqin.github.io/zt-ui/#/foundations)：主题、尺寸、圆角与状态色。
- [通用约定](https://stevqin.github.io/zt-ui/#/conventions)：属性、事件和交互规范。
- [API 参考](https://stevqin.github.io/zt-ui/#/api)：组件参数、事件、插槽和类型。
- [命令式反馈](https://stevqin.github.io/zt-ui/#/feedback)：独立反馈库 `@ztechjs/zt-alert` 的接入方式。

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
