<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtPopconfirm } from '@ztechjs/zt-ui';
const message = ref('等待确认');
</script>

<template>
  <div class="readability-scene">
    <div class="readability-scene__rows" aria-label="白色背景上的订单内容">
      <div v-for="index in 3" :key="index">
        <span>订单 AZ2026102{{ index }}</span><span>待发货 · 华东仓库</span><span>¥ 1,280.00</span>
      </div>
    </div>
    <div class="readability-scene__actions">
      <ZtPopconfirm title="确认提交本次操作？" description="请核对订单信息，提交后将通知仓库处理。" placement="top" @confirm="message = '已提交'" @cancel="message = '已取消'">
        <ZtButton>在白底上确认</ZtButton>
      </ZtPopconfirm>
      <span class="readability-scene__status">{{ message }}</span>
    </div>
  </div>
</template>

<style scoped>
.readability-scene {
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  color: #475569;
}
.readability-scene__rows { display: grid; gap: 0; }
.readability-scene__rows > div {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 20px;
  padding: 11px 0;
  border-bottom: 1px solid #edf0f4;
  font-size: 13px;
}
.readability-scene__actions { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 14px; padding-top: 24px; }
.readability-scene__status { color: #475569; font-size: 13px; }
.readability-scene p { margin: 6px 0 0; }
</style>
