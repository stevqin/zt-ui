<script setup lang="ts">
import { ref } from 'vue'
import { ZtButton, ZtDrawer, type ZtDrawerPlacement } from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'

const basicVisible = ref(false)
const placementVisible = ref(false)
const placement = ref<ZtDrawerPlacement>('right')
const footerVisible = ref(false)
const saving = ref(false)
function openAt(value: ZtDrawerPlacement) { placement.value = value; placementVisible.value = true }
function save() { saving.value = true; setTimeout(() => { saving.value = false; footerVisible.value = false }, 1200) }

const imports = `import { ref } from 'vue'\nimport { ZtButton, ZtDrawer } from '@ztechjs/zt-ui'`
const codeBasic = sfc(`${imports}\n\nconst visible = ref(false)`, `<ZtButton status="primary" @click="visible = true">打开抽屉</ZtButton>\n<ZtDrawer v-model="visible" title="筛选条件">\n  <p>抽屉正文内容。</p>\n</ZtDrawer>`)
const codePlacement = sfc(`import { ref } from 'vue'\nimport { ZtButton, ZtDrawer, type ZtDrawerPlacement } from '@ztechjs/zt-ui'\n\nconst visible = ref(false)\nconst placement = ref<ZtDrawerPlacement>('right')\nfunction open(value: ZtDrawerPlacement) { placement.value = value; visible.value = true }`, `<ZtButton @click="open('left')">左侧</ZtButton>\n<ZtButton @click="open('right')">右侧</ZtButton>\n<ZtButton @click="open('top')">顶部</ZtButton>\n<ZtButton @click="open('bottom')">底部</ZtButton>\n<ZtDrawer v-model="visible" title="方向示例" :placement="placement" :size="320">\n  <p>当前方向：{{ placement }}</p>\n</ZtDrawer>`)
const codeFooter = sfc(`${imports}\n\nconst visible = ref(false)\nconst saving = ref(false)\nfunction save() {\n  saving.value = true\n  setTimeout(() => { saving.value = false; visible.value = false }, 1200)\n}`, `<ZtButton @click="visible = true">编辑筛选</ZtButton>\n<ZtDrawer v-model="visible" title="编辑筛选" :size="520" show-footer mask-closable :confirm-loading="saving" @confirm="save">\n  <p>可组合表单或详情内容。</p>\n</ZtDrawer>`)
</script>

<template>
  <div class="doc-section">
    <h1>Drawer 抽屉</h1><p>从视口边缘滑入，用于承载筛选、详情和辅助操作。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="codeBasic" desc="使用 v-model 控制右侧抽屉。"><div class="demo-row"><ZtButton status="primary" @click="basicVisible = true">打开抽屉</ZtButton></div><ZtDrawer v-model="basicVisible" title="筛选条件"><p>这里可以放筛选项、详情或其他辅助内容。</p></ZtDrawer></DemoBlock>
    <h2>出现方向</h2>
    <DemoBlock :code="codePlacement" desc="placement 支持 left、right、top、bottom。"><div class="demo-row"><ZtButton @click="openAt('left')">左侧</ZtButton><ZtButton @click="openAt('right')">右侧</ZtButton><ZtButton @click="openAt('top')">顶部</ZtButton><ZtButton @click="openAt('bottom')">底部</ZtButton></div><ZtDrawer v-model="placementVisible" title="方向示例" :placement="placement" :size="320"><p>当前方向：{{ placement }}</p></ZtDrawer></DemoBlock>
    <h2>尺寸与底部操作</h2>
    <DemoBlock :code="codeFooter" desc="size 控制宽度或高度，并支持默认确认/取消区域。"><div class="demo-row"><ZtButton @click="footerVisible = true">编辑筛选</ZtButton></div><ZtDrawer v-model="footerVisible" title="编辑筛选" :size="520" show-footer mask-closable :confirm-loading="saving" @confirm="save"><div class="drawer-form"><label>品牌<select><option>全部品牌</option><option>玖姿</option><option>尹默</option></select></label><label>状态<select><option>全部状态</option><option>在售</option><option>停售</option></select></label></div></ZtDrawer></DemoBlock>

    </div>
</template>

<style scoped>
.drawer-form { display: grid; gap: 16px; }
.drawer-form label { display: grid; gap: 6px; color: #4b5563; font-size: 13px; }
.drawer-form select { padding: 9px 11px; border: 1px solid #d1d5db; border-radius: 9px; background: #fff; font: inherit; }
</style>
