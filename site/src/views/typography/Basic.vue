<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtTextStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtTypography } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtTextStatus>('default');
const result = ref('');
</script>
<template>
  <div>
    <ZtTypography
      :status="demoStatus"
      variant="title"
      :level="2"
      text="数据观察"
    /><ZtTypography :status="demoStatus" variant="paragraph"
      >本周新增客户
      <ZtTypography strong :status="demoStatus" text="328 位" />，请关注
      <ZtTypography :status="demoStatus" mark text="新客转化" />。</ZtTypography
    ><ZtTypography
      :status="demoStatus"
      code
      copyable
      text="ORDER-20260917"
      @copy="result = '编号复制成功'"
      @copy-error="result = '浏览器未允许剪贴板访问'"
    />
    <p>{{ result }}</p>
  </div>
</template>
