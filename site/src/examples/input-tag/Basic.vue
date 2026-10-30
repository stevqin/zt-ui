<script setup lang="ts">
import { ref } from 'vue';
import { ZtInputTag } from '@ztechjs/zt-ui';
const tags = ref(['新品', '秋冬']);
</script>

<template>
  <div class="demo">
    <ZtInputTag v-model="tags" clearable placeholder="输入关键词后回车" />
    <p>{{ tags.join('、') || '暂无标签' }}</p>
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
