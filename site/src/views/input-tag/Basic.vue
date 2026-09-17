<script setup lang="ts">
import { ref } from 'vue';
import { ZtInputTag } from '@ztechjs/zt-ui';
const values = ref(['春夏', '新品']),
  event = ref('');
</script>
<template>
  <div class="entry-demo">
    <ZtInputTag
      v-model="values"
      :max="4"
      clearable
      aria-label="商品标签"
      @limit="event = '最多四个标签'"
      @remove="event = `已删除 ${$event}`"
    />
    <p>{{ JSON.stringify(values) }} {{ event }}</p>
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
