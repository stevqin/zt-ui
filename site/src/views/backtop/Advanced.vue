<script setup lang="ts">
import { ref } from 'vue';
import { ZtBacktop, ZtConfigProvider, ZtButton } from '@ztechjs/zt-ui';
const panel = ref<HTMLElement>();
const size = ref<'mini' | 'small' | 'default' | 'medium' | 'large'>('default');
const sizes = ['mini', 'small', 'default', 'medium', 'large'] as const;
</script>
<template>
  <div>
    <div class="sizes">
      <ZtButton v-for="item in sizes" :key="item" @click="size = item">{{
        item
      }}</ZtButton>
    </div>
    <div ref="panel" class="panel">
      <p v-for="n in 20" :key="n">自定义按钮内容 {{ n }}</p>
    </div>
    <ZtConfigProvider theme="dark" :size="size" :border-radius="20"
      ><ZtBacktop
        :container="() => panel"
        :visibility-height="60"
        :right="80"
        :bottom="90"
        label="返回示例顶部"
        ><span aria-hidden="true">⇧</span></ZtBacktop
      ></ZtConfigProvider
    >
  </div>
</template>
<style scoped>
.sizes {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.panel {
  height: 180px;
  overflow: auto;
  padding: 12px;
  border: 1px solid #8a9ab044;
}
</style>
