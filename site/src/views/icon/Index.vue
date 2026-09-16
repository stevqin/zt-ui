<script setup lang="ts">
import { ZtIcon, ztIconNames } from '@ztechjs/zt-ui'
import type { ZtComponentSize, ZtIconName, ZtIconStatus } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
const sizes:ZtComponentSize[]=['mini','small','default','medium','large']
const statuses:ZtIconStatus[]=['default','primary','success','warning','danger','info']
const galleryCode=sfc("import { ZtIcon, ztIconNames } from '@ztechjs/zt-ui'",'<div class="icon-grid">\n  <div v-for="name in ztIconNames" :key="name">\n    <ZtIcon :name="name" :label="name" />\n    <span>{{ name }}</span>\n  </div>\n</div>')
const sizeCode=sfc("import { ZtIcon } from '@ztechjs/zt-ui'\nimport type { ZtComponentSize } from '@ztechjs/zt-ui'\nconst sizes: ZtComponentSize[] = ['mini','small','default','medium','large']",'<ZtIcon v-for="size in sizes" :key="size" name="search" :size="size" :label="`${size} 搜索`" />\n<ZtIcon name="image" :size="32" label="图片" />')
const statusCode=sfc("import { ZtIcon } from '@ztechjs/zt-ui'\nimport type { ZtIconStatus } from '@ztechjs/zt-ui'\nconst statuses: ZtIconStatus[] = ['default','primary','success','warning','danger','info']",'<ZtIcon v-for="status in statuses" :key="status" name="info" :status="status" :label="status" />')
const motionCode=sfc("import { ZtIcon, ZtRefreshIcon } from '@ztechjs/zt-ui'",'<ZtIcon name="arrow-right" :rotate="45" label="旋转箭头" />\n<ZtIcon name="refresh" spin label="加载中" />\n<ZtIcon color="#7c3aed" :size="28" label="自定义刷新"><ZtRefreshIcon /></ZtIcon>')
</script>
<template><div class="doc-section">
 <h1>Icon 图标</h1><p>统一图标尺寸、颜色和无障碍语义。内置图标使用 currentColor，也可传入 Vue 组件或使用默认插槽。</p>
 <h2>内置图标</h2><DemoBlock :code="galleryCode"><div class="icon-grid"><div v-for="name in ztIconNames" :key="name"><ZtIcon :name="name as ZtIconName" :label="name"/><span>{{name}}</span></div></div></DemoBlock>
 <h2>尺寸</h2><DemoBlock :code="sizeCode"><div class="icon-row"><ZtIcon v-for="size in sizes" :key="size" name="search" :size="size" :label="`${size} 搜索`"/><ZtIcon name="image" :size="32" label="图片"/></div></DemoBlock>
 <h2>主题颜色</h2><DemoBlock :code="statusCode"><div class="icon-row"><ZtIcon v-for="status in statuses" :key="status" name="info" :status="status" :label="status"/></div></DemoBlock>
 <h2>旋转、自定义颜色与组件</h2><DemoBlock :code="motionCode"><div class="icon-row"><ZtIcon name="arrow-right" :rotate="45" label="旋转箭头"/><ZtIcon name="refresh" spin label="加载中"/><ZtIcon color="#7c3aed" :size="28" label="自定义刷新"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 7v5h-5M4 17v-5h5M6 8a7 7 0 0 1 12-2"/></svg></ZtIcon></div></DemoBlock>
 <h2>API</h2><p>无 label 的图标被视为装饰内容并设置 aria-hidden。交互行为应由 Button、Link 等语义组件承载。</p><p><RouterLink to="/api/icon">查看完整 Props、Slots 和类型定义 →</RouterLink></p>
</div></template>
<style scoped>.icon-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px}.icon-grid>div{display:flex;align-items:center;gap:9px;padding:10px;border:1px solid var(--zt-border);border-radius:var(--zt-radius);font-size:12px}.icon-row{display:flex;align-items:center;gap:22px;flex-wrap:wrap}.icon-row :deep(svg){stroke-linecap:round;stroke-linejoin:round}</style>
