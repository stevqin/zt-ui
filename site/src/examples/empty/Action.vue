<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtEmpty, ZtButton } from '@ztechjs/zt-ui';
const drafts = ref<string[]>([]);
</script>
<template>
  <ZtEmpty v-if="drafts.length === 0" description="还没有调拨草稿">
    <ZtButton status="primary" @click="drafts.push('调拨草稿 001')">新建调拨单</ZtButton>
  </ZtEmpty>
  <div v-else>
    <p v-for="draft in drafts" :key="draft">{{ draft }}</p>
    <ZtButton @click="drafts = []">删除草稿</ZtButton>
  </div>
</template>
