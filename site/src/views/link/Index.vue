<script setup lang="ts">
import { ZtLink } from '@ztechjs/zt-ui'
import type { ZtComponentSize, ZtLinkStatus } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
const statuses:ZtLinkStatus[]=['default','primary','success','warning','danger','info']
const sizes:ZtComponentSize[]=['mini','small','default','medium','large']
const basicCode=sfc("import { ZtLink } from '@ztechjs/zt-ui'",'<ZtLink href="https://example.com" target="_blank">打开外部链接</ZtLink>\n<ZtLink href="/guide" underline="always">始终显示下划线</ZtLink>\n<ZtLink disabled href="/delete">禁用链接</ZtLink>')
const statusCode=sfc("import { ZtLink } from '@ztechjs/zt-ui'\nimport type { ZtLinkStatus } from '@ztechjs/zt-ui'\nconst statuses: ZtLinkStatus[] = ['default','primary','success','warning','danger','info']",'<ZtLink v-for="status in statuses" :key="status" href="#" :status="status">{{ status }}</ZtLink>')
const sizeCode=sfc("import { ZtLink } from '@ztechjs/zt-ui'\nimport type { ZtComponentSize } from '@ztechjs/zt-ui'\nconst sizes: ZtComponentSize[] = ['mini','small','default','medium','large']",'<ZtLink v-for="size in sizes" :key="size" href="#" :size="size" icon="home" suffix-icon="arrow-right">{{ size }}</ZtLink>')
</script>
<template><div class="doc-section"><h1>Link 链接</h1><p>用于页面跳转或资源导航，支持原生链接、可选 Vue Router、图标、禁用和安全的外部链接。</p><h2>基础用法</h2><DemoBlock :code="basicCode"><div class="link-row"><ZtLink href="https://example.com" target="_blank">打开外部链接</ZtLink><ZtLink href="/guide" underline="always">始终显示下划线</ZtLink><ZtLink disabled href="/delete">禁用链接</ZtLink></div></DemoBlock><h2>状态颜色</h2><DemoBlock :code="statusCode"><div class="link-row"><ZtLink v-for="status in statuses" :key="status" href="#" :status="status">{{status}}</ZtLink></div></DemoBlock><h2>尺寸与图标</h2><DemoBlock :code="sizeCode"><div class="link-row"><ZtLink v-for="size in sizes" :key="size" href="#" :size="size" icon="home" suffix-icon="arrow-right">{{size}}</ZtLink></div></DemoBlock></div></template>
<style scoped>.link-row{display:flex;align-items:center;gap:20px;flex-wrap:wrap}</style>
