<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtCheckbox,
  ZtTimeline,
  ZtConfigProvider,
  ZtIcon,
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
  <div class="example">
    <div class="controls">
      <ZtCheckbox v-model="dark">暗色</ZtCheckbox
      ><ZtCheckbox v-model="left">左侧内容</ZtCheckbox>
    </div>
    <ZtConfigProvider :theme="dark ? 'dark' : 'light'">
      <div class="pad">
        <ZtTimeline
          :items="items"
          :placement="left ? 'left' : 'right'"
          size="large"
        >
          <template #node="{ item }">
            <ZtIcon
              :name="
                item.status === 'success'
                  ? 'check'
                  : item.status === 'danger'
                    ? 'warning'
                    : 'info'
              "
              :label="
                item.status === 'success'
                  ? '成功'
                  : item.status === 'danger'
                    ? '异常'
                    : '信息'
              "
            />
          </template>
        </ZtTimeline>
      </div>
    </ZtConfigProvider>
    <p>
      自定义节点使用
      ZtIcon，图标保持等比并继承节点状态颜色；窄屏自动收拢为单列。
    </p>
  </div>
</template>
<style scoped>
.example {
  display: grid;
  gap: 16px;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}
.pad {
  padding: 16px;
  background: var(--zt-surface, #fff);
  border-radius: var(--zt-radius, 8px);
}
p {
  margin: 0;
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
  line-height: 1.7;
}
</style>
