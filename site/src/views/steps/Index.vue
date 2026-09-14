<script setup lang="ts">
import { ref } from 'vue'
import { ZtButton, ZtStep, ZtSteps } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const active = ref(1)
function next() { active.value = active.value >= 3 ? 0 : active.value + 1 }

const stepsImport = `import { ZtStep, ZtSteps } from '@ztechjs/zt-ui'`
const basicSteps = `<ZtSteps :active="active" finish-status="success">
  <ZtStep title="提交申请" />
  <ZtStep title="主管审批" />
  <ZtStep title="流程完成" />
</ZtSteps>`

const codeBasic = sfc(`import { ref } from 'vue'
import { ZtButton, ZtStep, ZtSteps } from '@ztechjs/zt-ui'

const active = ref(1)
function next() { active.value = active.value >= 3 ? 0 : active.value + 1 }`, `${basicSteps}
<ZtButton status="primary" @click="next">下一步</ZtButton>`)

const codeCenter = sfc(stepsImport, `<ZtSteps :active="2" align-center>
  <ZtStep title="创建订单" description="录入客户与商品信息" />
  <ZtStep title="确认库存" description="检查可用库存数量" />
  <ZtStep title="完成发货" description="生成物流与出库记录" />
</ZtSteps>`)

const codeStatus = sfc(stepsImport, `<ZtSteps :active="1" finish-status="success" process-status="error" :space="210">
  <ZtStep title="数据校验" />
  <ZtStep title="导入失败" description="请修正异常数据后重试" />
  <ZtStep title="已转人工" status="success" />
</ZtSteps>`)

const codeIcon = sfc(stepsImport, `<ZtSteps :active="1" align-center>
  <ZtStep title="上传文件">
    <template #icon><span>↑</span></template>
  </ZtStep>
  <ZtStep title="解析数据">
    <template #icon><span>◇</span></template>
  </ZtStep>
  <ZtStep title="保存结果">
    <template #icon><span>✓</span></template>
  </ZtStep>
</ZtSteps>`)

const codeVertical = sfc(stepsImport, `<div style="height: 300px">
  <ZtSteps direction="vertical" :active="1">
    <ZtStep title="创建任务" description="设置任务名称与执行周期" />
    <ZtStep title="配置参数" description="选择数据源与处理规则" />
    <ZtStep title="发布任务" description="确认配置并开始运行" />
  </ZtSteps>
</div>`)

const codeSimple = sfc(stepsImport, `<ZtSteps :active="1" finish-status="success" simple>
  <ZtStep title="选择商品" />
  <ZtStep title="确认订单" />
  <ZtStep title="完成支付" />
</ZtSteps>`)
</script>

