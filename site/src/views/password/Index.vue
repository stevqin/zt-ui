<script setup lang="ts">
import { ref } from 'vue'
import { ZtPassword } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const password = ref('')
const clearable = ref('Zt-ui@2026')
const imports = `import { ref } from 'vue'\nimport { ZtPassword } from '@ztechjs/zt-ui'`
const codeBasic = sfc(`${imports}\n\nconst password = ref('')`, `<ZtPassword v-model="password" placeholder="请输入密码" autocomplete="current-password" />`)
const codeOptions = sfc(`${imports}\n\nconst password = ref('Zt-ui@2026')`, `<ZtPassword v-model="password" clearable />\n<ZtPassword v-model="password" :show-toggle="false" />`)
const codeStatus = sfc(`${imports}\n\nconst password = ref('secret')`, `<ZtPassword v-model="password" status="success" />\n<ZtPassword v-model="password" status="warning" />\n<ZtPassword v-model="password" status="error" />`)
const codeSize = sfc(`${imports}\n\nconst password = ref('secret')`, `<ZtPassword v-model="password" size="mini" />\n<ZtPassword v-model="password" size="small" />\n<ZtPassword v-model="password" size="default" />\n<ZtPassword v-model="password" size="medium" />\n<ZtPassword v-model="password" size="large" />`)
const codeStates = sfc(`${imports}\n\nconst password = ref('secret')`, `<ZtPassword v-model="password" disabled />\n<ZtPassword v-model="password" readonly />`)
</script>

<template>
  <div class="doc-section password-doc">
    <h1>Password 密码框</h1><p>专门用于密码输入，默认提供可访问的显隐切换按钮。</p>
    <h2>基础用法</h2><DemoBlock :code="codeBasic" desc="点击眼睛图标可切换密码可见状态。"><div class="password-demo"><ZtPassword v-model="password" placeholder="请输入密码" autocomplete="current-password" /></div></DemoBlock>
    <h2>清空与隐藏切换按钮</h2><DemoBlock :code="codeOptions" desc="支持清空，也可以通过 show-toggle 关闭显隐按钮。"><div class="password-demo"><ZtPassword v-model="clearable" clearable /><ZtPassword v-model="clearable" :show-toggle="false" /></div></DemoBlock>
    <h2>校验状态</h2><DemoBlock :code="codeStatus" desc="沿用 Input 的 success、warning 和 error 状态。"><div class="password-demo"><ZtPassword model-value="secret" status="success" /><ZtPassword model-value="secret" status="warning" /><ZtPassword model-value="secret" status="error" /></div></DemoBlock>
    <h2>尺寸</h2><DemoBlock :code="codeSize" desc="支持 mini、small、default、medium、large 五档尺寸。"><div class="password-demo"><ZtPassword model-value="secret" size="mini" /><ZtPassword model-value="secret" size="small" /><ZtPassword model-value="secret" size="default" /><ZtPassword model-value="secret" size="medium" /><ZtPassword model-value="secret" size="large" /></div></DemoBlock>
    <h2>禁用与只读</h2><DemoBlock :code="codeStates" desc="disabled 会禁用输入与显隐操作，readonly 适合仅查看场景。"><div class="password-demo"><ZtPassword model-value="secret" disabled /><ZtPassword model-value="secret" readonly /></div></DemoBlock>

    <h2>API</h2><h3>Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>v-model</code></td><td><code>string | number | null</code></td><td><code>''</code></td><td>密码值</td></tr><tr><td><code>showToggle</code></td><td><code>boolean</code></td><td><code>true</code></td><td>显示密码显隐按钮</td></tr><tr><td><code>size</code></td><td><code>mini | small | default | medium | large</code></td><td><code>default</code></td><td>尺寸</td></tr><tr><td><code>status</code></td><td><code>default | success | warning | error</code></td><td><code>default</code></td><td>校验状态</td></tr><tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>允许清空</td></tr><tr><td><code>disabled / readonly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用或只读</td></tr></tbody></table>
    <h3>Events</h3><table class="doc-table"><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody><tr><td><code>visibility-change</code></td><td><code>visible</code></td><td>密码可见状态变化</td></tr><tr><td><code>input / change / clear</code></td><td><code>value</code></td><td>输入、提交或清空</td></tr><tr><td><code>focus / blur</code></td><td><code>FocusEvent</code></td><td>焦点变化</td></tr></tbody></table>
  </div>
</template>

<style scoped>.password-demo { display: grid; gap: 12px; width: min(100%, 440px); }</style>
