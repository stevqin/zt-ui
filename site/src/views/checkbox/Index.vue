<script setup lang="ts">
import { computed, ref } from 'vue'
import { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const checked = ref(true)
const unchecked = ref(false)
const group = ref(['A'])
const statusGroup = ref(['A', 'B'])
const bordered = ref(['阅读'])
const cities = ['上海', '杭州', '宁波', '南京']
const selectedCities = ref(['上海', '杭州'])
const allChecked = computed(() => selectedCities.value.length === cities.length)
const indeterminate = computed(() => selectedCities.value.length > 0 && !allChecked.value)
function toggleAll(value: boolean) { selectedCities.value = value ? [...cities] : [] }

const imports = `import { ref } from 'vue'\nimport { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui'`
const codeBasic = sfc(`${imports}\n\nconst first = ref(false)\nconst second = ref(true)`, `<ZtCheckbox v-model="first">选项一</ZtCheckbox>\n<ZtCheckbox v-model="second">选项二（默认选中）</ZtCheckbox>`)
const codeDisabled = sfc(`${imports}\n\nconst checked = ref(true)\nconst unchecked = ref(false)`, `<ZtCheckbox v-model="checked" disabled>禁用已选</ZtCheckbox>\n<ZtCheckbox v-model="unchecked" disabled>禁用未选</ZtCheckbox>`)
const codeGroup = sfc(`${imports}\n\nconst value = ref(['A'])`, `<ZtCheckboxGroup v-model="value">\n  <ZtCheckbox value="A">选项 A</ZtCheckbox>\n  <ZtCheckbox value="B">选项 B</ZtCheckbox>\n  <ZtCheckbox value="C">选项 C</ZtCheckbox>\n</ZtCheckboxGroup>`)
const codeStatus = sfc(`${imports}\n\nconst value = ref(['A', 'B'])`, `<ZtCheckboxGroup v-model="value" status="primary"><ZtCheckbox value="A">Primary</ZtCheckbox><ZtCheckbox value="B">选项 B</ZtCheckbox></ZtCheckboxGroup>\n<ZtCheckboxGroup v-model="value" status="success"><ZtCheckbox value="A">Success</ZtCheckbox><ZtCheckbox value="B">选项 B</ZtCheckbox></ZtCheckboxGroup>\n<ZtCheckboxGroup v-model="value" status="danger"><ZtCheckbox value="A">Danger</ZtCheckbox><ZtCheckbox value="B">选项 B</ZtCheckbox></ZtCheckboxGroup>`)
const codeIndeterminate = sfc(`import { computed, ref } from 'vue'\nimport { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui'\n\nconst options = ['上海', '杭州', '宁波', '南京']\nconst selected = ref(['上海', '杭州'])\nconst all = computed(() => selected.value.length === options.length)\nconst partial = computed(() => selected.value.length > 0 && !all.value)\nfunction toggleAll(value: boolean) { selected.value = value ? [...options] : [] }`, `<ZtCheckbox :model-value="all" :indeterminate="partial" @change="toggleAll">全选</ZtCheckbox>\n<ZtCheckboxGroup v-model="selected">\n  <ZtCheckbox v-for="item in options" :key="item" :value="item">{{ item }}</ZtCheckbox>\n</ZtCheckboxGroup>`)
const codeBorder = sfc(`${imports}\n\nconst value = ref(['阅读'])`, `<ZtCheckboxGroup v-model="value" size="small">\n  <ZtCheckbox value="阅读" border>阅读</ZtCheckbox>\n  <ZtCheckbox value="旅行" border>旅行</ZtCheckbox>\n  <ZtCheckbox value="编程" border>编程</ZtCheckbox>\n</ZtCheckboxGroup>`)
const codeSize = sfc(`${imports}\n\nconst value = ref(['选中'])`, `<ZtCheckboxGroup v-model="value" size="mini"><ZtCheckbox value="选中" border>Mini</ZtCheckbox></ZtCheckboxGroup>\n<ZtCheckboxGroup v-model="value" size="small"><ZtCheckbox value="选中" border>Small</ZtCheckbox></ZtCheckboxGroup>\n<ZtCheckboxGroup v-model="value" size="medium"><ZtCheckbox value="选中" border>Medium</ZtCheckbox></ZtCheckboxGroup>\n<ZtCheckboxGroup v-model="value" size="large"><ZtCheckbox value="选中" border>Large</ZtCheckbox></ZtCheckboxGroup>`)
</script>

<template>
  <div class="doc-section">
    <h1>Checkbox 多选框</h1><p>在一组备选项中进行多选。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="codeBasic" desc="使用 v-model 绑定布尔值。"><div class="demo-row"><ZtCheckbox v-model="unchecked">选项一</ZtCheckbox><ZtCheckbox v-model="checked">选项二（默认选中）</ZtCheckbox></div></DemoBlock>
    <h2>禁用</h2>
    <DemoBlock :code="codeDisabled" desc="设置 disabled 禁用。"><div class="demo-row"><ZtCheckbox v-model="checked" disabled>禁用已选</ZtCheckbox><ZtCheckbox v-model="unchecked" disabled>禁用未选</ZtCheckbox></div></DemoBlock>
    <h2>CheckboxGroup 组合</h2>
    <DemoBlock :code="codeGroup" desc="CheckboxGroup 使用数组统一管理多选。"><div class="demo-row"><ZtCheckboxGroup v-model="group"><ZtCheckbox value="A">选项 A</ZtCheckbox><ZtCheckbox value="B">选项 B</ZtCheckbox><ZtCheckbox value="C">选项 C</ZtCheckbox></ZtCheckboxGroup></div></DemoBlock>
    <h2>颜色状态</h2>
    <DemoBlock :code="codeStatus" desc="通过 CheckboxGroup 的 status 设置选中颜色。"><div class="demo-row"><ZtCheckboxGroup v-model="statusGroup" status="primary"><ZtCheckbox value="A">Primary</ZtCheckbox><ZtCheckbox value="B">选项 B</ZtCheckbox></ZtCheckboxGroup></div><div class="demo-row"><ZtCheckboxGroup v-model="statusGroup" status="success"><ZtCheckbox value="A">Success</ZtCheckbox><ZtCheckbox value="B">选项 B</ZtCheckbox></ZtCheckboxGroup></div><div class="demo-row"><ZtCheckboxGroup v-model="statusGroup" status="danger"><ZtCheckbox value="A">Danger</ZtCheckbox><ZtCheckbox value="B">选项 B</ZtCheckbox></ZtCheckboxGroup></div></DemoBlock>
    <h2>半选状态</h2>
    <DemoBlock :code="codeIndeterminate" desc="indeterminate 常用于全选逻辑。"><div class="demo-row"><ZtCheckbox :model-value="allChecked" :indeterminate="indeterminate" @change="toggleAll">全选</ZtCheckbox></div><div class="demo-row"><ZtCheckboxGroup v-model="selectedCities"><ZtCheckbox v-for="city in cities" :key="city" :value="city">{{ city }}</ZtCheckbox></ZtCheckboxGroup></div></DemoBlock>
    <h2>带边框</h2>
    <DemoBlock :code="codeBorder" desc="设置 border 展示带边框样式。"><div class="demo-row"><ZtCheckboxGroup v-model="bordered" size="small"><ZtCheckbox value="阅读" border>阅读</ZtCheckbox><ZtCheckbox value="旅行" border>旅行</ZtCheckbox><ZtCheckbox value="编程" border>编程</ZtCheckbox></ZtCheckboxGroup></div></DemoBlock>
    <h2>尺寸</h2>
    <DemoBlock :code="codeSize" desc="支持 mini、small、default、medium、large。"><div class="demo-row"><ZtCheckboxGroup v-model="bordered" size="mini"><ZtCheckbox value="阅读" border>Mini</ZtCheckbox></ZtCheckboxGroup><ZtCheckboxGroup v-model="bordered" size="small"><ZtCheckbox value="阅读" border>Small</ZtCheckbox></ZtCheckboxGroup><ZtCheckboxGroup v-model="bordered" size="medium"><ZtCheckbox value="阅读" border>Medium</ZtCheckbox></ZtCheckboxGroup><ZtCheckboxGroup v-model="bordered" size="large"><ZtCheckbox value="阅读" border>Large</ZtCheckbox></ZtCheckboxGroup></div></DemoBlock>

    <h2>API</h2><h3>Checkbox Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>v-model</code></td><td><code>boolean</code></td><td><code>false</code></td><td>单独使用时的状态</td></tr><tr><td><code>value</code></td><td><code>unknown</code></td><td>—</td><td>组内选项值</td></tr><tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用</td></tr><tr><td><code>indeterminate</code></td><td><code>boolean</code></td><td><code>false</code></td><td>半选</td></tr><tr><td><code>border</code></td><td><code>boolean</code></td><td><code>false</code></td><td>边框</td></tr><tr><td><code>size</code></td><td><code>mini | small | default | medium | large</code></td><td><code>default</code></td><td>尺寸</td></tr><tr><td><code>status</code></td><td><code>default | primary | success | warning | danger | info</code></td><td><code>primary</code></td><td>颜色</td></tr>
    </tbody></table>
  </div>
</template>
