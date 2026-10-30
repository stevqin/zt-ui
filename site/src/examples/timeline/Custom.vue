<script setup lang="ts">
import { ZtTimeline, ZtTimelineItem, ZtIcon, ZtTag } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtTimeline placement="alternate">
    <ZtTimelineItem time="09:00" status="success">
      <template #node><ZtIcon name="check" status="success" /></template>
      <strong>提交审批</strong>
      <p>申请人：演示用户</p>
    </ZtTimelineItem>
    <ZtTimelineItem time="10:30" status="success">
      <strong>部门审核通过</strong>
      <p>审核人：李明</p>
    </ZtTimelineItem>
    <ZtTimelineItem time="待处理" status="warning" hollow>
      <strong>财务复核</strong>
      <p><ZtTag status="warning">等待处理</ZtTag></p>
    </ZtTimelineItem>
  </ZtTimeline>
</template>
