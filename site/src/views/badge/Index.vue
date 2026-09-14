<script setup lang="ts">
import { ref } from 'vue'
import { ZtBadge, ZtButton } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const count = ref(12)
const imports = `import { ZtBadge, ZtButton } from '@ztechjs/zt-ui'`
const codeBasic = sfc(`import { ref } from 'vue'\n${imports}\n\nconst count = ref(12)`, `<ZtBadge :value="count"><ZtButton size="small">消息</ZtButton></ZtBadge>\n<ZtBadge :value="200"><ZtButton size="small">消息</ZtButton></ZtBadge>\n<ZtBadge :value="0" show-zero><ZtButton size="small">消息</ZtButton></ZtBadge>`)
const codeSize = sfc(imports, `<ZtBadge value="8" size="mini" />
<ZtBadge value="8" size="small" />
<ZtBadge value="8" />
<ZtBadge value="8" size="medium" />
<ZtBadge value="8" size="large" />`)
const codeDot = sfc(imports, `<ZtBadge is-dot><ZtButton size="small">消息</ZtButton></ZtBadge>\n<ZtBadge is-dot><span>数据查询</span></ZtBadge>`)
const codeStatus = sfc(imports, `<ZtBadge :value="1" status="primary"><ZtButton size="small">Primary</ZtButton></ZtBadge>\n<ZtBadge :value="2" status="success"><ZtButton size="small">Success</ZtButton></ZtBadge>\n<ZtBadge :value="3" status="warning"><ZtButton size="small">Warning</ZtButton></ZtBadge>\n<ZtBadge :value="4" status="danger"><ZtButton size="small">Danger</ZtButton></ZtBadge>\n<ZtBadge :value="5" status="info"><ZtButton size="small">Info</ZtButton></ZtBadge>`)
const codeText = sfc(imports, `<ZtBadge value="new"><ZtButton size="small">消息</ZtButton></ZtBadge>\n<ZtBadge value="hot"><ZtButton size="small">评论</ZtButton></ZtBadge>`)
const codeOffset = sfc(imports, `<ZtBadge :value="1" :offset="[-6, -2]"><ZtButton size="small">消息</ZtButton></ZtBadge>\n<ZtBadge is-dot :offset="[-4, -4]"><ZtButton size="small">消息</ZtButton></ZtBadge>`)
const codeHidden = sfc(imports, `<ZtBadge :value="12" hidden><ZtButton size="small">隐藏</ZtButton></ZtBadge>\n<ZtBadge is-dot hidden><ZtButton size="small">隐藏</ZtButton></ZtBadge>`)
</script>

<template>
  <div class="doc-section">
    <h1>Badge 徽标</h1><p>出现在按钮、图标旁的数字或状态标记。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="codeBasic" desc="数字超过 max 时显示 max+；show-zero 可显示 0。"><div class="demo-row badge-row"><ZtBadge :value="count"><ZtButton size="small">消息</ZtButton></ZtBadge><ZtBadge :value="200"><ZtButton size="small">消息</ZtButton></ZtBadge><ZtBadge :value="0" show-zero><ZtButton size="small">消息</ZtButton></ZtBadge></div></DemoBlock>
    <h2>尺寸</h2>
    <DemoBlock :code="codeSize" desc="size 提供 mini、small、default、medium、large 五档尺寸。"><div class="demo-row badge-row"><ZtBadge value="8" size="mini" /><ZtBadge value="8" size="small" /><ZtBadge value="8" /><ZtBadge value="8" size="medium" /><ZtBadge value="8" size="large" /></div></DemoBlock>
    <h2>小红点</h2>
    <DemoBlock :code="codeDot" desc="设置 is-dot 以小圆点标注。"><div class="demo-row badge-row"><ZtBadge is-dot><ZtButton size="small">消息</ZtButton></ZtBadge><ZtBadge is-dot><span>数据查询</span></ZtBadge></div></DemoBlock>
    <h2>颜色状态</h2>
    <DemoBlock :code="codeStatus" desc="通过 status 设置徽标颜色。"><div class="demo-row badge-row"><ZtBadge :value="1" status="primary"><ZtButton size="small">Primary</ZtButton></ZtBadge><ZtBadge :value="2" status="success"><ZtButton size="small">Success</ZtButton></ZtBadge><ZtBadge :value="3" status="warning"><ZtButton size="small">Warning</ZtButton></ZtBadge><ZtBadge :value="4" status="danger"><ZtButton size="small">Danger</ZtButton></ZtBadge><ZtBadge :value="5" status="info"><ZtButton size="small">Info</ZtButton></ZtBadge></div></DemoBlock>
    <h2>自定义内容</h2>
    <DemoBlock :code="codeText" desc="value 也可以是字符串。"><div class="demo-row badge-row"><ZtBadge value="new"><ZtButton size="small">消息</ZtButton></ZtBadge><ZtBadge value="hot"><ZtButton size="small">评论</ZtButton></ZtBadge></div></DemoBlock>
    <h2>自定义偏移</h2>
    <DemoBlock :code="codeOffset" desc="offset 使用 [x, y] 控制徽标位置。"><div class="demo-row badge-row"><ZtBadge :value="1" :offset="[-6, -2]"><ZtButton size="small">消息</ZtButton></ZtBadge><ZtBadge is-dot :offset="[-4, -4]"><ZtButton size="small">消息</ZtButton></ZtBadge></div></DemoBlock>
    <h2>隐藏徽标</h2>
    <DemoBlock :code="codeHidden" desc="设置 hidden 隐藏徽标。"><div class="demo-row badge-row"><ZtBadge :value="12" hidden><ZtButton size="small">隐藏</ZtButton></ZtBadge><ZtBadge is-dot hidden><ZtButton size="small">隐藏</ZtButton></ZtBadge></div></DemoBlock>

    <h2>API</h2><h3>Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>value</code></td><td><code>string | number</code></td><td>—</td><td>显示值</td></tr><tr><td><code>max</code></td><td><code>number</code></td><td><code>99</code></td><td>最大值</td></tr><tr><td><code>size</code></td><td><code>mini | small | default | medium | large</code></td><td><code>default</code></td><td>尺寸</td></tr><tr><td><code>isDot</code></td><td><code>boolean</code></td><td><code>false</code></td><td>圆点模式</td></tr><tr><td><code>hidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>隐藏</td></tr><tr><td><code>status</code></td><td><code>default | primary | success | warning | danger | info</code></td><td><code>danger</code></td><td>颜色</td></tr><tr><td><code>offset</code></td><td><code>[number, number]</code></td><td>—</td><td>偏移量</td></tr>
    </tbody></table>
  </div>
</template>

<style scoped>
.badge-row { gap: 24px !important; }
</style>
