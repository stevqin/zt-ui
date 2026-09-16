<script setup lang="ts">
import { scenarios, components } from '../docs/catalog'
</script>
<template>
 <article class="doc-section home-page">
  <div class="home-intro"><span class="doc-eyebrow">ZT UI / VUE 3 COMPONENT SYSTEM</span><h1>从一个组件，<br>到完整的业务界面<span class="title-dot">。</span></h1><p>先找到场景，再组合组件。通过可运行的示例与清晰的接口文档，把业务交互落到代码中。</p><div class="home-actions"><RouterLink class="doc-primary" to="/getting-started">开始使用 <span>→</span></RouterLink><RouterLink class="doc-secondary" to="/components">浏览 {{components.length}} 个组件</RouterLink></div></div>
  <div class="reading-path"><span>你可以从这里开始</span><RouterLink to="/scenarios"><b>有一个业务任务</b><small>查看场景与组合示例 →</small></RouterLink><RouterLink to="/components"><b>寻找一个组件</b><small>浏览用法与交互细节 →</small></RouterLink><RouterLink to="/api"><b>确认一个参数</b><small>直接查阅完整接口 →</small></RouterLink></div>
  <h2>按场景构建</h2><p>把常用的页面工作拆成可复用的交互组合。</p>
  <div class="scene-grid"><RouterLink v-for="s in scenarios" :key="s.id" :to="'/scenarios/'+s.id" class="scene-card"><span class="scene-card__label">{{s.components.length}} 个关联组件</span><h3>{{s.title}} <span>↗</span></h3><p>{{s.description}}</p><div>{{s.components.map(id=>components.find(c=>c.path==='/'+id)?.name).slice(0,3).join(' / ')}}</div></RouterLink></div>
  <h2>一致的使用约定</h2><div class="home-conventions"><div><strong>五档尺寸</strong><p>从紧凑工具栏到宽松表单，以 size 统一控制密度。</p></div><div><strong>语义化状态</strong><p>用主题颜色和文字共同呈现业务状态。</p></div><div><strong>类型与交互</strong><p>理解值类型、表单联动和键盘操作，再开始组合。</p></div></div><RouterLink class="text-link" to="/conventions">阅读通用约定 →</RouterLink>
 </article>
</template>
