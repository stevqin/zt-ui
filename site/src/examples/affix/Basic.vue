<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtAffix, ZtButton } from '@ztechjs/zt-ui';
const container = ref<HTMLElement>(),
  fixed = ref(false),
  saved = ref(0);
</script>
<template>
  <p>工具栏{{ fixed ? '已固定' : '未固定' }}</p>
  <div ref="container" class="scroll">
    <div style="height: 80px">向下滚动查看工具栏</div>
    <ZtAffix :container="() => container" :offset="0" @change="fixed = $event">
      <div class="toolbar">
        <ZtButton @click="saved++">保存 {{ saved }}</ZtButton>
      </div>
    </ZtAffix>
    <p v-for="n in 12" :key="n">报表配置区块 {{ n }}</p>
  </div>
</template>
<style scoped>
.scroll {
  height: 260px;
  overflow: auto;
  border: 1px solid #8884;
  padding: 12px;
}
.toolbar {
  padding: 8px;
  background: var(--glass-surface, Canvas);
  border: 1px solid #8883;
}
</style>
