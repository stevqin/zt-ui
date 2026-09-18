<script setup lang="ts">
import { ref } from 'vue'
import { ZtButton } from '@ztechjs/zt-ui'
import { ZtMessage, ZtNotification, ZtMessageBox, ZtLoading as ZtFullscreenLoading } from '@ztechjs/zt-alert'
import '@ztechjs/zt-alert/style.css'

const result = ref('等待确认')

async function confirm() {
  const accepted = await ZtMessageBox.confirm({ title: '应用筛选条件？', text: '确认后查询数据。' })
  result.value = accepted ? '已确认' : '已取消'
}

async function load() {
  const loading = ZtFullscreenLoading.open({ text: '正在处理全屏任务…' })
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
  } finally {
    await loading.close()
  }
}
</script>

<template>
  <div class="feedback-example">
    <ZtButton @click="ZtMessage.success('筛选条件已应用')">Message</ZtButton>
    <ZtButton @click="ZtNotification.info({ title: '数据更新', content: '新的经营数据已就绪。' })">Notification</ZtButton>
    <ZtButton @click="confirm">MessageBox</ZtButton>
    <ZtButton @click="load">全屏 Loading</ZtButton>
    <span>{{ result }}</span>
  </div>
</template>

<style scoped>
.feedback-example { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
</style>
