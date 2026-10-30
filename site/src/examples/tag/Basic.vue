<script setup lang="ts">
import { ZtTag, ZtSpace } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtSpace wrap>
    <ZtTag status="success">已发布</ZtTag>
    <ZtTag status="warning" effect="dark">待审核</ZtTag>
    <ZtTag status="danger" effect="plain">异常</ZtTag>
    <ZtTag status="primary" round>春夏新品</ZtTag>
    <ZtTag hit>重点商品</ZtTag>
  </ZtSpace>
</template>
