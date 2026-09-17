<script setup lang="ts">
import { ref } from 'vue';
import { ZtWatermark, ZtButton } from '@ztechjs/zt-ui';
const rotate = ref(-22),
  dense = ref(false);
</script>
<template>
  <div class="controls">
    <ZtButton @click="rotate = rotate === 0 ? -22 : 0">切换角度</ZtButton
    ><ZtButton @click="dense = !dense">切换密度</ZtButton>
  </div>
  <ZtWatermark
    :content="['内部资料', '运营分析 2026']"
    :rotate="rotate"
    :gap="dense ? [20, 20] : [80, 80]"
    :opacity="0.2"
    ><div class="document">
      <h3>季度经营报告</h3>
      <p>本区域为可交互内容，水印覆盖层不会拦截鼠标或触摸。</p>
      <p>季度销售、库存与费用数据仅用于演示。</p>
      <ZtButton>查看详情</ZtButton>
    </div></ZtWatermark
  >
</template>
<style scoped>
.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.document {
  min-height: 280px;
  padding: 28px;
  border: 1px solid #8a9ab044;
  border-radius: 8px;
}
</style>
