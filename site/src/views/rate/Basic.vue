<script setup lang="ts">
import { ref } from 'vue';
import { ZtRate } from '@ztechjs/zt-ui';
const value = ref(2.5),
  event = ref('');
</script>
<template>
  <div class="entry-demo">
    <ZtRate
      v-model="value"
      allow-half
      clearable
      show-score
      label="服务评分"
      @change="event = `已评分 ${$event}`"
    />
    <p>{{ event || '点击星星的左半边选择半星；重复点击当前分值清空。' }}</p>
  </div>
</template>
<style scoped>
.entry-demo {
  display: grid;
  gap: 14px;
  width: min(100%, 480px);
}
p {
  margin: 0;
  color: var(--zt-text-secondary, #667085);
  font-size: 13px;
}
pre {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
label {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
