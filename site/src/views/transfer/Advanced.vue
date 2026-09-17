<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtTransfer,
  ZtConfigProvider,
  type ZtTransferKey,
  type ZtComponentSize,
} from '@ztechjs/zt-ui';
const value = ref<ZtTransferKey[]>([]),
  disabled = ref(false),
  dark = ref(true),
  size = ref<ZtComponentSize>('small');
const sizes: ZtComponentSize[] = [
  'mini',
  'small',
  'default',
  'medium',
  'large',
];
const data = [
  { key: 'a', label: '杭州', code: 'HZ' },
  { key: 'b', label: '上海', code: 'SH' },
  { key: 'c', label: '深圳', code: 'SZ', disabled: true },
];
</script>
<template>
  <div>
    <label><input v-model="disabled" type="checkbox" />整体禁用</label
    ><label><input v-model="dark" type="checkbox" />暗色</label>
    <div class="sizes">
      <button v-for="s in sizes" :key="s" type="button" @click="size = s">
        {{ s }}
      </button>
    </div>
    <ZtConfigProvider :theme="dark ? 'dark' : 'light'" :size="size"
      ><div class="pad">
        <ZtTransfer
          v-model="value"
          :data="data"
          :disabled="disabled"
          filterable
          :filter-method="
            (q, o) =>
              `${o.label} ${o.code}`.toLowerCase().includes(q.toLowerCase())
          "
        /></div
    ></ZtConfigProvider>
    <p>可按名称或拼音缩写 HZ / SH / SZ 筛选。</p>
  </div>
</template>
<style scoped>
.pad {
  padding: 12px;
}
.sizes {
  display: flex;
  gap: 6px;
  margin: 12px 0;
  flex-wrap: wrap;
}
</style>