<template>
  <div class="doc-section">
    <h1>Steps 步骤条</h1>
    <p>引导用户按照流程完成任务，当前步骤从 0 开始计算。</p>

    <h2>基础用法</h2>
    <DemoBlock :code="codeBasic" desc="active 表示当前步骤；finish-status 可以设置已完成步骤的状态。">
      <div class="steps-demo"><ZtSteps :active="active" finish-status="success"><ZtStep title="提交申请" /><ZtStep title="主管审批" /><ZtStep title="流程完成" /></ZtSteps><div class="steps-actions"><ZtButton status="primary" @click="next">下一步</ZtButton></div></div>
    </DemoBlock>

    <h2>居中布局</h2>
    <DemoBlock :code="codeCenter" desc="align-center 让标题、描述和步骤图标居中对齐。">
      <div class="steps-demo"><ZtSteps :active="2" align-center><ZtStep title="创建订单" description="录入客户与商品信息" /><ZtStep title="确认库存" description="检查可用库存数量" /><ZtStep title="完成发货" description="生成物流与出库记录" /></ZtSteps></div>
    </DemoBlock>

    <h2>步骤状态与固定间距</h2>
    <DemoBlock :code="codeStatus" desc="可分别设置完成、进行中或单个步骤的状态；space 固定每个步骤的宽度。">
      <div class="steps-demo steps-demo--scroll"><ZtSteps :active="1" finish-status="success" process-status="error" :space="210"><ZtStep title="数据校验" /><ZtStep title="导入失败" description="请修正异常数据后重试" /><ZtStep title="已转人工" status="success" /></ZtSteps></div>
    </DemoBlock>

    <h2>自定义图标</h2>
    <DemoBlock :code="codeIcon" desc="通过 icon 插槽为每个步骤提供业务图标。">
      <div class="steps-demo"><ZtSteps :active="1" align-center><ZtStep title="上传文件"><template #icon><span>↑</span></template></ZtStep><ZtStep title="解析数据"><template #icon><span>◇</span></template></ZtStep><ZtStep title="保存结果"><template #icon><span>✓</span></template></ZtStep></ZtSteps></div>
    </DemoBlock>

    <h2>竖向布局</h2>
    <DemoBlock :code="codeVertical" desc="direction 设置为 vertical 后按纵向展示，适合较长的步骤说明。">
      <div class="steps-demo steps-demo--vertical"><ZtSteps direction="vertical" :active="1"><ZtStep title="创建任务" description="设置任务名称与执行周期" /><ZtStep title="配置参数" description="选择数据源与处理规则" /><ZtStep title="发布任务" description="确认配置并开始运行" /></ZtSteps></div>
    </DemoBlock>

    <h2>简洁布局</h2>
    <DemoBlock :code="codeSimple" desc="simple 使用紧凑箭头布局，适合放在表单或弹窗顶部。">
      <div class="steps-demo"><ZtSteps :active="1" finish-status="success" simple><ZtStep title="选择商品" /><ZtStep title="确认订单" /><ZtStep title="完成支付" /></ZtSteps></div>
    </DemoBlock>

    <h2>API</h2>
    <h3>Steps Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>active</code></td><td><code>number</code></td><td><code>0</code></td><td>当前步骤索引</td></tr>
      <tr><td><code>direction</code></td><td><code>horizontal | vertical</code></td><td><code>horizontal</code></td><td>排列方向</td></tr>
      <tr><td><code>alignCenter</code></td><td><code>boolean</code></td><td><code>false</code></td><td>居中排列</td></tr>
      <tr><td><code>simple</code></td><td><code>boolean</code></td><td><code>false</code></td><td>简洁箭头布局</td></tr>
      <tr><td><code>space</code></td><td><code>number | string</code></td><td>—</td><td>步骤宽度，数字单位为 px</td></tr>
      <tr><td><code>finishStatus</code></td><td><code>ZtStepStatus</code></td><td><code>finish</code></td><td>已完成步骤状态</td></tr>
      <tr><td><code>processStatus</code></td><td><code>ZtStepStatus</code></td><td><code>process</code></td><td>当前步骤状态</td></tr>
    </tbody></table>

    <h3>Steps Events</h3>
    <table class="doc-table"><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody><tr><td><code>change</code></td><td><code>(current, previous)</code></td><td>active 变化时触发</td></tr></tbody></table>

    <h3>Step Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>步骤标题</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>步骤说明</td></tr>
      <tr><td><code>icon</code></td><td><code>string | Component</code></td><td>—</td><td>自定义图标或组件</td></tr>
      <tr><td><code>status</code></td><td><code>wait | process | finish | error | success</code></td><td>自动计算</td><td>覆盖当前步骤状态</td></tr>
    </tbody></table>

    <h3>Slots</h3>
    <table class="doc-table"><thead><tr><th>组件</th><th>插槽</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>ZtSteps</code></td><td><code>default</code></td><td>步骤内容</td></tr>
      <tr><td><code>ZtStep</code></td><td><code>icon</code></td><td>步骤图标</td></tr>
      <tr><td><code>ZtStep</code></td><td><code>title</code></td><td>步骤标题</td></tr>
      <tr><td><code>ZtStep</code></td><td><code>description</code></td><td>步骤说明</td></tr>
    </tbody></table>
  </div>
</template>

<style scoped>
.steps-demo { width: 100%; max-width: 720px; }
.steps-demo--scroll { overflow-x: auto; padding-bottom: 4px; }
.steps-demo--vertical { height: 300px; }
.steps-actions { margin-top: 24px; }
</style>
