<script setup lang="ts">
import { ref } from 'vue'
import { ZtButton, ZtModal } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const basicVisible = ref(false)
const footerVisible = ref(false)
const confirmLoading = ref(false)
const maskVisible = ref(false)
const fullscreenVisible = ref(false)
const fullscreen = ref(false)
const fullscreenState = ref('窗口模式')

function save() {
  confirmLoading.value = true
  setTimeout(() => {
    confirmLoading.value = false
    footerVisible.value = false
  }, 1200)
}

async function guardClose() {
  await new Promise(resolve => setTimeout(resolve, 350))
  return true
}

function handleFullscreenChange(value: boolean) {
  fullscreenState.value = value ? '全屏模式' : '窗口模式'
}

const imports = `import { ref } from 'vue'\nimport { ZtButton, ZtModal } from '@ztechjs/zt-ui'`
const codeBasic = sfc(`${imports}\n\nconst visible = ref(false)`, `<ZtButton status="primary" @click="visible = true">打开弹窗</ZtButton>\n<ZtModal v-model="visible" title="基础弹窗">\n  <p>这里是弹窗正文。</p>\n</ZtModal>`)
const codeFooter = sfc(`${imports}\n\nconst visible = ref(false)\nconst saving = ref(false)\nfunction save() {\n  saving.value = true\n  setTimeout(() => { saving.value = false; visible.value = false }, 1200)\n}`, `<ZtButton status="primary" @click="visible = true">编辑资料</ZtButton>\n<ZtModal v-model="visible" title="编辑资料" show-footer :confirm-loading="saving" @confirm="save">\n  <p>确认按钮由使用方完成校验或保存后关闭弹窗。</p>\n</ZtModal>`)
const codeMask = sfc(`${imports}\n\nconst visible = ref(false)\nasync function beforeClose() {\n  await new Promise(resolve => setTimeout(resolve, 350))\n  return true\n}`, `<ZtButton @click="visible = true">遮罩与关闭拦截</ZtButton>\n<ZtModal v-model="visible" title="关闭行为" mask-closable :before-close="beforeClose">\n  <p>点击遮罩、关闭按钮或按 Escape 都会经过 beforeClose。</p>\n</ZtModal>`)
const codeFullscreen = sfc(`${imports}\n\nconst visible = ref(false)\nconst fullscreen = ref(false)\nfunction handleFullscreenChange(value: boolean) {\n  console.log(value ? '进入全屏' : '退出全屏')\n}`, `<ZtButton @click="visible = true">打开工作区</ZtButton>\n<ZtModal\n  v-model="visible"\n  v-model:fullscreen="fullscreen"\n  title="可拖拽工作区"\n  show-fullscreen-button\n  draggable\n  @fullscreen-change="handleFullscreenChange"\n>\n  <p>拖动标题栏移动弹窗，点击右上角按钮切换全屏。</p>\n</ZtModal>`)
</script>

<template>
  <div class="doc-section">
    <h1>Modal 弹窗</h1><p>在当前页面上方集中呈现需要用户处理的内容。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="codeBasic" desc="使用 v-model 控制显示状态。"><div class="demo-row"><ZtButton status="primary" @click="basicVisible = true">打开弹窗</ZtButton></div><ZtModal v-model="basicVisible" title="基础弹窗"><p>这里是弹窗正文，可放置表单、提示或详情内容。</p></ZtModal></DemoBlock>
    <h2>底部操作与加载</h2>
    <DemoBlock :code="codeFooter" desc="confirm 由使用方处理，保存完成后再关闭弹窗。"><div class="demo-row"><ZtButton status="primary" @click="footerVisible = true">编辑资料</ZtButton></div><ZtModal v-model="footerVisible" title="编辑资料" show-footer :confirm-loading="confirmLoading" @confirm="save"><div class="overlay-demo-form"><label>姓名<input value="安小正"></label><label>部门<input value="信息中心"></label></div></ZtModal></DemoBlock>
    <h2>遮罩与关闭拦截</h2>
    <DemoBlock :code="codeMask" desc="关闭按钮、遮罩和 Escape 都统一经过 beforeClose。"><div class="demo-row"><ZtButton @click="maskVisible = true">测试关闭行为</ZtButton></div><ZtModal v-model="maskVisible" title="关闭行为" mask-closable :before-close="guardClose"><p>点击遮罩、关闭按钮或按 Escape，组件会等待异步拦截完成。</p></ZtModal></DemoBlock>
    <h2>全屏与拖拽</h2>
    <DemoBlock :code="codeFullscreen" desc="拖动标题栏移动弹窗，使用 header 按钮切换全屏。"><div class="demo-row"><ZtButton @click="fullscreenVisible = true">打开工作区</ZtButton><span class="demo-state">{{ fullscreenState }}</span></div><ZtModal v-model="fullscreenVisible" v-model:fullscreen="fullscreen" title="可拖拽工作区" show-fullscreen-button draggable @fullscreen-change="handleFullscreenChange"><p>拖动标题栏可在视口内移动弹窗，点击右上角按钮进入或退出全屏。</p></ZtModal></DemoBlock>

    <h2>API</h2><h3>Props</h3>
    <table class="doc-table"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
      <tr><td><code>v-model</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示状态</td></tr><tr><td><code>v-model:fullscreen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>全屏状态</td></tr><tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>标题</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td><code>560</code></td><td>宽度</td></tr><tr><td><code>top</code></td><td><code>number | string</code></td><td>—</td><td>顶部偏移</td></tr><tr><td><code>showFullscreenButton</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示 header 全屏按钮</td></tr><tr><td><code>draggable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>允许拖动 header</td></tr><tr><td><code>showFooter</code></td><td><code>boolean</code></td><td><code>false</code></td><td>默认底部</td></tr><tr><td><code>maskClosable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>遮罩关闭</td></tr><tr><td><code>escClosable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Escape 关闭</td></tr><tr><td><code>beforeClose</code></td><td><code>(reason) =&gt; boolean | Promise</code></td><td>—</td><td>关闭拦截</td></tr>
    </tbody></table>
    <h3>Events</h3><table class="doc-table"><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody><tr><td><code>open / opened</code></td><td>—</td><td>开始/完成打开</td></tr><tr><td><code>close / closed</code></td><td><code>reason</code></td><td>开始/完成关闭</td></tr><tr><td><code>confirm / cancel</code></td><td>—</td><td>确认/取消</td></tr><tr><td><code>update:fullscreen / fullscreen-change</code></td><td><code>boolean</code></td><td>全屏状态变化</td></tr></tbody></table>
    <h3>Slots</h3><table class="doc-table"><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody><tr><td><code>default</code></td><td>正文</td></tr><tr><td><code>title</code></td><td>标题</td></tr><tr><td><code>footer</code></td><td>底部操作</td></tr></tbody></table>
  </div>
</template>

<style scoped>
.overlay-demo-form { display: grid; gap: 14px; }
.overlay-demo-form label { display: grid; gap: 6px; color: #4b5563; font-size: 13px; }
.overlay-demo-form input { padding: 9px 11px; border: 1px solid #d1d5db; border-radius: 9px; font: inherit; }
.demo-state { color: #64748b; font-size: 13px; }
</style>
