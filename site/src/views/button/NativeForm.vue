<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton } from '@ztechjs/zt-ui';
const result = ref('尚未提交');
function submit(event: Event) {
  const data = new FormData(event.target as HTMLFormElement);
  result.value = `已提交：${data.get('name')}`;
}
</script>

<template>
  <div class="example-stack">
    <form class="example-row" @submit.prevent="submit" @reset="result = '已重置'">
      <label>姓名 <input name="name" value="林青" /></label
      ><ZtButton type="submit" status="primary">提交</ZtButton
      ><ZtButton type="reset">重置</ZtButton>
    </form>
    <p role="status">{{ result }}</p>
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
