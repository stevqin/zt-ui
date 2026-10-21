<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtCheckbox,
  ZtIcon,
  ZtSelect,
  ZtTag,
  ZtTimeline,
  ZtTimelineItem,
} from '@ztechjs/zt-ui';
const reverse = ref(false),
  showDelivered = ref(true);
const placement = ref<'left' | 'right' | 'alternate'>('alternate');
const placements = [
  { label: '左右交替', value: 'alternate' },
  { label: '内容靠右', value: 'right' },
  { label: '内容靠左', value: 'left' },
];
</script>
<template>
  <div class="example">
    <div class="controls">
      <ZtCheckbox v-model="reverse">模板倒序</ZtCheckbox>
      <ZtCheckbox v-model="showDelivered">显示签收节点</ZtCheckbox>
      <ZtSelect
        v-model="placement"
        :options="placements"
        aria-label="模板时间线布局"
        style="width: 150px"
      />
    </div>
    <ZtTimeline :reverse="reverse" :placement="placement">
      <ZtTimelineItem key="created" time="09-15 09:00" status="primary">
        <template #node><ZtIcon name="clipboard" label="订单创建" /></template>
        <strong>订单创建</strong>
        <p>订单 #20260915001 已生成，等待仓库处理。</p>
      </ZtTimelineItem>
      <ZtTimelineItem
        key="picking"
        time="09-15 12:00"
        status="warning"
        hollow
        content="仓库拣货，正在核对商品与数量。"
      />
      <ZtTimelineItem
        v-if="showDelivered"
        key="delivered"
        time="09-16 10:30"
        status="success"
      >
        <template #node><ZtIcon name="check" label="签收完成" /></template>
        <template #default="{ index }"
          ><strong>物流签收</strong>
          <p>当前展示第 {{ index + 1 }} 个节点。</p>
          <ZtTag status="success" size="small">已签收</ZtTag></template
        >
      </ZtTimelineItem>
    </ZtTimeline>
    <p>
      用 ZtTimelineItem 在模板中定义 time、status、placement 和
      hollow；默认插槽写内容，#node 写图标。支持 v-if / v-for；显式传入 items
      时以数组为准，原有作用域插槽继续生效。
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
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
}
p {
  margin: 8px 0;
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
  line-height: 1.7;
}
strong {
  font-weight: 600;
}
</style>
