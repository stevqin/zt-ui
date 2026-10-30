<script setup lang="ts">
import { ref, watch } from 'vue';
import { ZtTimeSelect } from '@ztechjs/zt-ui';
const start = ref<string | null>('09:00');
const end = ref<string | null>(null);
watch(start, () => {
  end.value = null;
});
</script>

<template>
  <div class="demo">
    <ZtTimeSelect
      v-model="start"
      start="09:00"
      end="17:00"
      step="00:30"
      placeholder="开始时间"
    />
    <ZtTimeSelect
      v-model="end"
      start="09:00"
      end="18:00"
      step="00:30"
      :min-time="start || undefined"
      :disabled-ranges="[['12:00', '13:00']]"
      placeholder="结束时间"
    />
    <p>{{ start }} 至 {{ end || '待选择' }}</p>
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
