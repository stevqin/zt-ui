<script setup lang="ts">
import { ref } from 'vue'
import { ZtProgress, ZtSlider } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
const percent=ref(45)
const code=sfc("import { ref } from 'vue'\nimport { ZtProgress, ZtSlider } from '@ztechjs/zt-ui'\nconst percent = ref(45)",'<ZtSlider :model-value="percent" @update:model-value="value => { if (typeof value === \'number\') percent = value }" />\n<ZtProgress :percentage="percent" />')
const statusCode=sfc("import { ZtProgress } from '@ztechjs/zt-ui'",'<ZtProgress :percentage="100" status="success" />\n<ZtProgress :percentage="65" status="warning" />\n<ZtProgress :percentage="30" status="danger" />')
const loadingCode=sfc("import { ZtProgress } from '@ztechjs/zt-ui'",'<ZtProgress indeterminate aria-label="文件上传" />')
const formatCode=sfc("import { ZtProgress } from '@ztechjs/zt-ui'",'<ZtProgress :percentage="75" :format="value => `已完成 ${value}%`" size="large" />')
</script>
<template><div class="doc-section">
 <h1>Progress 进度条</h1><p>展示任务完成比例，支持状态颜色、尺寸和不确定进度。颜色搭配文字，让用户理解任务状态。</p>
 <h2>可调进度</h2><DemoBlock :code="code"><ZtSlider :model-value="percent" @update:model-value="value => { if (typeof value === 'number') percent = value }" aria-label="调整完成率" /><ZtProgress :percentage="percent" aria-label="任务完成率" /></DemoBlock>
 <h2>状态颜色</h2><DemoBlock :code="statusCode"><div class="progress-examples"><ZtProgress :percentage="100" status="success" /><ZtProgress :percentage="65" status="warning" /><ZtProgress :percentage="30" status="danger" /></div></DemoBlock>
 <h2>不确定进度</h2><DemoBlock :code="loadingCode" desc="用于尚未获得总量的任务。此时不报告虚假的百分比，系统减少动画偏好会停用循环动画。"><ZtProgress indeterminate aria-label="文件上传" /></DemoBlock>
 <h2>尺寸与格式化</h2><DemoBlock :code="formatCode"><ZtProgress :percentage="75" :format="value => `已完成 ${value}%`" size="large" /></DemoBlock>
 <h2>API</h2><p>percentage 自动限制到 0–100，非有限数按 0 处理；不会自动把 100% 改成 success，请根据业务结果设置 status。默认插槽可接收 percentage 并替换可见文本，format 同时影响辅助技术读数。</p><p><RouterLink to="/api/progress">查看完整 Props、Slots 和类型定义 →</RouterLink></p>
</div></template>
<style scoped>.progress-examples{display:grid;gap:22px}</style>
