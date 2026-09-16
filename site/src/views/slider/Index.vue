<script setup lang="ts">
import { ref } from 'vue'
import { ZtSlider } from '@ztechjs/zt-ui'
import type { ZtSliderValue } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
const value=ref<ZtSliderValue>(35),range=ref<ZtSliderValue>([20,70]),decimal=ref<ZtSliderValue>(0.3)
const code=sfc("import { ref } from 'vue'\nimport { ZtSlider } from '@ztechjs/zt-ui'\nconst value = ref(35)",'<ZtSlider v-model="value" aria-label="音量" />')
const rangeCode=sfc("import { ref } from 'vue'\nimport { ZtSlider } from '@ztechjs/zt-ui'\nconst value = ref<[number, number]>([20, 70])",'<ZtSlider v-model="value" range :step="5" aria-label="价格区间" />')
const stepCode=sfc("import { ref } from 'vue'\nimport { ZtSlider } from '@ztechjs/zt-ui'\nconst value = ref(0.3)",'<ZtSlider v-model="value" :min="0" :max="1" :step="0.1" />')
const statesCode=sfc("import { ZtSlider } from '@ztechjs/zt-ui'",'<ZtSlider :model-value="65" status="success" size="large" />\n<ZtSlider :model-value="40" disabled />')
</script>
<template><div class="doc-section">
 <h1>Slider 滑块</h1><p>用于音量、数值筛选和范围设置。拖动过程中同步更新数值，松开后触发 change。</p>
 <h2>基础用法</h2><DemoBlock :code="code"><ZtSlider v-model="value" aria-label="音量" /><p>当前值：{{value}}</p></DemoBlock>
 <h2>范围选择</h2><DemoBlock :code="rangeCode" desc="两个滑块不可交叉；点击轨道会调整较近的滑块。"><ZtSlider v-model="range" range :step="5" aria-label="价格区间" /><p>当前范围：{{range}}</p></DemoBlock>
 <h2>小数步长</h2><DemoBlock :code="stepCode"><ZtSlider v-model="decimal" :min="0" :max="1" :step="0.1" aria-label="透明度" /><p>当前值：{{decimal}}</p></DemoBlock>
 <h2>主题、尺寸与禁用</h2><DemoBlock :code="statesCode"><ZtSlider :model-value="65" status="success" size="large" /><ZtSlider :model-value="40" disabled /></DemoBlock>
 <h2>交互与表单</h2><p>方向键按 step 调整，Home / End 跳到端点，PageUp / PageDown 调整十个步长。范围模式下两个滑块独立进入 Tab 顺序。FormItem 内继承尺寸、禁用和标签，提交数值时触发 change 校验。</p><p>min / max 必须为有限数，max 不大于 min 时禁用；步长以 min 为基准，对外输出会修正浮点精度，max 始终可达。showTooltip 可关闭浮动数值提示。</p>
 <h2>API</h2><p><RouterLink to="/api/slider">查看完整 Props、Events 和类型定义 →</RouterLink></p>
</div></template>
