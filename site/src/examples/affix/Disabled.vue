<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtAffix, ZtButton } from '@ztechjs/zt-ui';
const container = ref<HTMLElement>(),
  enabled = ref(true);
</script>
<template>
  <label>
    <input v-model="enabled" type="checkbox" />
    启用固定工具栏
  </label>
  <div ref="container" class="scroll">
    <div style="height: 70px">向下滚动</div>
    <ZtAffix :container="() => container" :disabled="!enabled" :offset="8">
      <ZtButton status="primary">筛选条件</ZtButton>
    </ZtAffix>
    <p v-for="n in 15" :key="n">商品记录 {{ n }}</p>
  </div>
</template>
<style scoped>
.scroll {
  height: 240px;
  overflow: auto;
  border: 1px solid #8884;
  padding: 12px;
}
</style>
