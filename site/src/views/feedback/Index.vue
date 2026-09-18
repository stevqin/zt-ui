<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue'
import Basic from './Basic.vue'
import BasicCode from './Basic.vue?raw'
</script>

<template>
  <article class="doc-section">
    <h1>Feedback 命令式反馈</h1>
    <p>全局 Message、Notification、MessageBox 和全屏 Loading 由独立包 <a href="https://www.npmjs.com/package/@ztechjs/zt-alert" target="_blank" rel="noreferrer">@ztechjs/zt-alert</a> 提供。直接安装并从该包导入；zt-ui 不重新导出这些命令式 API。</p>
    <h2>安装与导入</h2>
    <pre><code>npm install @ztechjs/zt-alert</code></pre>
    <p>在应用入口引入 @ztechjs/zt-alert/style.css。下面的源码包含样式导入和可运行调用，参数与返回值请参阅独立包文档。</p>
    <h2>直接调用独立反馈库</h2>
    <DemoBlock :code="BasicCode" desc="消息与通知返回可关闭的 ID；confirm 返回布尔结果；全屏加载使用 open() 返回的实例关闭。它们属于 @ztechjs/zt-alert。"><Basic /></DemoBlock>
    <h2>声明式组件继续使用 zt-ui</h2>
    <p><RouterLink to="/loading">ZtLoading 区域加载</RouterLink> 通过 Vue 模板中的 loading 状态控制，只覆盖局部内容。SelectBox 的远程分页列表使用该组件，批量匹配完成提示使用独立包的 Message。</p>
    <p><RouterLink to="/alert">ZtAlert</RouterLink> 保留页面内提示；<RouterLink to="/modal">ZtModal</RouterLink> 与 <RouterLink to="/drawer">ZtDrawer</RouterLink> 继续提供由响应式状态控制的声明式浮层。独立包的全屏加载在示例中使用别名 ZtFullscreenLoading，避免与局部 ZtLoading 混淆。</p>
  </article>
</template>
