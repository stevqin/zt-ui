<script setup lang="ts">
import { ref } from 'vue';
import { ZtMention } from '@ztechjs/zt-ui';
const value = ref('请 @');
const people = [
  { value: '张明', label: '张明 · 商品部' },
  { value: '李华', label: '李华 · 运营部' },
];
</script>

<template>
  <div class="demo">
    <ZtMention
      v-model="value"
      :options="people"
      clearable
      placeholder="输入 @ 提及同事"
    />
    <p>{{ value }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
