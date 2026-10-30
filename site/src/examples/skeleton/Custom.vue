<script setup lang="ts">
import { ZtSkeleton, ZtSkeletonItem, ZtSpace } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtSkeleton>
    <template #template>
      <ZtSpace direction="vertical" align="stretch" style="max-width: 320px">
        <ZtSkeletonItem shape="image" :height="150" />
        <ZtSpace>
          <ZtSkeletonItem shape="circle" :width="40" :height="40" />
          <ZtSkeletonItem :width="180" />
        </ZtSpace>
        <ZtSkeletonItem :width="'75%'" />
      </ZtSpace>
    </template>
  </ZtSkeleton>
</template>
