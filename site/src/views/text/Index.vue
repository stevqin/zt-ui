<script setup lang="ts">
import { ZtText } from '@ztechjs/zt-ui'
import type { ZtComponentSize, ZtTextStatus } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
const statuses:ZtTextStatus[]=['default','primary','success','warning','danger','info']
const sizes:ZtComponentSize[]=['mini','small','default','medium','large']
const statusCode=sfc("import { ZtText } from '@ztechjs/zt-ui'\nimport type { ZtTextStatus } from '@ztechjs/zt-ui'\nconst statuses: ZtTextStatus[] = ['default','primary','success','warning','danger','info']",'<ZtText v-for="status in statuses" :key="status" :status="status">{{ status }} 文本</ZtText>')
const sizeCode=sfc("import { ZtText } from '@ztechjs/zt-ui'\nimport type { ZtComponentSize } from '@ztechjs/zt-ui'\nconst sizes: ZtComponentSize[] = ['mini','small','default','medium','large']",'<ZtText v-for="size in sizes" :key="size" :size="size" weight="semibold">{{ size }} 文本</ZtText>')
const overflowCode=sfc("import { ZtText } from '@ztechjs/zt-ui'",'<ZtText truncated>单行内容过长时使用省略号，并保留完整 title。</ZtText>\n<ZtText :line-clamp="2" tag="p">多行内容超过指定行数后截断。适合卡片摘要、备注和列表说明。</ZtText>')
const semanticCode=sfc("import { ZtText } from '@ztechjs/zt-ui'",'<ZtText tag="strong">强调内容</ZtText>\n<ZtText tag="code">const total = 8</ZtText>\n<ZtText tag="mark">重点标记</ZtText>')
</script>
<template><div class="doc-section"><h1>Text 文本</h1><p>统一正文的语义标签、字号、状态色、字重和溢出处理，不改变父容器布局。</p><h2>状态颜色</h2><DemoBlock :code="statusCode"><div class="text-row"><ZtText v-for="status in statuses" :key="status" :status="status">{{status}} 文本</ZtText></div></DemoBlock><h2>尺寸与字重</h2><DemoBlock :code="sizeCode"><div class="text-row"><ZtText v-for="size in sizes" :key="size" :size="size" weight="semibold">{{size}} 文本</ZtText></div></DemoBlock><h2>文本省略</h2><DemoBlock :code="overflowCode"><div class="text-limit"><ZtText truncated>单行内容过长时使用省略号，并保留完整 title。</ZtText><ZtText :line-clamp="2" tag="p">多行内容超过指定行数后截断。适合卡片摘要、备注和列表说明。这里增加更多内容来展示两行后的省略效果。</ZtText></div></DemoBlock><h2>语义标签</h2><DemoBlock :code="semanticCode"><div class="text-row"><ZtText tag="strong">强调内容</ZtText><ZtText tag="code">const total = 8</ZtText><ZtText tag="mark">重点标记</ZtText></div></DemoBlock></div></template>
<style scoped>.text-row{display:flex;align-items:center;gap:20px;flex-wrap:wrap}.text-limit{display:grid;gap:18px;width:min(360px,100%)}</style>
