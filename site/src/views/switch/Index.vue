<script setup lang="ts">
import { ref } from 'vue'
import { ZtSwitch } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const basic = ref(false)
const enabled = ref(true)
const status = ref(false)
const custom = ref('1')
const imports = `import { ref } from 'vue'\nimport { ZtSwitch } from '@ztechjs/zt-ui'`
const codeBasic = sfc(`${imports}\n\nconst value = ref(false)`, `<ZtSwitch v-model="value" />\n<span>{{ value ? '开启' : '关闭' }}</span>`)
const codeText = sfc(`${imports}\n\nconst value = ref(true)`, `<ZtSwitch v-model="value" active-text="开" inactive-text="关" />\n<ZtSwitch v-model="value" active-text="ON" inactive-text="OFF" size="large" />`)
const codeStatus = sfc(`${imports}\n\nconst value = ref(true)`, `<ZtSwitch v-model="value" status="default" />\n<ZtSwitch v-model="value" status="primary" />\n<ZtSwitch v-model="value" status="success" />\n<ZtSwitch v-model="value" status="warning" />\n<ZtSwitch v-model="value" status="danger" />\n<ZtSwitch v-model="value" status="info" />`)
const codeSize = sfc(`${imports}\n\nconst value = ref(true)`, `<ZtSwitch v-model="value" size="mini" />\n<ZtSwitch v-model="value" size="small" />\n<ZtSwitch v-model="value" />\n<ZtSwitch v-model="value" size="medium" />\n<ZtSwitch v-model="value" size="large" />`)
const codeDisabled = sfc(`${imports}\n\nconst off = ref(false)\nconst on = ref(true)`, `<ZtSwitch v-model="off" disabled />\n<ZtSwitch v-model="on" disabled />\n<ZtSwitch v-model="off" loading />\n<ZtSwitch v-model="on" loading />`)
const codeCustom = sfc(`${imports}\n\nconst value = ref('1')`, `<ZtSwitch v-model="value" active-value="1" inactive-value="0" active-text="是" inactive-text="否" />\n<span>值：{{ value }}</span>`)
</script>

<template>
  <div class="doc-section">
    <h1>Switch 开关</h1><p>表示两种相互对立的状态间切换。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="codeBasic" desc="使用 v-model 绑定布尔值。"><div class="demo-row"><ZtSwitch v-model="basic" /><span>状态：{{ basic ? '开启' : '关闭' }}</span></div></DemoBlock>
    <h2>文字描述</h2>
    <DemoBlock :code="codeText" desc="通过 active-text 和 inactive-text 设置文字。"><div class="demo-row"><ZtSwitch v-model="enabled" active-text="开" inactive-text="关" /><ZtSwitch v-model="enabled" active-text="ON" inactive-text="OFF" size="large" /></div></DemoBlock>
    <h2>颜色状态</h2>
    <DemoBlock :code="codeStatus" desc="通过 status 设置开启颜色。"><div class="demo-row"><ZtSwitch v-model="status" status="default" /><ZtSwitch v-model="status" status="primary" /><ZtSwitch v-model="status" status="success" /><ZtSwitch v-model="status" status="warning" /><ZtSwitch v-model="status" status="danger" /><ZtSwitch v-model="status" status="info" /></div></DemoBlock>
    <h2>尺寸</h2>
    <DemoBlock :code="codeSize" desc="支持 mini、small、default、medium、large 五档尺寸。"><div class="demo-row"><ZtSwitch v-model="enabled" size="mini" /><ZtSwitch v-model="enabled" size="small" /><ZtSwitch v-model="enabled" /><ZtSwitch v-model="enabled" size="medium" /><ZtSwitch v-model="enabled" size="large" /></div></DemoBlock>
    <h2>禁用与加载</h2>
    <DemoBlock :code="codeDisabled" desc="disabled 禁止交互，loading 展示处理中状态。"><div class="demo-row"><ZtSwitch v-model="basic" disabled /><ZtSwitch v-model="enabled" disabled /><ZtSwitch v-model="basic" loading /><ZtSwitch v-model="enabled" loading /></div></DemoBlock>
    <h2>自定义值</h2>
    <DemoBlock :code="codeCustom" desc="active-value 和 inactive-value 可使用字符串或数字。"><div class="demo-row"><ZtSwitch v-model="custom" active-value="1" inactive-value="0" active-text="是" inactive-text="否" /><span>值：{{ custom }}</span></div></DemoBlock>

    <h2>API</h2><h3>Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>v-model</code></td><td><code>boolean | string | number</code></td><td><code>false</code></td><td>绑定值</td></tr>
      <tr><td><code>status</code></td><td><code>default | primary | success | warning | danger | info</code></td><td><code>primary</code></td><td>开启颜色</td></tr>
      <tr><td><code>size</code></td><td><code>mini | small | default | medium | large</code></td><td><code>default</code></td><td>尺寸</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用</td></tr>
      <tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>加载中</td></tr>
      <tr><td><code>activeValue / inactiveValue</code></td><td><code>boolean | string | number</code></td><td><code>true / false</code></td><td>自定义值</td></tr>
    </tbody></table>
  </div>
</template>
