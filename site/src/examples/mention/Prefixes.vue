<script setup lang="ts">
import { ref } from 'vue';
import { ZtMention, type ZtMentionSource } from '@ztechjs/zt-ui';
const value = ref('');
const source: ZtMentionSource = async (query, prefix, signal) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (signal.aborted) return [];
  return (prefix === '#' ? ['上新', '补货'] : ['张明', '李华'])
    .filter((value) => value.includes(query))
    .map((value) => ({ value }));
};
</script>

<template>
  <div class="demo">
    <ZtMention
      v-model="value"
      :prefixes="['@', '#']"
      :fetch-suggestions="source"
      placeholder="@ 人员，# 话题"
    />
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
