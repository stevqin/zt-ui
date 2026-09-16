<script setup lang="ts">
import { ref } from 'vue'
import { ZtInputNumber } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const count = ref<number | null>(1)
const bounded = ref<number | null>(5)
const precise = ref<number | null>(1.25)
const imports = `import { ref } from 'vue'\nimport { ZtInputNumber } from '@ztechjs/zt-ui'`
const codeBasic = sfc(`${imports}\n\nconst value = ref<number | null>(1)`, `<ZtInputNumber v-model="value" />\n<span>当前值：{{ value }}</span>`)
const codeBounds = sfc(`${imports}\n\nconst value = ref<number | null>(5)`, `<ZtInputNumber v-model="value" :min="0" :max="10" :step="2" />`)
const codePrecision = sfc(`${imports}\n\nconst value = ref<number | null>(1.25)`, `<ZtInputNumber v-model="value" :min="0" :max="10" :step="0.25" :precision="2" step-strictly />`)
const codeControls = sfc(`${imports}\n\nconst value = ref<number | null>(3)`, `<ZtInputNumber v-model="value" controls-position="default" />\n<ZtInputNumber v-model="value" controls-position="left" />\n<ZtInputNumber v-model="value" controls-position="right" />\n<ZtInputNumber v-model="value" :controls="false" />`)
const codeSize = sfc(`${imports}\n\nconst value = ref<number | null>(8)`, `<ZtInputNumber v-model="value" size="mini" />\n<ZtInputNumber v-model="value" size="small" />\n<ZtInputNumber v-model="value" size="default" />\n<ZtInputNumber v-model="value" size="medium" />\n<ZtInputNumber v-model="value" size="large" />`)
const codeStates = sfc(`${imports}\n\nconst value = ref<number | null>(8)`, `<ZtInputNumber v-model="value" disabled />\n<ZtInputNumber v-model="value" readonly />`)
</script>

<template>
  <div class="doc-section number-doc">
    <h1>InputNumber 数字输入框</h1><p>使用按钮、键盘方向键或直接输入来调整数值。</p>
    <h2>基础用法</h2><DemoBlock :code="codeBasic" desc="使用 v-model 绑定 number 或 null。"><div class="number-demo-row"><ZtInputNumber v-model="count" /><span>当前值：{{ count ?? '空' }}</span></div></DemoBlock>
    <h2>范围与步进</h2><DemoBlock :code="codeBounds" desc="min、max 限制范围，step 设置每次增减量。"><ZtInputNumber v-model="bounded" :min="0" :max="10" :step="2" /></DemoBlock>
    <h2>精度与严格步进</h2><DemoBlock :code="codePrecision" desc="precision 固定小数位；step-strictly 将输入校准到步进倍数。"><ZtInputNumber v-model="precise" :min="0" :max="10" :step="0.25" :precision="2" step-strictly /></DemoBlock>
    <h2>控制按钮布局</h2><DemoBlock :code="codeControls" desc="default 将按钮分置两侧，left 和 right 将按钮堆叠在指定一侧；也可以完全隐藏。"><div class="number-demo-row"><ZtInputNumber v-model="count" controls-position="default" /><ZtInputNumber v-model="count" controls-position="left" /><ZtInputNumber v-model="count" controls-position="right" /><ZtInputNumber v-model="count" :controls="false" /></div></DemoBlock>
    <h2>尺寸</h2><DemoBlock :code="codeSize" desc="支持 mini、small、default、medium、large 五档尺寸。"><div class="number-demo-row"><ZtInputNumber :model-value="8" size="mini" /><ZtInputNumber :model-value="8" size="small" /><ZtInputNumber :model-value="8" size="default" /><ZtInputNumber :model-value="8" size="medium" /><ZtInputNumber :model-value="8" size="large" /></div></DemoBlock>
    <h2>禁用与只读</h2><DemoBlock :code="codeStates" desc="disabled 禁止所有交互，readonly 保留聚焦能力并禁用增减。"><div class="number-demo-row"><ZtInputNumber :model-value="8" disabled /><ZtInputNumber :model-value="8" readonly /></div></DemoBlock>

    <h2>API</h2><h3>Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>v-model</code></td><td><code>number | null</code></td><td><code>null</code></td><td>绑定数值</td></tr><tr><td><code>min / max</code></td><td><code>number</code></td><td><code>-Infinity / Infinity</code></td><td>数值范围</td></tr><tr><td><code>step</code></td><td><code>number</code></td><td><code>1</code></td><td>步进值</td></tr><tr><td><code>precision</code></td><td><code>number</code></td><td>—</td><td>小数精度</td></tr><tr><td><code>stepStrictly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>输入值必须是步进倍数</td></tr><tr><td><code>controls</code></td><td><code>boolean</code></td><td><code>true</code></td><td>显示增减按钮</td></tr><tr><td><code>controlsPosition</code></td><td><code>default | left | right</code></td><td><code>default</code></td><td>按钮分置、左侧堆叠或右侧堆叠</td></tr><tr><td><code>size</code></td><td><code>mini | small | default | medium | large</code></td><td><code>default</code></td><td>尺寸</td></tr><tr><td><code>disabled / readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用或只读</td></tr></tbody></table>
    <h3>Events</h3><table class="doc-table"><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody><tr><td><code>input</code></td><td><code>value</code></td><td>输入有效数值</td></tr><tr><td><code>change</code></td><td><code>(value, oldValue)</code></td><td>提交、增减或按方向键</td></tr><tr><td><code>focus / blur</code></td><td><code>FocusEvent</code></td><td>焦点变化</td></tr></tbody></table>
  </div>
</template>

<style scoped>.number-demo-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; } .number-demo-row > span { color: #6b7280; font-size: 13px; }</style>
