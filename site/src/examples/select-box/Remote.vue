<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelectBox, type ZtSelectBoxRemoteMethod } from '@ztechjs/zt-ui';
const value = ref<(string | number)[]>([]);
const options = Array.from({ length: 80 }, (_, i) => ({
  value: `SKU${i + 1}`,
  label: `SKU${i + 1}`,
}));
const remoteMethod: ZtSelectBoxRemoteMethod = async (request) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (request.mode === 'batch')
    return {
      mode: 'batch',
      matches: request.keywords.flatMap((keyword) => {
        const option = options.find((item) => item.value === keyword);
        return option ? [{ keyword, option }] : [];
      }),
    };
  const matches = options.filter((option) => option.label.includes(request.keyword));
  return {
    mode: 'search',
    options: matches.slice(
      (request.page - 1) * request.pageSize,
      request.page * request.pageSize,
    ),
    total: matches.length,
  };
};
</script>

<template>
  <div class="demo">
    <ZtSelectBox
      v-model="value"
      remote
      filterable
      :remote-method="remoteMethod"
      :page-size="10"
    />
    <p>已确认：{{ value }}</p>
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
