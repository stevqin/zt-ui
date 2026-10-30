<script setup lang="ts">
import { ZtAvatar, ZtSpace } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtSpace wrap>
    <ZtAvatar alt="演示用户" status="primary">张</ZtAvatar>
    <ZtAvatar alt="李明" status="success">李</ZtAvatar>
    <ZtAvatar icon="user" alt="访客" />
    <ZtAvatar shape="square" alt="华东门店">华东</ZtAvatar>
  </ZtSpace>
</template>
