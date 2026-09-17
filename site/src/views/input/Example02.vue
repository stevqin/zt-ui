<script setup lang="ts">
import { ref } from 'vue';
import { ZtInput } from '@ztechjs/zt-ui';
const clearable = ref('可清空的内容');
const limited = ref('Zt UI');
</script>

<template>
  <div class="input-demo">
    <ZtInput v-model="clearable" clearable placeholder="输入后可一键清空" /><ZtInput
      v-model="limited"
      :maxlength="20"
      show-word-limit
    />
  </div>
</template>

<style scoped>
.input-demo {
  display: grid;
  gap: 12px;
  width: min(100%, 440px);
}
.input-demo > span {
  color: #6b7280;
  font-size: 13px;
}
</style>
