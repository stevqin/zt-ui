<script setup lang="ts">
import { ref } from 'vue';
import { ZtCheckbox, ZtTimeline, type ZtTimelineItem } from '@ztechjs/zt-ui';
const reverse = ref(false);
const items: ZtTimelineItem[] = [
  { key: 1, time: '2026-09-15 09:00', content: '订单创建', status: 'primary' },
  {
    key: 2,
    time: '2026-09-15 12:00',
    content: '仓库拣货',
    status: 'warning',
    hollow: true,
  },
  { key: 3, time: '2026-09-16 10:30', content: '物流签收', status: 'success' },
];
</script>
<template>
  <ZtCheckbox v-model="reverse">倒序</ZtCheckbox><ZtTimeline :items="items" :reverse="reverse" placement="alternate"
    ><template #default="{ item }"
      ><strong>{{ item.content }}</strong>
      <p>订单 #20260915001</p></template
    ></ZtTimeline
  >
</template>
