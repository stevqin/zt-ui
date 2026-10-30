<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtWatermark, ZtButton } from '@ztechjs/zt-ui';
const count = ref(0);
</script>
<template>
  <ZtWatermark :content="['示例组织', '内部报表 · 演示用户']">
    <div style="padding: 48px 24px">
      <h3>华东区域经营报表</h3>
      <p>销售额 ¥128,600 · 毛利率 62.3%</p>
      <ZtButton @click="count++">标记已核对 {{ count }}</ZtButton>
    </div>
  </ZtWatermark>
</template>
