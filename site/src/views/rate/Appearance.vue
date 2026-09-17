<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ZtRate, ZtConfigProvider, type ZtComponentSize } from '@ztechjs/zt-ui';
const sizes: ZtComponentSize[] = [
  'mini',
  'small',
  'default',
  'medium',
  'large',
];
const values = reactive<number[]>([0, 0, 0, 0, 0]);
const dark = ref(false);
</script>
<template>
  <div class="entry-demo">
    <label><input v-model="dark" type="checkbox" />深色主题</label
    ><ZtConfigProvider :theme="dark ? 'dark' : 'light'" :border-radius="8"
      ><div class="entry-demo">
        <div v-for="(size, i) in sizes" :key="size">
          <p>{{ size }}</p>
          <ZtRate v-model="values[i]" :size="size" allow-half show-score />
        </div>
        <ZtRate
          disabled
          allow-half
          show-score
          aria-label="禁用示例"
        /></div></ZtConfigProvider
    ><ZtRate readonly allow-half show-score aria-label="只读示例" />
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
