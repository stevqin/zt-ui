<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtTimeline,
  ZtConfigProvider,
  type ZtTimelineItem,
} from '@ztechjs/zt-ui';
const dark = ref(true),
  left = ref(false);
const items: ZtTimelineItem[] = [
  { key: 'a', time: '08:00', content: '准备', status: 'info' },
  { key: 'b', time: '09:30', content: '审核通过', status: 'success' },
  { key: 'c', time: '10:00', content: '异常订单待处理', status: 'danger' },
];
</script>
<template>
  <label><input v-model="dark" type="checkbox" />暗色</label
  ><label><input v-model="left" type="checkbox" />左侧内容</label
  ><ZtConfigProvider :theme="dark ? 'dark' : 'light'"
    ><div class="pad">
      <ZtTimeline
        :items="items"
        :placement="left ? 'left' : 'right'"
        size="large"
        ><template #node="{ item }"
          ><span :aria-label="item.status">{{
            item.status === 'success'
              ? '✓'
              : item.status === 'danger'
                ? '!'
                : '•'
          }}</span></template
        ></ZtTimeline
      >
    </div></ZtConfigProvider
  >
  <p>窄屏自动收拢为单列，时间与内容始终保留。</p>
</template>
<style scoped>
.pad {
  padding: 16px;
}
</style>
