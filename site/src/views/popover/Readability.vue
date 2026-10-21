<script setup lang="ts">
import { ZtButton, ZtPopover, ZtText } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="readability-scene">
    <div class="readability-scene__rows" aria-label="白色背景上的订单内容">
      <div v-for="index in 3" :key="index">
        <span>订单 AZ2026102{{ index }}</span><span>待发货 · 华东仓库</span><span>¥ 1,280.00</span>
      </div>
    </div>
    <div class="readability-scene__actions">
      <ZtPopover placement="top" :width="260">
        <ZtButton>查看白底上的摘要</ZtButton>
        <template #content>
          <ZtText weight="semibold">订单处理摘要</ZtText>
          <p>当前有 3 笔订单等待发货，请在今日 18:00 前完成处理。</p>
        </template>
      </ZtPopover>
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
