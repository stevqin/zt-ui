<script setup lang="ts">
import { ref } from 'vue'
import { ZtTag, type ZtTagStatus } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const tags = ref<{ label: string; status: ZtTagStatus }[]>([
  { label: '默认', status: 'default' }, { label: '主要', status: 'primary' },
  { label: '成功', status: 'success' }, { label: '警告', status: 'warning' },
])
function removeTag(index: number) { tags.value.splice(index, 1) }

const tagImport = `import { ZtTag } from '@ztechjs/zt-ui'`
const statuses = `<ZtTag>默认</ZtTag>\n<ZtTag status="primary">主要</ZtTag>\n<ZtTag status="success">成功</ZtTag>\n<ZtTag status="warning">警告</ZtTag>\n<ZtTag status="danger">危险</ZtTag>\n<ZtTag status="info">信息</ZtTag>`
const codeBasic = sfc(tagImport, statuses)
const codeEffect = sfc(tagImport, `<ZtTag effect="light" status="primary">Light</ZtTag>\n<ZtTag effect="dark" status="primary">Dark</ZtTag>\n<ZtTag effect="plain" status="primary">Plain</ZtTag>`)
const codeSize = sfc(tagImport, `<ZtTag size="mini" status="primary">Mini</ZtTag>\n<ZtTag size="small" status="primary">Small</ZtTag>\n<ZtTag status="primary">Default</ZtTag>\n<ZtTag size="medium" status="primary">Medium</ZtTag>\n<ZtTag size="large" status="primary">Large</ZtTag>`)
const codeRound = sfc(tagImport, `<ZtTag round>默认</ZtTag>\n<ZtTag round status="primary">主要</ZtTag>\n<ZtTag round status="success">成功</ZtTag>\n<ZtTag round status="danger">危险</ZtTag>`)
const codeClosable = sfc(`import { ref } from 'vue'\nimport { ZtTag, type ZtTagStatus } from '@ztechjs/zt-ui'\n\nconst tags = ref<{ label: string; status: ZtTagStatus }[]>([\n  { label: '主要', status: 'primary' },\n  { label: '成功', status: 'success' },\n])\nfunction remove(index: number) { tags.value.splice(index, 1) }`, `<ZtTag v-for="(tag, index) in tags" :key="tag.label" :status="tag.status" closable @close="remove(index)">\n  {{ tag.label }}\n</ZtTag>`)
const codeHit = sfc(tagImport, `<ZtTag hit>默认</ZtTag>\n<ZtTag hit status="primary">主要</ZtTag>\n<ZtTag hit status="success">成功</ZtTag>\n<ZtTag hit status="danger">危险</ZtTag>`)
</script>

<template>
  <div class="doc-section">
    <h1>Tag 标签</h1><p>用于标记和分类。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="codeBasic" desc="status 定义标签颜色。"><div class="demo-row"><ZtTag>默认</ZtTag><ZtTag status="primary">主要</ZtTag><ZtTag status="success">成功</ZtTag><ZtTag status="warning">警告</ZtTag><ZtTag status="danger">危险</ZtTag><ZtTag status="info">信息</ZtTag></div></DemoBlock>
    <h2>主题</h2>
    <DemoBlock :code="codeEffect" desc="effect 支持 light、dark、plain。"><div class="demo-row"><ZtTag effect="light" status="primary">Light</ZtTag><ZtTag effect="dark" status="primary">Dark</ZtTag><ZtTag effect="plain" status="primary">Plain</ZtTag></div></DemoBlock>
    <h2>尺寸</h2>
    <DemoBlock :code="codeSize" desc="支持五种尺寸。"><div class="demo-row"><ZtTag size="mini" status="primary">Mini</ZtTag><ZtTag size="small" status="primary">Small</ZtTag><ZtTag status="primary">Default</ZtTag><ZtTag size="medium" status="primary">Medium</ZtTag><ZtTag size="large" status="primary">Large</ZtTag></div></DemoBlock>
    <h2>圆角</h2>
    <DemoBlock :code="codeRound" desc="round 展示胶囊形标签。"><div class="demo-row"><ZtTag round>默认</ZtTag><ZtTag round status="primary">主要</ZtTag><ZtTag round status="success">成功</ZtTag><ZtTag round status="danger">危险</ZtTag></div></DemoBlock>
    <h2>可关闭</h2>
    <DemoBlock :code="codeClosable" desc="closable 显示关闭按钮并触发 close。"><div class="demo-row"><ZtTag v-for="(tag, index) in tags" :key="tag.label" :status="tag.status" closable @close="removeTag(index)">{{ tag.label }}</ZtTag></div></DemoBlock>
    <h2>边框描边</h2>
    <DemoBlock :code="codeHit" desc="hit 为 light 主题增加描边。"><div class="demo-row"><ZtTag hit>默认</ZtTag><ZtTag hit status="primary">主要</ZtTag><ZtTag hit status="success">成功</ZtTag><ZtTag hit status="danger">危险</ZtTag></div></DemoBlock>

    <h2>API</h2><h3>Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>status</code></td><td><code>default | primary | success | warning | danger | info</code></td><td><code>default</code></td><td>颜色</td></tr><tr><td><code>size</code></td><td><code>mini | small | default | medium | large</code></td><td><code>default</code></td><td>尺寸</td></tr><tr><td><code>effect</code></td><td><code>light | dark | plain</code></td><td><code>light</code></td><td>主题</td></tr><tr><td><code>closable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>可关闭</td></tr><tr><td><code>round</code></td><td><code>boolean</code></td><td><code>false</code></td><td>圆角</td></tr><tr><td><code>hit</code></td><td><code>boolean</code></td><td><code>false</code></td><td>描边</td></tr>
    </tbody></table>
  </div>
</template>
