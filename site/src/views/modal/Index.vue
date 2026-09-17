<script setup lang="ts">
import { ref } from 'vue'
import { ZtButton, ZtModal, type ZtComponentSize } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const basicVisible = ref(false)
const footerVisible = ref(false)
const confirmLoading = ref(false)
const maskVisible = ref(false)
const fullscreenVisible = ref(false)
const fullscreen = ref(false)
const fullscreenState = ref('窗口模式')
const sizeVisible = ref(false)
const modalSize = ref<ZtComponentSize>('default')
const modalSizes: ZtComponentSize[] = ['mini', 'small', 'default', 'medium', 'large']

function openSize(size: ZtComponentSize) {
  modalSize.value = size
  sizeVisible.value = true
}

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
const codeSize = sfc(`import { ref } from 'vue'
import { ZtButton, ZtModal, type ZtComponentSize } from '@ztechjs/zt-ui'

const visible = ref(false)
const size = ref<ZtComponentSize>('default')`, `<ZtButton @click="size = 'mini'; visible = true">Mini</ZtButton>
<ZtButton @click="size = 'large'; visible = true">Large</ZtButton>
<ZtModal v-model="visible" :size="size" title="尺寸示例" show-footer>
  标题、正文、底部和内置按钮会同步调整。
</ZtModal>`)
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
    <h2>尺寸</h2>
    <DemoBlock :code="codeSize" desc="size 提供五档密度，同时调整标题栏、正文、底部和内置按钮。"><div class="demo-row"><ZtButton v-for="size in modalSizes" :key="size" :size="size" @click="openSize(size)">{{ size }}</ZtButton></div><ZtModal v-model="sizeVisible" :size="modalSize" title="尺寸示例" show-footer><p>当前尺寸：{{ modalSize }}</p></ZtModal></DemoBlock>

    </div>
</template>

<style scoped>
.overlay-demo-form { display: grid; gap: 14px; }
.overlay-demo-form label { display: grid; gap: 6px; color: #4b5563; font-size: 13px; }
.overlay-demo-form input { padding: 9px 11px; border: 1px solid #d1d5db; border-radius: 9px; font: inherit; }
.demo-state { color: #64748b; font-size: 13px; }
</style>
