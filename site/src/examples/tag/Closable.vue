<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtTag, ZtSpace, ZtButton } from '@ztechjs/zt-ui';
const initial = ['华东区域', '示例商品', '有库存'];
const tags = ref([...initial]);
</script>
<template>
  <ZtSpace wrap>
    <ZtTag
      v-for="tag in tags"
      :key="tag"
      closable
      @close="tags = tags.filter((item) => item !== tag)"
    >
      {{ tag }}
    </ZtTag>
    <ZtButton @click="tags = [...initial]">恢复标签</ZtButton>
  </ZtSpace>
  <p>当前条件：{{ tags.join('、') || '无' }}</p>
</template>
