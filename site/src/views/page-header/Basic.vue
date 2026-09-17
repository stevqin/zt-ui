<script setup lang="ts">
import { ref } from 'vue';
import { ZtPageHeader, ZtButton } from '@ztechjs/zt-ui';
const action = ref('');
</script>
<template>
  <div>
    <ZtPageHeader
      title="客户详情"
      description="查看客户档案与最近订单"
      @back="action = '已触发返回事件'"
      ><template #breadcrumb>客户管理 / 客户详情</template
      ><template #extra
        ><ZtButton status="primary" @click="action = '已保存'"
          >保存客户</ZtButton
        ></template
      ></ZtPageHeader
    >
    <p>{{ action }}</p>
  </div>
</template>
