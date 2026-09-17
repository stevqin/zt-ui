<script setup lang="ts">
import { ref } from 'vue';
import { ZtTypography } from '@ztechjs/zt-ui';
const result = ref('');
</script>
<template>
  <div>
    <ZtTypography variant="title" :level="2" text="数据观察" /><ZtTypography
      variant="paragraph"
      >本周新增客户
      <ZtTypography strong status="primary" text="328 位" />，请关注
      <ZtTypography mark text="新客转化" />。</ZtTypography
    ><ZtTypography
      code
      copyable
      text="ORDER-20260917"
      @copy="result = '编号复制成功'"
      @copy-error="result = '浏览器未允许剪贴板访问'"
    />
    <p>{{ result }}</p>
  </div>
</template>
