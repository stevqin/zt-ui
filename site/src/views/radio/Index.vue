<script setup lang="ts">
import { ref } from 'vue'
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const basic = ref('1')
const group = ref('A')
const bordered = ref('1')
const sized = ref('1')
const status = ref('1')

const imports = `import { ref } from 'vue'
import { ZtRadio, ZtRadioGroup } from '@ztechjs/zt-ui'`
const codeBasic = sfc(`${imports}\n\nconst value = ref('1')`, `<ZtRadio v-model="value" label="1">选项一</ZtRadio>
<ZtRadio v-model="value" label="2">选项二</ZtRadio>`)
const codeDisabled = sfc(`${imports}\n\nconst value = ref('1')`, `<ZtRadio v-model="value" label="1" disabled>禁用已选</ZtRadio>
<ZtRadio v-model="value" label="2" disabled>禁用未选</ZtRadio>`)
const codeGroup = sfc(`${imports}\n\nconst value = ref('A')`, `<ZtRadioGroup v-model="value">
  <ZtRadio label="A">选项 A</ZtRadio>
  <ZtRadio label="B">选项 B</ZtRadio>
  <ZtRadio label="C">选项 C</ZtRadio>
</ZtRadioGroup>`)
const codeStatus = sfc(`${imports}\n\nconst value = ref('1')`, `<ZtRadioGroup v-model="value" status="primary">
  <ZtRadio label="1">Primary</ZtRadio><ZtRadio label="2">选项二</ZtRadio>
</ZtRadioGroup>
<ZtRadioGroup v-model="value" status="success">
  <ZtRadio label="1">Success</ZtRadio><ZtRadio label="2">选项二</ZtRadio>
</ZtRadioGroup>
<ZtRadioGroup v-model="value" status="danger">
  <ZtRadio label="1">Danger</ZtRadio><ZtRadio label="2">选项二</ZtRadio>
</ZtRadioGroup>`)
const codeBorder = sfc(`${imports}\n\nconst value = ref('1')`, `<ZtRadioGroup v-model="value" size="small">
  <ZtRadio label="1" border>选项一</ZtRadio>
  <ZtRadio label="2" border>选项二</ZtRadio>
</ZtRadioGroup>`)
const codeSize = sfc(`${imports}\n\nconst value = ref('1')`, `<ZtRadioGroup v-model="value" size="mini"><ZtRadio label="1" border>Mini</ZtRadio></ZtRadioGroup>
<ZtRadioGroup v-model="value" size="small"><ZtRadio label="1" border>Small</ZtRadio></ZtRadioGroup>
<ZtRadioGroup v-model="value" size="medium"><ZtRadio label="1" border>Medium</ZtRadio></ZtRadioGroup>
<ZtRadioGroup v-model="value" size="large"><ZtRadio label="1" border>Large</ZtRadio></ZtRadioGroup>`)
</script>

<template>
  <div class="doc-section">
    <h1>Radio 单选框</h1>
    <p>在一组备选项中进行单选。</p>

    <h2>基础用法</h2>
    <DemoBlock :code="codeBasic" desc="使用 v-model 绑定选中值，label 为选项值。">
      <div class="demo-row"><ZtRadio v-model="basic" label="1">选项一</ZtRadio><ZtRadio v-model="basic" label="2">选项二</ZtRadio></div>
    </DemoBlock>

    <h2>禁用</h2>
    <DemoBlock :code="codeDisabled" desc="设置 disabled 属性禁用单个 Radio。">
      <div class="demo-row"><ZtRadio v-model="basic" label="1" disabled>禁用已选</ZtRadio><ZtRadio v-model="basic" label="2" disabled>禁用未选</ZtRadio></div>
    </DemoBlock>

    <h2>RadioGroup 组合</h2>
    <DemoBlock :code="codeGroup" desc="RadioGroup 统一管理选中状态。">
      <div class="demo-row"><ZtRadioGroup v-model="group"><ZtRadio label="A">选项 A</ZtRadio><ZtRadio label="B">选项 B</ZtRadio><ZtRadio label="C">选项 C</ZtRadio></ZtRadioGroup></div>
    </DemoBlock>

    <h2>颜色状态</h2>
    <DemoBlock :code="codeStatus" desc="通过 RadioGroup 的 status 设置选中颜色。">
      <div class="demo-row"><ZtRadioGroup v-model="status" status="primary"><ZtRadio label="1">Primary</ZtRadio><ZtRadio label="2">选项二</ZtRadio></ZtRadioGroup></div>
      <div class="demo-row"><ZtRadioGroup v-model="status" status="success"><ZtRadio label="1">Success</ZtRadio><ZtRadio label="2">选项二</ZtRadio></ZtRadioGroup></div>
      <div class="demo-row"><ZtRadioGroup v-model="status" status="danger"><ZtRadio label="1">Danger</ZtRadio><ZtRadio label="2">选项二</ZtRadio></ZtRadioGroup></div>
    </DemoBlock>

    <h2>带边框</h2>
    <DemoBlock :code="codeBorder" desc="设置 border 属性展示带边框的 Radio。">
      <div class="demo-row"><ZtRadioGroup v-model="bordered" size="small"><ZtRadio label="1" border>选项一</ZtRadio><ZtRadio label="2" border>选项二</ZtRadio></ZtRadioGroup></div>
    </DemoBlock>

    <h2>尺寸</h2>
    <DemoBlock :code="codeSize" desc="RadioGroup 可统一设置 mini、small、medium、large 尺寸。">
      <div class="demo-row"><ZtRadioGroup v-model="sized" size="mini"><ZtRadio label="1" border>Mini</ZtRadio></ZtRadioGroup><ZtRadioGroup v-model="sized" size="small"><ZtRadio label="1" border>Small</ZtRadio></ZtRadioGroup><ZtRadioGroup v-model="sized" size="medium"><ZtRadio label="1" border>Medium</ZtRadio></ZtRadioGroup><ZtRadioGroup v-model="sized" size="large"><ZtRadio label="1" border>Large</ZtRadio></ZtRadioGroup></div>
    </DemoBlock>

    </div>
</template>
