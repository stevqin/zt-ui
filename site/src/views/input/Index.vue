<script setup lang="ts">
import { ref } from 'vue'
import { ZtInput } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const basic = ref('')
const clearable = ref('可清空的内容')
const limited = ref('Zt UI')
const domain = ref('zt-ui')
const imports = `import { ref } from 'vue'\nimport { ZtInput } from '@ztechjs/zt-ui'`
const codeBasic = sfc(`${imports}\n\nconst value = ref('')`, `<ZtInput v-model="value" placeholder="请输入内容" />\n<span>当前值：{{ value || '暂无' }}</span>`)
const codeClearable = sfc(`${imports}\n\nconst value = ref('可清空的内容')`, `<ZtInput v-model="value" clearable placeholder="输入后可一键清空" />\n<ZtInput v-model="value" maxlength="20" show-word-limit />`)
const codeSlots = sfc(`${imports}\n\nconst domain = ref('zt-ui')`, `<ZtInput v-model="domain">\n  <template #prepend>https://</template>\n  <template #prefix>🔎</template>\n  <template #suffix>.com</template>\n  <template #append>访问</template>\n</ZtInput>`)
const codeStatus = sfc(`${imports}\n\nconst value = ref('状态示例')`, `<ZtInput v-model="value" status="success" />\n<ZtInput v-model="value" status="warning" />\n<ZtInput v-model="value" status="error" aria-label="校验失败" />`)
const codeSize = sfc(`${imports}\n\nconst value = ref('尺寸示例')`, `<ZtInput v-model="value" size="mini" />\n<ZtInput v-model="value" size="small" />\n<ZtInput v-model="value" size="default" />\n<ZtInput v-model="value" size="medium" />\n<ZtInput v-model="value" size="large" />`)
const codeStates = sfc(`${imports}\n\nconst value = ref('不可编辑的内容')`, `<ZtInput v-model="value" disabled />\n<ZtInput v-model="value" readonly />`)
</script>

<template>
  <div class="doc-section input-doc">
    <h1>Input 输入框</h1><p>通过鼠标或键盘输入文本，支持组合插槽、状态提示和统一尺寸。</p>
    <h2>基础用法</h2><DemoBlock :code="codeBasic" desc="使用 v-model 双向绑定文本。"><div class="input-demo"><ZtInput v-model="basic" placeholder="请输入内容" /><span>当前值：{{ basic || '暂无' }}</span></div></DemoBlock>
    <h2>清空与字数限制</h2><DemoBlock :code="codeClearable" desc="clearable 提供清空按钮；maxlength 配合 show-word-limit 显示字数。"><div class="input-demo"><ZtInput v-model="clearable" clearable placeholder="输入后可一键清空" /><ZtInput v-model="limited" :maxlength="20" show-word-limit /></div></DemoBlock>
    <h2>组合插槽</h2><DemoBlock :code="codeSlots" desc="prepend、append、prefix 和 suffix 可组合扩展输入内容。"><ZtInput v-model="domain"><template #prepend>https://</template><template #prefix>🔎</template><template #suffix>.com</template><template #append>访问</template></ZtInput></DemoBlock>
    <h2>校验状态</h2><DemoBlock :code="codeStatus" desc="status 提供成功、警告和错误边框反馈。"><div class="input-demo"><ZtInput model-value="状态正确" status="success" /><ZtInput model-value="请注意格式" status="warning" /><ZtInput model-value="校验失败" status="error" aria-label="校验失败" /></div></DemoBlock>
    <h2>尺寸</h2><DemoBlock :code="codeSize" desc="支持 mini、small、default、medium、large 五档尺寸。"><div class="input-demo"><ZtInput model-value="Mini" size="mini" /><ZtInput model-value="Small" size="small" /><ZtInput model-value="Default" size="default" /><ZtInput model-value="Medium" size="medium" /><ZtInput model-value="Large" size="large" /></div></DemoBlock>
    <h2>禁用与只读</h2><DemoBlock :code="codeStates" desc="disabled 禁止操作，readonly 保留可聚焦和复制能力。"><div class="input-demo"><ZtInput model-value="禁用内容" disabled /><ZtInput model-value="只读内容" readonly /></div></DemoBlock>

    <h2>API</h2><h3>Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>v-model</code></td><td><code>string | number | null</code></td><td><code>''</code></td><td>绑定值，输入时输出字符串</td></tr><tr><td><code>type</code></td><td><code>string</code></td><td><code>text</code></td><td>原生 input 类型</td></tr><tr><td><code>size</code></td><td><code>mini | small | default | medium | large</code></td><td><code>default</code></td><td>尺寸</td></tr><tr><td><code>status</code></td><td><code>default | success | warning | error</code></td><td><code>default</code></td><td>校验状态</td></tr><tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示清空按钮</td></tr><tr><td><code>disabled / readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用或只读</td></tr><tr><td><code>maxlength</code></td><td><code>number</code></td><td>—</td><td>最大字符数</td></tr><tr><td><code>showWordLimit</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示字数，需要 maxlength</td></tr>
    </tbody></table>
    <h3>Events</h3><table class="doc-table"><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody><tr><td><code>input / change</code></td><td><code>value</code></td><td>输入或提交内容</td></tr><tr><td><code>focus / blur</code></td><td><code>FocusEvent</code></td><td>获得或失去焦点</td></tr><tr><td><code>clear</code></td><td>—</td><td>点击清空按钮</td></tr></tbody></table>
    <h3>Slots</h3><table class="doc-table"><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody><tr><td><code>prefix / suffix</code></td><td>输入区内部前后内容</td></tr><tr><td><code>prepend / append</code></td><td>输入区外部前后内容</td></tr></tbody></table>
  </div>
</template>

<style scoped>.input-demo { display: grid; gap: 12px; width: min(100%, 440px); } .input-demo > span { color: #6b7280; font-size: 13px; }</style>
