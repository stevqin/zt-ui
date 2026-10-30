<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtTimeline, ZtButton } from '@ztechjs/zt-ui';
const reverse = ref(false);
const events = [
  {
    key: 'created',
    time: '10-28 09:00',
    content: '订单创建',
    status: 'primary' as const,
  },
  {
    key: 'shipped',
    time: '10-29 14:20',
    content: '华东仓已发货',
    status: 'success' as const,
  },
  {
    key: 'transit',
    time: '10-30 08:10',
    content: '运输中，预计今日送达',
    status: 'warning' as const,
    hollow: true,
  },
];
</script>
<template>
  <ZtButton @click="reverse = !reverse">
    {{ reverse ? '按时间正序' : '最新事件在前' }}
  </ZtButton>
  <ZtTimeline :items="events" :reverse="reverse" />
</template>
