<script setup lang="ts">
import DemoBlock from '../components/DemoBlock.vue'
import { ZtButton } from '@ztechjs/zt-ui'
import { sfc } from '../utils/exampleCode'
import { ref } from 'vue'
const count=ref(0)
const code=sfc("import { ref } from 'vue'\nimport { ZtButton } from '@ztechjs/zt-ui'\nimport '@ztechjs/zt-ui/style.css'\nconst count = ref(0)",'<ZtButton status="primary" @click="count++">点击 {{ count }} 次</ZtButton>')
</script>
<template><article class="doc-section"><span class="doc-eyebrow">GETTING STARTED</span><h1>快速开始</h1><p>在 Vue 3 + TypeScript 项目中使用 Zt UI。</p><h2>安装依赖</h2><p>组件库依赖 Vue 3.5 或以上版本；在已有 Vue 项目中安装：</p><pre class="doc-code"><code>npm install @ztechjs/zt-ui</code></pre><p>使用 VTableGrid 时，还需满足组件库声明的表格依赖：</p><pre class="doc-code"><code>npm install @visactor/vtable@^1.26.7 @visactor/vtable-editors@^1.26.7 @visactor/vue-vtable@^1.26.7</code></pre><h2>引入样式与组件</h2><p>在项目入口引入一次全局样式，在单文件组件中按需导入组件。</p><pre class="doc-code"><code>import '@ztechjs/zt-ui/style.css'
import { ZtButton } from '@ztechjs/zt-ui'</code></pre><h2>配置全局外观</h2><p>在应用根部使用 ConfigProvider 统一尺寸、明暗主题与圆角。组件的显式配置可覆盖全局默认值。</p><pre class="doc-code"><code>&lt;ZtConfigProvider size="default" theme="light" :border-radius="11"&gt;
  &lt;App /&gt;
&lt;/ZtConfigProvider&gt;</code></pre><RouterLink to="/config-provider">查看全局配置与动态体验 →</RouterLink><h2>运行第一个示例</h2><DemoBlock :code="code" desc="点击按钮可修改计数。展开代码获取完整的 Vue 单文件组件。"><ZtButton status="primary" @click="count++">点击 {{count}} 次</ZtButton></DemoBlock><h2>阅读示例与接口</h2><ol class="doc-steps"><li>从场景指南了解多个组件如何配合。</li><li>在组件页尝试交互，复制完整示例。</li><li>通过完整 API 核对值类型、默认值和事件参数。</li></ol><div class="related-links"><RouterLink to="/scenarios">场景指南 →</RouterLink><RouterLink to="/conventions">通用约定 →</RouterLink></div></article></template>
